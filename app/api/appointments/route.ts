import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { sendBookingConfirmation } from '@/lib/email'
import { createCalendarEvent } from '@/lib/google-calendar'
import { writeAuditLog } from '@/lib/audit'

// POST /api/appointments — book an appointment (transaction-safe)
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return errorResponse('Unauthorized', 401)

    const body = await request.json()
    const { doctorId, date, startTime, notes } = body

    if (!doctorId || !date || !startTime) {
      return errorResponse('doctorId, date, and startTime are required')
    }

    // Get patient record
    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: { user: { select: { name: true, email: true } } },
    })
    if (!patient) return errorResponse('Patient profile not found', 404)

    // Get doctor + working hours
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: { select: { name: true, email: true, id: true } } },
    })
    if (!doctor) return errorResponse('Doctor not found', 404)

    const slotDate = new Date(date)
    const endMinutes =
      parseInt(startTime.split(':')[0]) * 60 +
      parseInt(startTime.split(':')[1]) +
      doctor.slotDuration
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

    // ─── CRITICAL: Database transaction with conflict check ───────────────────
    // Uses Prisma's $transaction for atomicity.
    // The raw SQL SELECT FOR UPDATE ensures row-level locking preventing race conditions.
    let appointment
    try {
      appointment = await prisma.$transaction(async (tx) => {
        // Raw SQL lock — prevents double booking under concurrent requests
        const conflicting = await tx.$queryRaw<{ id: string }[]>`
          SELECT id FROM "Appointment"
          WHERE "doctorId" = ${doctorId}
            AND date >= ${new Date(`${date}T00:00:00.000Z`)}
            AND date <= ${new Date(`${date}T23:59:59.999Z`)}
            AND "startTime" = ${startTime}
            AND status IN ('CONFIRMED', 'HOLD', 'RESCHEDULED')
          FOR UPDATE
        `

        if (conflicting.length > 0) {
          throw new Error('SLOT_CONFLICT')
        }

        // Check doctor leave
        const leave = await tx.doctorLeave.findFirst({
          where: {
            doctorId,
            startDate: { lte: slotDate },
            endDate: { gte: slotDate },
          },
        })
        if (leave) throw new Error('DOCTOR_ON_LEAVE')

        // Create appointment
        return tx.appointment.create({
          data: {
            doctorId,
            patientId: patient.id,
            date: slotDate,
            startTime,
            endTime,
            status: 'CONFIRMED',
            notes,
          },
          include: {
            doctor: { include: { user: { select: { name: true } } } },
            patient: { include: { user: { select: { name: true, email: true } } } },
          },
        })
      })
    } catch (txError) {
      if (txError instanceof Error) {
        if (txError.message === 'SLOT_CONFLICT') {
          return errorResponse(
            'This slot was just booked by someone else. Please select another slot.',
            409
          )
        }
        if (txError.message === 'DOCTOR_ON_LEAVE') {
          return errorResponse('Doctor is on leave for this date', 409)
        }
      }
      throw txError
    }

    // Release the slot hold (if any)
    await prisma.slotHold.deleteMany({
      where: { doctorId, patientId: patient.id, startTime },
    })

    // ─── Post-booking triggers (non-blocking) ────────────────────────────────
    const dateStr = slotDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Send confirmation email
    sendBookingConfirmation({
      to: patient.user.email,
      patientName: patient.user.name,
      doctorName: doctor.user.name,
      specialization: doctor.specialization,
      date: dateStr,
      startTime,
      endTime,
      appointmentId: appointment.id,
    }).catch((e) => console.error('[BOOKING EMAIL]', e))

    // Create calendar event
    createCalendarEvent({
      userId: doctor.user.id,
      appointmentId: appointment.id,
      title: `Appointment with ${patient.user.name}`,
      description: `Patient: ${patient.user.name}\nDoctor: Dr. ${doctor.user.name}\nTime: ${startTime}–${endTime}`,
      date,
      startTime,
      endTime,
      attendeeEmail: patient.user.email,
    }).catch((e) => console.error('[BOOKING CALENDAR]', e))

    // Audit log
    writeAuditLog({
      actorId: userId,
      action: 'BOOK_APPOINTMENT',
      entityType: 'Appointment',
      entityId: appointment.id,
      metadata: { doctorId, patientId: patient.id, date, startTime },
    }).catch((e) => console.error('[BOOKING AUDIT]', e))

    return successResponse(appointment, 'Appointment booked successfully', 201)
  } catch (error) {
    console.error('[BOOK APPOINTMENT]', error)
    return errorResponse('Internal server error', 500)
  }
}

// GET /api/appointments — list patient's own appointments
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const role = request.headers.get('x-user-role')
    if (!userId) return errorResponse('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let appointments

    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } })
      if (!patient) return errorResponse('Patient profile not found', 404)

      appointments = await prisma.appointment.findMany({
        where: {
          patientId: patient.id,
          ...(status && { status: status as never }),
        },
        include: {
          doctor: {
            include: { user: { select: { name: true, email: true } } },
          },
          symptoms: { include: { summary: true } },
          visitNote: { include: { prescriptions: true } },
          calendarEvent: true,
        },
        orderBy: { date: 'desc' },
      })
    } else {
      return errorResponse('Forbidden', 403)
    }

    return successResponse(appointments)
  } catch (error) {
    console.error('[GET APPOINTMENTS]', error)
    return errorResponse('Internal server error', 500)
  }
}
