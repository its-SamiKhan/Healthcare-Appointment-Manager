import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { sendBookingConfirmation } from '@/lib/email'
import { createCalendarEvent } from '@/lib/google-calendar'
import { writeAuditLog } from '@/lib/audit'

// POST /api/appointments/hold — place a 5-minute slot hold
export async function POST(request: NextRequest) {
  try {
    const patientId = request.headers.get('x-user-id')
    if (!patientId) return errorResponse('Unauthorized', 401)

    const body = await request.json()
    const { doctorId, date, startTime } = body

    if (!doctorId || !date || !startTime) {
      return errorResponse('doctorId, date, and startTime are required')
    }

    const slotDate = new Date(date)

    // Check if slot is already booked or held by someone else
    const [existingAppointment, existingHold] = await Promise.all([
      prisma.appointment.findFirst({
        where: {
          doctorId,
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          },
          startTime,
          status: { in: ['CONFIRMED', 'HOLD'] },
        },
      }),
      prisma.slotHold.findFirst({
        where: {
          doctorId,
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          },
          startTime,
          expiresAt: { gt: new Date() },
          patientId: { not: patientId },
        },
      }),
    ])

    if (existingAppointment) {
      return errorResponse('This slot is already booked', 409)
    }
    if (existingHold) {
      return errorResponse('This slot is currently being held by another user. Try again in a few minutes.', 409)
    }

    // Remove any existing hold by this patient for same slot
    await prisma.slotHold.deleteMany({
      where: { doctorId, patientId, startTime },
    })

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    const hold = await prisma.slotHold.create({
      data: {
        doctorId,
        patientId,
        date: slotDate,
        startTime,
        expiresAt,
      },
    })

    return successResponse({ hold, expiresAt }, 'Slot held for 5 minutes', 201)
  } catch (error) {
    console.error('[HOLD SLOT]', error)
    return errorResponse('Internal server error', 500)
  }
}
