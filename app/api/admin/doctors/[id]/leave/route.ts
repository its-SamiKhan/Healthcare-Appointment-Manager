import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { writeAuditLog } from '@/lib/audit'
import { sendLeaveNotification } from '@/lib/email'
import { deleteCalendarEvent } from '@/lib/google-calendar'

type Params = { params: Promise<{ id: string }> }

// POST /api/admin/doctors/[id]/leave
// Marks doctor on leave, cascades to cancel all affected confirmed appointments
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: doctorId } = await params
    const body = await request.json()
    const { startDate, endDate, reason } = body

    if (!startDate || !endDate) {
      return errorResponse('startDate and endDate are required')
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      return errorResponse('startDate must be before endDate')
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: { select: { name: true } } },
    })
    if (!doctor) return errorResponse('Doctor not found', 404)

    // Find all confirmed appointments in the leave window
    const affectedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: { gte: start, lte: end },
        status: { in: ['CONFIRMED', 'RESCHEDULED'] },
      },
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true, id: true } },
          },
        },
        calendarEvent: true,
      },
    })

    // Create the leave record
    const leave = await prisma.doctorLeave.create({
      data: { doctorId, startDate: start, endDate: end, reason },
    })

    const actorId = request.headers.get('x-user-id') || undefined
    let cancelledCount = 0

    // Process affected appointments in a transaction
    if (affectedAppointments.length > 0) {
      await prisma.$transaction(
        affectedAppointments.map((apt) =>
          prisma.appointment.update({
            where: { id: apt.id },
            data: { status: 'CANCELLED' },
          })
        )
      )

      // Post-transaction: send notifications + delete calendar events
      for (const apt of affectedAppointments) {
        const patientUser = apt.patient.user

        // Send leave notification email
        try {
          await sendLeaveNotification({
            to: patientUser.email,
            patientName: patientUser.name,
            doctorName: doctor.user.name,
            date: apt.date.toLocaleDateString(),
            startTime: apt.startTime,
          })
        } catch (emailError) {
          console.error('[LEAVE EMAIL]', emailError)
        }

        // Delete Google Calendar event
        if (apt.calendarEvent) {
          try {
            await deleteCalendarEvent({
              userId: patientUser.id,
              googleEventId: apt.calendarEvent.googleEventId,
            })
          } catch (calError) {
            console.error('[LEAVE CALENDAR]', calError)
          }
        }

        // Audit log per cancellation
        await writeAuditLog({
          actorId,
          action: 'CANCEL_APPOINTMENT_LEAVE',
          entityType: 'Appointment',
          entityId: apt.id,
          metadata: {
            reason: 'Doctor leave',
            leaveId: leave.id,
            doctorId,
            patientEmail: patientUser.email,
          },
        })

        cancelledCount++
      }
    }

    await writeAuditLog({
      actorId,
      action: 'CREATE_DOCTOR_LEAVE',
      entityType: 'DoctorLeave',
      entityId: leave.id,
      metadata: { doctorId, startDate, endDate, reason, cancelledCount },
    })

    return successResponse(
      {
        leave,
        cancelledAppointments: cancelledCount,
        affectedPatients: affectedAppointments.map((a) => ({
          id: a.id,
          date: a.date,
          patientEmail: a.patient.user.email,
        })),
      },
      `Leave created. ${cancelledCount} appointment(s) cancelled and patients notified.`,
      201
    )
  } catch (error) {
    console.error('[CREATE LEAVE]', error)
    return errorResponse('Internal server error', 500)
  }
}

// GET /api/admin/doctors/[id]/leave — list leaves for a doctor
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: doctorId } = await params
    const leaves = await prisma.doctorLeave.findMany({
      where: { doctorId },
      orderBy: { startDate: 'desc' },
    })
    return successResponse(leaves)
  } catch (error) {
    console.error('[GET LEAVES]', error)
    return errorResponse('Internal server error', 500)
  }
}
