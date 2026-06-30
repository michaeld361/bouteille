/* ══════════════════════════════════════════════════════════
   /api/odoo/book — Create a reservation in Odoo
   ══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { searchRead, create } from '@/lib/odoo'

// Both appointment types
const TYPE_RESERVATION = 1 // Small tables (1-2 tops)
const TYPE_TABLE = 2       // Larger tables (2-6 tops)

interface BookingRequest {
  date: string       // YYYY-MM-DD
  time: string       // HH:MM
  guests: number
  name: string
  email: string
  phone: string
  dietary?: string
}

interface Table {
  id: number
  name: string
  capacity: number
  appointment_type_ids: number[]
}

/**
 * POST /api/odoo/book
 * 
 * Creates a reservation in Odoo. Intelligently picks tables from
 * both Réservation (small) and Table (large) appointment types.
 */
export async function POST(req: NextRequest) {
  try {
    const body: BookingRequest = await req.json()

    const { date, time, guests, name, email, phone, dietary } = body
    if (!date || !time || !guests || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, guests, name, email, phone' },
        { status: 400 }
      )
    }

    if (guests < 1 || guests > 14) {
      return NextResponse.json({ error: 'Party size must be between 1 and 14' }, { status: 400 })
    }

    // Calculate start/stop datetime
    const startDatetime = `${date} ${time}:00`
    const [hourStr, minStr] = time.split(':')
    const endHour = parseInt(hourStr) + 2
    const stopDatetime = `${date} ${endHour.toString().padStart(2, '0')}:${minStr}:00`

    // Get ALL tables from both types
    const tables = await searchRead<Table>('appointment.resource', [
      ['appointment_type_ids', 'in', [TYPE_RESERVATION, TYPE_TABLE]],
      ['active', '=', true],
    ], ['name', 'capacity', 'appointment_type_ids'], { order: 'capacity desc' })

    // Check which tables are booked for this time
    const bookingLines = await searchRead<{
      appointment_resource_id: [number, string]
      event_start: string
      event_stop: string
    }>('appointment.booking.line', [
      ['appointment_type_id', 'in', [TYPE_RESERVATION, TYPE_TABLE]],
      ['event_start', '<', stopDatetime],
      ['event_stop', '>', startDatetime],
    ], ['appointment_resource_id', 'event_start', 'event_stop'])

    const bookedTableIds = new Set(bookingLines.map(bl => bl.appointment_resource_id[0]))
    const freeTables = tables.filter(t => !bookedTableIds.has(t.id))

    // Smart allocation: try to use fewest tables possible
    // 1. First try to find a single table that fits
    const singleTable = freeTables.find(t => t.capacity >= guests)

    let allocatedTables: Table[]
    if (singleTable) {
      allocatedTables = [singleTable]
    } else {
      // 2. Combine tables (largest first)
      allocatedTables = []
      let remaining = guests
      for (const table of freeTables) {
        if (remaining <= 0) break
        allocatedTables.push(table)
        remaining -= table.capacity
      }
      if (remaining > 0) {
        return NextResponse.json(
          { error: 'No tables available for this time slot. Please try another time.' },
          { status: 409 }
        )
      }
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

    // Determine which appointment type to use based on allocated tables
    // Use the type that matches the first (primary) table
    const primaryType = allocatedTables[0].appointment_type_ids[0]

    // Create booking lines — one per allocated table
    const bookingLineCommands = allocatedTables.map(table => [0, 0, {
      appointment_type_id: primaryType,
      appointment_resource_id: table.id,
      capacity_reserved: Math.min(table.capacity, guests),
      capacity_used: Math.min(table.capacity, guests),
    }])

    // Create the calendar event
    const eventId = await create('calendar.event', {
      name: `Réservation – ${name}`,
      start: startDatetime,
      stop: stopDatetime,
      appointment_type_id: primaryType,
      partner_ids: [[4, partnerId]],
      phone_number: phone,
      description: dietary ? `Dietary: ${dietary}` : '',
      booking_line_ids: bookingLineCommands,
    })

    // Save dietary answer if provided
    if (dietary) {
      try {
        await create('appointment.answer.input', {
          appointment_type_id: primaryType,
          question_id: 2,
          calendar_event_id: eventId,
          value_text_box: dietary,
        })
      } catch {
        console.warn('[Odoo] Failed to save dietary answer')
      }
    }

    const tableNames = allocatedTables.map(t => t.name).join(' + ')
    return NextResponse.json({
      success: true,
      bookingId: eventId,
      table: tableNames,
      datetime: startDatetime,
      guests,
      message: `Reservation confirmed for ${name} on ${date} at ${time} (${guests} guests, ${tableNames}).`,
    })
  } catch (error) {
    console.error('[Odoo Book]', error)
    return NextResponse.json(
      { error: 'Failed to create reservation. Please try again.' },
      { status: 500 }
    )
  }
}
