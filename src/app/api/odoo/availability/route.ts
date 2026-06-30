/* ══════════════════════════════════════════════════════════
   /api/odoo/availability — Get available reservation slots
   ══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { searchRead } from '@/lib/odoo'

// Both appointment types
const TYPE_RESERVATION = 1
const TYPE_TABLE = 2

interface BookingLine {
  id: number
  appointment_resource_id: [number, string]
  appointment_type_id: [number, string]
  capacity_reserved: number
  event_start: string
  event_stop: string
}

interface Table {
  id: number
  name: string
  capacity: number
  appointment_type_ids: number[]
}

/**
 * GET /api/odoo/availability?date=2026-06-25&guests=2
 * 
 * Returns available time slots for a given date and party size.
 * Queries both Réservation and Table appointment types.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const dateStr = searchParams.get('date')
    const guests = parseInt(searchParams.get('guests') || '2', 10)

    if (!dateStr) {
      return NextResponse.json({ error: 'date parameter is required (YYYY-MM-DD)' }, { status: 400 })
    }

    if (guests < 1 || guests > 14) {
      return NextResponse.json({ error: 'guests must be between 1 and 14' }, { status: 400 })
    }

    // Get all resources (tables) from both appointment types
    const tables = await searchRead<Table>('appointment.resource', [
      ['appointment_type_ids', 'in', [TYPE_RESERVATION, TYPE_TABLE]],
      ['active', '=', true],
    ], ['name', 'capacity', 'appointment_type_ids'])

    // Get all bookings for this date from both types
    const dayStart = `${dateStr} 00:00:00`
    const dayEnd = `${dateStr} 23:59:59`

    const bookingLines = await searchRead<BookingLine>('appointment.booking.line', [
      ['appointment_type_id', 'in', [TYPE_RESERVATION, TYPE_TABLE]],
      ['event_start', '>=', dayStart],
      ['event_start', '<=', dayEnd],
    ], ['appointment_resource_id', 'appointment_type_id', 'capacity_reserved', 'event_start', 'event_stop'])

    // Time slots: lunch (12:00-14:00) + dinner (19:00-23:00), 30-min intervals
    const timeSlots: string[] = []
    // Lunch
    for (let hour = 12; hour <= 13; hour++) {
      for (const min of [0, 30]) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
      }
    }
    // Dinner
    for (let hour = 19; hour <= 22; hour++) {
      for (const min of [0, 30]) {
        if (hour === 22 && min > 0) continue
        timeSlots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
      }
    }

    // Get day of week (0=Sun, 1=Mon, 2=Tue, ... 6=Sat)
    const dayOfWeek = new Date(dateStr).getDay()
    const isOpen = dayOfWeek >= 2 && dayOfWeek <= 6 // Tue-Sat

    // For each time slot, check total free capacity across both types
    const availability = timeSlots.map(time => {
      const slotStart = `${dateStr} ${time}:00`
      const slotEndHour = parseInt(time.split(':')[0]) + 2
      const slotEndMin = time.split(':')[1]
      const slotEnd = `${dateStr} ${slotEndHour.toString().padStart(2, '0')}:${slotEndMin}:00`

      // Find which tables are booked during this time slot
      const bookedTableIds = new Set(
        bookingLines
          .filter(bl => bl.event_start < slotEnd && bl.event_stop > slotStart)
          .map(bl => bl.appointment_resource_id[0])
      )

      // Sum capacity of all free tables
      const freeTables = tables.filter(t => !bookedTableIds.has(t.id))
      const freeCapacity = freeTables.reduce((sum, t) => sum + t.capacity, 0)

      return {
        time,
        available: freeCapacity >= guests,
        remaining: freeCapacity,
      }
    })

    return NextResponse.json({
      date: dateStr,
      guests,
      isOpen,
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
