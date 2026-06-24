/* ══════════════════════════════════════════════════════════
   /api/odoo/book — Create a reservation in Odoo
   ══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { execute, searchRead, create } from '@/lib/odoo'

const APPOINTMENT_TYPE_ID = 1

interface BookingRequest {
  date: string       // YYYY-MM-DD
  time: string       // HH:MM
  guests: number
  name: string
  email: string
  phone: string
  dietary?: string   // Dietary preferences/restrictions
  notes?: string
}

/**
 * POST /api/odoo/book
 * 
 * Creates a reservation in Odoo via the calendar.event model
 * with appointment booking lines for resource management.
 */
export async function POST(req: NextRequest) {
  try {
    const body: BookingRequest = await req.json()

    // Validate required fields
    const { date, time, guests, name, email, phone, dietary } = body
    if (!date || !time || !guests || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, guests, name, email, phone' },
        { status: 400 }
      )
    }

    if (guests < 1 || guests > 10) {
      return NextResponse.json({ error: 'Party size must be between 1 and 10' }, { status: 400 })
    }

    // Calculate start/stop datetime
    const startDatetime = `${date} ${time}:00`
    const [hourStr, minStr] = time.split(':')
    const endHour = parseInt(hourStr) + 2 // 2-hour reservation
    const stopDatetime = `${date} ${endHour.toString().padStart(2, '0')}:${minStr}:00`

    // Find a suitable free table
    const tables = await searchRead<{
      id: number
      name: string
      capacity: number
    }>('appointment.resource', [
      ['appointment_type_ids', 'in', [APPOINTMENT_TYPE_ID]],
      ['active', '=', true],
      ['capacity', '>=', guests],
    ], ['name', 'capacity'], { order: 'capacity asc' }) // Smallest suitable table first

    // Check which tables are booked
    const bookingLines = await searchRead<{
      appointment_resource_id: [number, string]
      event_start: string
      event_stop: string
    }>('appointment.booking.line', [
      ['appointment_type_id', '=', APPOINTMENT_TYPE_ID],
      ['event_start', '<', stopDatetime],
      ['event_stop', '>', startDatetime],
    ], ['appointment_resource_id', 'event_start', 'event_stop'])

    const bookedTableIds = new Set(bookingLines.map(bl => bl.appointment_resource_id[0]))
    const freeTable = tables.find(t => !bookedTableIds.has(t.id))

    if (!freeTable) {
      return NextResponse.json(
        { error: 'No tables available for this time slot. Please try another time.' },
        { status: 409 }
      )
    }

    // Find or create the guest as a partner
    const existingPartners = await searchRead<{ id: number }>('res.partner', [
      ['email', '=', email],
    ], ['id'], { limit: 1 })

    let partnerId: number
    if (existingPartners.length > 0) {
      partnerId = existingPartners[0].id
    } else {
      partnerId = await create('res.partner', {
        name,
        email,
        phone,
      })
    }

    // Create the calendar event with inline booking line
    // NOTE: Do NOT pass appointment_resource_ids — Odoo auto-links from booking_line_ids
    const eventId = await create('calendar.event', {
      name: `Réservation – ${name}`,
      start: startDatetime,
      stop: stopDatetime,
      appointment_type_id: APPOINTMENT_TYPE_ID,
      partner_ids: [[4, partnerId]],
      phone_number: phone,
      description: dietary ? `Dietary: ${dietary}` : '',
      booking_line_ids: [[0, 0, {
        appointment_type_id: APPOINTMENT_TYPE_ID,
        appointment_resource_id: freeTable.id,
        capacity_reserved: guests,
        capacity_used: guests,
      }]],
    })

    // If there's a dietary question, save the answer
    if (dietary) {
      try {
        await create('appointment.answer.input', {
          appointment_type_id: APPOINTMENT_TYPE_ID,
          question_id: 2, // "Dietary preferences" question
          calendar_event_id: eventId,
          value_text_box: dietary,
        })
      } catch {
        // Non-critical, continue
        console.warn('[Odoo] Failed to save dietary answer')
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: eventId,
      table: freeTable.name,
      datetime: startDatetime,
      guests,
      message: `Reservation confirmed for ${name} on ${date} at ${time} (${guests} guests, ${freeTable.name}).`,
    })
  } catch (error) {
    console.error('[Odoo Book]', error)
    return NextResponse.json(
      { error: 'Failed to create reservation. Please try again.' },
      { status: 500 }
    )
  }
}
