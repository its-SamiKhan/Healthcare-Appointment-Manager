import { prisma } from '@/lib/prisma'

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'HOLD' | 'LEAVE'

export interface TimeSlot {
  startTime: string
  endTime: string
  status: SlotStatus
}

interface WorkingHourDay {
  start: string
  end: string
  available: boolean
}

type WorkingHours = Record<string, WorkingHourDay>

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * Generate available slots for a doctor on a specific date.
 * Accounts for: working hours, slot duration, existing appointments,
 * active slot holds, and doctor leaves.
 */
export async function generateSlots(
  doctorId: string,
  dateStr: string // YYYY-MM-DD
): Promise<TimeSlot[]> {
  const date = new Date(dateStr)
  const dayName = DAY_NAMES[date.getDay()]

  // Fetch doctor
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } })
  if (!doctor) return []

  const workingHours = doctor.workingHours as unknown as WorkingHours
  const daySchedule = workingHours[dayName]

  if (!daySchedule || !daySchedule.available) return []

  // Check for leaves
  const leave = await prisma.doctorLeave.findFirst({
    where: {
      doctorId,
      startDate: { lte: date },
      endDate: { gte: date },
    },
  })
  if (leave) return []

  // Fetch existing confirmed/hold appointments
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: {
        gte: new Date(`${dateStr}T00:00:00.000Z`),
        lte: new Date(`${dateStr}T23:59:59.999Z`),
      },
      status: { in: ['CONFIRMED', 'HOLD', 'RESCHEDULED'] },
    },
  })

  // Fetch active slot holds (not expired)
  const activeHolds = await prisma.slotHold.findMany({
    where: {
      doctorId,
      date: {
        gte: new Date(`${dateStr}T00:00:00.000Z`),
        lte: new Date(`${dateStr}T23:59:59.999Z`),
      },
      expiresAt: { gt: new Date() },
    },
  })

  const bookedSlots = new Set<string>(
    existingAppointments.map((a) => a.startTime)
  )
  const heldSlots = new Set<string>(activeHolds.map((h) => h.startTime))

  // Generate all slots within working hours
  const slots: TimeSlot[] = []
  const startMinutes = timeToMinutes(daySchedule.start)
  const endMinutes = timeToMinutes(daySchedule.end)
  const duration = doctor.slotDuration

  for (let t = startMinutes; t + duration <= endMinutes; t += duration) {
    const startTime = minutesToTime(t)
    const endTime = minutesToTime(t + duration)

    let status: SlotStatus = 'AVAILABLE'
    if (bookedSlots.has(startTime)) status = 'BOOKED'
    else if (heldSlots.has(startTime)) status = 'HOLD'

    slots.push({ startTime, endTime, status })
  }

  return slots
}
