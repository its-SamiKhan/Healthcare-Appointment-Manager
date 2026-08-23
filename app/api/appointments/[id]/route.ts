import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { sendCancellationEmail, sendRescheduleEmail } from '@/lib/email'
import { deleteCalendarEvent, updateCalendarEvent } from '@/lib/google-calendar'
import { writeAuditLog } from '@/lib/audit'

type Params = { params: Promise<{ id: string }> }

// GET /api/appointments/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: { select: { name: true, email: true } } } },
        patient: { include: { user: { select: { name: true, email: true, id: true } } } },
        symptoms: { include: { summary: true } },
        visitNote: { include: { prescriptions: true } },
        calendarEvent: true,
      },
    })

    if (!appointment) return errorResponse('Appointment not found', 404)

    return successResponse(appointment)
  } catch (error) {
    console.error('[GET APPOINTMENT]', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/appointments/[id] — cancel or reschedule
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const body = await request.json()
    const { action, newDate, newStartTime } = body // action: 'cancel' | 'reschedule'

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: { select: { name: true, id: true } } } },
        patient: { include: { user: { select: { name: true, email: true, id: true } } } },
        calendarEvent: true,
      },
    })

    if (!appointment) return errorResponse('Appointment not found', 404)
    if (['CANCELLED', 'COMPLETED'].includes(appointment.status)) {
      return errorResponse(`Cannot modify a ${appointment.status.toLowerCase()} appointment`)
    }

    if (action === 'cancel') {
      await prisma.appointment.update({
        where: { id },
        data: { status: 'CANCELLED' },
      })

      // Send cancellation email
      sendCancellationEmail({
        to: appointment.patient.user.email,
        patientName: appointment.patient.user.name,
        doctorName: appointment.doctor.user.name,
        date: appointment.date.toLocaleDateString(),
        startTime: appointment.startTime,
      }).catch(console.error)

      // Delete calendar event
      if (appointment.calendarEvent) {
        deleteCalendarEvent({
          userId: appointment.patient.user.id,
          googleEventId: appointment.calendarEvent.googleEventId,
        }).catch(console.error)
      }

      await writeAuditLog({
        actorId: userId || undefined,
        action: 'CANCEL_APPOINTMENT',
        entityType: 'Appointment',
        entityId: id,
      })

      return successResponse(null, 'Appointment cancelled')
    }

    if (action === 'reschedule') {
      if (!newDate || !newStartTime) {
        return errorResponse('newDate and newStartTime required for reschedule')
      }

      const doctor = await prisma.doctor.findUnique({
        where: { id: appointment.doctorId },
      })
      if (!doctor) return errorResponse('Doctor not found', 404)

      const endMinutes =
        parseInt(newStartTime.split(':')[0]) * 60 +
        parseInt(newStartTime.split(':')[1]) +
        doctor.slotDuration
      const newEndTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

      // Check new slot availability
      const conflict = await prisma.appointment.findFirst({
        where: {
          doctorId: appointment.doctorId,
          date: {
            gte: new Date(`${newDate}T00:00:00.000Z`),
            lte: new Date(`${newDate}T23:59:59.999Z`),
          },
          startTime: newStartTime,
          status: { in: ['CONFIRMED', 'HOLD'] },
          id: { not: id },
        },
      })

      if (conflict) {
        return errorResponse('The new slot is already booked', 409)
      }

      const oldDate = appointment.date.toLocaleDateString()
      const oldTime = appointment.startTime

      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          date: new Date(newDate),
          startTime: newStartTime,
          endTime: newEndTime,
          status: 'RESCHEDULED',
        },
      })

      // Send reschedule email
      sendRescheduleEmail({
        to: appointment.patient.user.email,
        patientName: appointment.patient.user.name,
        doctorName: appointment.doctor.user.name,
        oldDate,
        oldTime,
        newDate: new Date(newDate).toLocaleDateString(),
        newTime: newStartTime,
      }).catch(console.error)

      // Update calendar event
      if (appointment.calendarEvent) {
        updateCalendarEvent({
          userId: appointment.patient.user.id,
          googleEventId: appointment.calendarEvent.googleEventId,
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
        }).catch(console.error)
      }

      await writeAuditLog({
        actorId: userId || undefined,
        action: 'RESCHEDULE_APPOINTMENT',
        entityType: 'Appointment',
        entityId: id,
        metadata: { oldDate, oldTime, newDate, newStartTime },
      })

      return successResponse(updated, 'Appointment rescheduled')
    }

    return errorResponse('Invalid action. Use "cancel" or "reschedule"')
  } catch (error) {
    console.error('[UPDATE APPOINTMENT]', error)
    return errorResponse('Internal server error', 500)
  }
}
