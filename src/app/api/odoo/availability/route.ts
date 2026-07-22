/* ══════════════════════════════════════════════════════════
   /api/odoo/availability — Get available reservation slots
   ══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { searchRead } from '@/lib/odoo'
import {
  APPOINTMENT_TYPE_ID,
  TOTAL_CAPACITY,
  RESERVATION_HOURS,
  brusselsToUTCString,
  brusselsDayBoundsUTC,
  fetchActiveTables,
  fetchRecurringSlots,
  fetchLeavesForDay,
  getScheduleForDate,
  tablesAvailableForSlot,
} from '@/lib/odoo-booking'

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
 * Respects Odoo weekly schedule (appointment.slot) and closing days
 * (resource.calendar.leaves / "jours de fermeture").
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

    const [tables, recurringSlots, leaves] = await Promise.all([
      fetchActiveTables(),
      fetchRecurringSlots(),
      fetchLeavesForDay(dateStr),
    ])

    const schedule = getScheduleForDate(dateStr, recurringSlots, tables, leaves)

    if (!schedule.isOpen) {
      return NextResponse.json({
        date: dateStr,
        guests,
        isOpen: false,
        totalCapacity: TOTAL_CAPACITY,
        slots: [],
        message: schedule.message,
      })
    }

    const { dayStartUtc, dayEndUtc } = brusselsDayBoundsUTC(dateStr)

    const bookingLines = await searchRead<BookingLine>('appointment.booking.line', [
      ['appointment_type_id', '=', APPOINTMENT_TYPE_ID],
      ['event_start', '>=', dayStartUtc],
      ['event_start', '<=', dayEndUtc],
    ], ['appointment_resource_id', 'capacity_reserved', 'event_start', 'event_stop'])

    const availability = schedule.timeSlots.map(time => {
      const [h, m] = time.split(':').map(Number)
      const endHour = h + RESERVATION_HOURS
      const endTimeStr = `${endHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      const slotStartUtc = brusselsToUTCString(dateStr, time)
      const slotEndUtc = brusselsToUTCString(dateStr, endTimeStr)

      const bookedTableIds = new Set(
        bookingLines
          .filter(bl => bl.event_start < slotEndUtc && bl.event_stop > slotStartUtc)
          .map(bl => bl.appointment_resource_id[0])
      )

      const freeTables = tablesAvailableForSlot(
        tables,
        leaves,
        bookedTableIds,
        slotStartUtc,
        slotEndUtc,
      )
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
      isOpen: true,
      totalCapacity: TOTAL_CAPACITY,
      slots: availability,
    })
  } catch (error) {
    console.error('[Odoo Availability]', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
