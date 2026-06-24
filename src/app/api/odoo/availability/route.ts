/* ══════════════════════════════════════════════════════════
   /api/odoo/availability — Get available reservation slots
   ══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { searchRead } from '@/lib/odoo'

const APPOINTMENT_TYPE_ID = 1
const TOTAL_CAPACITY = 37

interface BookingLine {
  id: number
  appointment_resource_id: [number, string]
  capacity_reserved: number
  event_start: string
  event_stop: string
}

/**
 * GET /api/odoo/availability?date=2026-06-25&guests=2
 * 
 * Returns available time slots for a given date and party size.
 * Checks existing bookings against table capacity.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const dateStr = searchParams.get('date')
    const guests = parseInt(searchParams.get('guests') || '2', 10)

    if (!dateStr) {
      return NextResponse.json({ error: 'date parameter is required (YYYY-MM-DD)' }, { status: 400 })
    }

    if (guests < 1 || guests > 10) {
      return NextResponse.json({ error: 'guests must be between 1 and 10' }, { status: 400 })
    }

    // Get all resources (tables) that can fit this party size
    const tables = await searchRead<{
      id: number
      name: string
      capacity: number
    }>('appointment.resource', [
      ['appointment_type_ids', 'in', [APPOINTMENT_TYPE_ID]],
      ['active', '=', true],
    ], ['name', 'capacity'])

    // Tables that can fit the party (for parties > 2, we might need to combine tables later)
    const suitableTables = tables.filter(t => t.capacity >= guests)

    // Get all bookings for this date
    const dayStart = `${dateStr} 00:00:00`
    const dayEnd = `${dateStr} 23:59:59`

    const bookingLines = await searchRead<BookingLine>('appointment.booking.line', [
      ['appointment_type_id', '=', APPOINTMENT_TYPE_ID],
      ['event_start', '>=', dayStart],
      ['event_start', '<=', dayEnd],
    ], ['appointment_resource_id', 'capacity_reserved', 'event_start', 'event_stop'])

    // Define time slots (17:00 - 21:30, every 30 min, matching opening hours)
    const timeSlots = []
    for (let hour = 17; hour <= 21; hour++) {
      for (const min of [0, 30]) {
        if (hour === 21 && min > 0) continue // Last slot is 21:00
        timeSlots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
      }
    }

    // For each time slot, check how many suitable tables are free
    const availability = timeSlots.map(time => {
      const slotStart = `${dateStr} ${time}:00`
      const slotEndHour = parseInt(time.split(':')[0]) + 2 // 2-hour duration
      const slotEndMin = time.split(':')[1]
      const slotEnd = `${dateStr} ${slotEndHour.toString().padStart(2, '0')}:${slotEndMin}:00`

      // Find which tables are booked during this time slot (check overlap)
      const bookedTableIds = new Set(
        bookingLines
          .filter(bl => {
            const bookStart = bl.event_start
            const bookEnd = bl.event_stop
            // Overlap: starts before slot ends AND ends after slot starts
            return bookStart < slotEnd && bookEnd > slotStart
          })
          .map(bl => bl.appointment_resource_id[0])
      )

      // Count available suitable tables
      const freeTables = suitableTables.filter(t => !bookedTableIds.has(t.id))

      return {
        time,
        available: freeTables.length > 0,
        remaining: freeTables.length,
      }
    })

    // Get day of week (0=Mon, 6=Sun) to check if restaurant is open
    const dayOfWeek = new Date(dateStr).getDay()
    const isOpen = dayOfWeek >= 2 && dayOfWeek <= 6 // Tue-Sat

    return NextResponse.json({
      date: dateStr,
      guests,
      isOpen,
      totalCapacity: TOTAL_CAPACITY,
      slots: isOpen ? availability : [],
      message: !isOpen ? 'The restaurant is closed on this day.' : undefined,
    })
  } catch (error) {
    console.error('[Odoo Availability]', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
