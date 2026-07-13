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

function getBrusselsOffset(dateStr: string): number {
  const dt = new Date(`${dateStr}T12:00:00Z`)
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Brussels', hour12: false, timeZoneName: 'shortOffset' }).formatToParts(dt)
  const tzPart = parts.find(p => p.type === 'timeZoneName')?.value
  if (tzPart && tzPart.includes('+')) {
    return parseInt(tzPart.split('+')[1].split(':')[0], 10)
  }
  return 1
}

function brusselsToUTCString(dateStr: string, timeStr: string): string {
  const offset = getBrusselsOffset(dateStr)
  const dt = new Date(`${dateStr}T${timeStr}:00.000+0${offset}:00`)
  return dt.toISOString().replace('T', ' ').substring(0, 19)
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

    // Get all resources (tables)
    const tables = await searchRead<{
      id: number
      name: string
      capacity: number
    }>('appointment.resource', [
      ['appointment_type_ids', 'in', [APPOINTMENT_TYPE_ID]],
      ['active', '=', true],
    ], ['name', 'capacity'])

    // Get all bookings for this date
    const dayStart = `${dateStr} 00:00:00`
    const dayEnd = `${dateStr} 23:59:59`

    const bookingLines = await searchRead<BookingLine>('appointment.booking.line', [
      ['appointment_type_id', '=', APPOINTMENT_TYPE_ID],
      ['event_start', '>=', dayStart],
      ['event_start', '<=', dayEnd],
    ], ['appointment_resource_id', 'capacity_reserved', 'event_start', 'event_stop'])

    // Define time slots (17:00 - 21:00, every 30 min)
    const timeSlots = []
    for (let hour = 17; hour <= 21; hour++) {
      for (const min of [0, 30]) {
        if (hour === 21 && min > 0) continue
        timeSlots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
      }
    }

    // For each time slot, check total free capacity (combining tables)
    const availability = timeSlots.map(time => {
      const endTimeStr = `${(parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}:${time.split(':')[1]}`
      const slotStartUtc = brusselsToUTCString(dateStr, time)
      const slotEndUtc = brusselsToUTCString(dateStr, endTimeStr)

      // Find which tables are booked during this time slot
      const bookedTableIds = new Set(
        bookingLines
          .filter(bl => {
            const bookStart = bl.event_start
            const bookEnd = bl.event_stop
            return bookStart < slotEndUtc && bookEnd > slotStartUtc
          })
          .map(bl => bl.appointment_resource_id[0])
      )

      // Sum capacity of all free tables — larger parties use multiple tables
      const freeTables = tables.filter(t => !bookedTableIds.has(t.id))
      const freeCapacity = freeTables.reduce((sum, t) => sum + t.capacity, 0)

      return {
        time,
        available: freeCapacity >= guests,
        remaining: freeCapacity,
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
