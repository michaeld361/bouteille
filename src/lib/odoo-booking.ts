/* ══════════════════════════════════════════════════════════
   Shared Odoo booking helpers (availability + book)
   ══════════════════════════════════════════════════════════ */

import { searchRead } from '@/lib/odoo'

export const APPOINTMENT_TYPE_ID = 1
export const TOTAL_CAPACITY = 37
export const RESERVATION_HOURS = 2

export interface TableResource {
  id: number
  name: string
  capacity: number
  resource_id: [number, string] | false
}

export interface CalendarLeave {
  id: number
  date_from: string
  date_to: string
  resource_id: [number, string] | false
}

export interface AppointmentSlot {
  id: number
  weekday: string
  start_hour: number
  end_hour: number
  slot_type: string
}

export function getBrusselsOffset(dateStr: string): number {
  const dt = new Date(`${dateStr}T12:00:00Z`)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Brussels',
    hour12: false,
    timeZoneName: 'shortOffset',
  }).formatToParts(dt)
  const tzPart = parts.find(p => p.type === 'timeZoneName')?.value
  if (tzPart && tzPart.includes('+')) {
    return parseInt(tzPart.split('+')[1].split(':')[0], 10)
  }
  return 1
}

/** Convert Brussels local date+time to Odoo UTC datetime string `YYYY-MM-DD HH:MM:SS` */
export function brusselsToUTCString(dateStr: string, timeStr: string): string {
  const offset = getBrusselsOffset(dateStr)
  const dt = new Date(`${dateStr}T${timeStr}:00.000+0${offset}:00`)
  return dt.toISOString().replace('T', ' ').substring(0, 19)
}

/** Brussels calendar day bounds in UTC (Odoo datetime strings) */
export function brusselsDayBoundsUTC(dateStr: string): { dayStartUtc: string; dayEndUtc: string } {
  return {
    dayStartUtc: brusselsToUTCString(dateStr, '00:00'),
    dayEndUtc: brusselsToUTCString(dateStr, '23:59'),
  }
}

/** Odoo weekday: 1=Mon … 7=Sun for a YYYY-MM-DD date in Brussels */
export function brusselsOdooWeekday(dateStr: string): string {
  const noonUtc = new Date(`${dateStr}T12:00:00Z`)
  const weekdayName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Brussels',
    weekday: 'short',
  }).format(noonUtc)
  const map: Record<string, string> = {
    Mon: '1', Tue: '2', Wed: '3', Thu: '4', Fri: '5', Sat: '6', Sun: '7',
  }
  return map[weekdayName] || '1'
}

function floatHourToHHMM(hour: number): string {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function overlaps(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && endA > startB
}

export async function fetchActiveTables(): Promise<TableResource[]> {
  return searchRead<TableResource>('appointment.resource', [
    ['appointment_type_ids', 'in', [APPOINTMENT_TYPE_ID]],
    ['active', '=', true],
  ], ['name', 'capacity', 'resource_id'])
}

export async function fetchRecurringSlots(): Promise<AppointmentSlot[]> {
  return searchRead<AppointmentSlot>('appointment.slot', [
    ['appointment_type_id', '=', APPOINTMENT_TYPE_ID],
    ['slot_type', '=', 'recurring'],
  ], ['weekday', 'start_hour', 'end_hour', 'slot_type'])
}

export async function fetchLeavesForDay(dateStr: string): Promise<CalendarLeave[]> {
  const { dayStartUtc, dayEndUtc } = brusselsDayBoundsUTC(dateStr)
  // Leaves that overlap this Brussels calendar day
  return searchRead<CalendarLeave>('resource.calendar.leaves', [
    ['date_from', '<=', dayEndUtc],
    ['date_to', '>=', dayStartUtc],
  ], ['date_from', 'date_to', 'resource_id'])
}

/** resource.resource IDs that are on leave during [slotStartUtc, slotEndUtc) */
export function leaveResourceIds(
  leaves: CalendarLeave[],
  slotStartUtc: string,
  slotEndUtc: string,
): Set<number | 'all'> {
  const ids = new Set<number | 'all'>()
  for (const leave of leaves) {
    if (!overlaps(leave.date_from, leave.date_to, slotStartUtc, slotEndUtc)) continue
    if (!leave.resource_id) {
      ids.add('all')
    } else {
      ids.add(leave.resource_id[0])
    }
  }
  return ids
}

export function isTableOnLeave(
  table: TableResource,
  leaveIds: Set<number | 'all'>,
): boolean {
  if (leaveIds.has('all')) return true
  if (!table.resource_id) return false
  return leaveIds.has(table.resource_id[0])
}

/**
 * Whether the wine bar is open on this date:
 * - has a recurring appointment.slot for that weekday, AND
 * - not every table is on leave for the service window
 */
export function getScheduleForDate(
  dateStr: string,
  slots: AppointmentSlot[],
  tables: TableResource[],
  leaves: CalendarLeave[],
): {
  isOpen: boolean
  message?: string
  startHour: number
  endHour: number
  timeSlots: string[]
} {
  const weekday = brusselsOdooWeekday(dateStr)
  const daySlots = slots.filter(s => s.weekday === weekday)

  if (daySlots.length === 0) {
    return {
      isOpen: false,
      message: 'The wine bar is closed on this day.',
      startHour: 17,
      endHour: 23,
      timeSlots: [],
    }
  }

  const startHour = Math.min(...daySlots.map(s => s.start_hour))
  const endHour = Math.max(...daySlots.map(s => s.end_hour))

  // Last bookable start = endHour - reservation length
  const lastStart = endHour - RESERVATION_HOURS
  const timeSlots: string[] = []
  for (let h = startHour; h <= lastStart + 0.001; h += 0.5) {
    timeSlots.push(floatHourToHHMM(h))
  }

  // Closed day (jours de fermeture): all tables on leave for the service window
  const serviceStartUtc = brusselsToUTCString(dateStr, floatHourToHHMM(startHour))
  const serviceEndUtc = brusselsToUTCString(dateStr, floatHourToHHMM(endHour))
  const leaveIds = leaveResourceIds(leaves, serviceStartUtc, serviceEndUtc)
  const freeTables = tables.filter(t => !isTableOnLeave(t, leaveIds))

  if (freeTables.length === 0) {
    return {
      isOpen: false,
      message: 'The wine bar is closed on this day.',
      startHour,
      endHour,
      timeSlots: [],
    }
  }

  return { isOpen: true, startHour, endHour, timeSlots }
}

export function tablesAvailableForSlot(
  tables: TableResource[],
  leaves: CalendarLeave[],
  bookedAppointmentResourceIds: Set<number>,
  slotStartUtc: string,
  slotEndUtc: string,
): TableResource[] {
  const leaveIds = leaveResourceIds(leaves, slotStartUtc, slotEndUtc)
  return tables.filter(t =>
    !isTableOnLeave(t, leaveIds) && !bookedAppointmentResourceIds.has(t.id)
  )
}
