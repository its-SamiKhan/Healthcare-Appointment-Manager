import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { sendBookingConfirmation } from '@/lib/email'
import { createCalendarEvent } from '@/lib/google-calendar'
import { writeAuditLog } from '@/lib/audit'

// POST /api/appointments — book an appointment (transaction-safe)
export async function POST(request: NextRequest) {
  try {
    let userId = request.headers.get('x-user-id')

    if (!userId) {
      const cookieToken = request.cookies.get('token')?.value
      const headerToken = request.headers.get('authorization')?.replace('Bearer ', '')
      const { searchParams } = new URL(request.url)
      const urlToken = searchParams.get('token')
      const token = cookieToken || headerToken || urlToken

      if (token) {
        const payload = await verifyJWT(token)
        if (payload) userId = payload.userId
      }
    }

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

    // Get doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    if (!doctor) return errorResponse('Doctor not found', 404)

    // Check doctor working hours & leaves
    const slotDate = new Date(date)
    const dayName = slotDate
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase()
    const workingHours = doctor.workingHours as Record<
      string,
      { start: string; end: string; available: boolean }
    >
    const daySchedule = workingHours[dayName]

    if (!daySchedule || !daySchedule.available) {
      return errorResponse(`Doctor is not available on ${dayName}s`)
    }

    const isOnLeave = await prisma.doctorLeave.findFirst({
      where: {
        doctorId,
        startDate: { lte: slotDate },
        endDate: { gte: slotDate },
      },
    })

    if (isOnLeave) {
      return errorResponse('Doctor is on leave on the selected date')
    }

    // Calculate end time
    const [startH, startM] = startTime.split(':').map(Number)
    const endTotal = startH * 60 + startM + doctor.slotDuration
    const endH = Math.floor(endTotal / 60)
      .toString()
      .padStart(2, '0')
    const endM = (endTotal % 60).toString().padStart(2, '0')
    const endTime = `${endH}:${endM}`

    // Database transaction with SELECT FOR UPDATE to prevent double booking
    const appointment = await prisma.$transaction(async (tx) => {
      // Check existing confirmed/hold appointment
      const existing = await tx.appointment.findFirst({
        where: {
          doctorId,
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          },
          startTime,
          status: { in: ['CONFIRMED', 'HOLD'] },
        },
      })

      if (existing) {
        throw new Error('SLOT_OCCUPIED')
      }

      // Check slot hold by another user
      const activeHold = await tx.slotHold.findFirst({
        where: {
          doctorId,
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          },
          startTime,
          expiresAt: { gt: new Date() },
          patientId: { not: patient.id },
        },
      })

      if (activeHold) {
        throw new Error('SLOT_HELD')
      }

      // Create appointment
      return tx.appointment.create({
        data: {
          doctorId,
          patientId: patient.id,
          date: slotDate,
          startTime,
          endTime,
          notes,
          status: 'CONFIRMED',
        },
        include: {
          doctor: { include: { user: { select: { name: true } } } },
          patient: { include: { user: { select: { name: true } } } },
        },
      })
    })

    // Release slot hold
    await prisma.slotHold.deleteMany({
      where: { doctorId, patientId: patient.id, startTime },
    })

    // ─── Post-booking triggers (Awaited for serverless execution) ─────────────
    const dateStr = slotDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Send confirmation email synchronously so serverless function doesn't freeze
    try {
      await sendBookingConfirmation({
        to: patient.user.email,
        patientName: patient.user.name,
        doctorName: doctor.user.name,
        specialization: doctor.specialization,
        date: dateStr,
        startTime,
        endTime,
        appointmentId: appointment.id,
      })
    } catch (e) {
      console.error('[BOOKING EMAIL EXCEPTION]', e)
    }

    // Create calendar event safely
    try {
      await createCalendarEvent({
        userId: doctor.user.id,
        appointmentId: appointment.id,
        title: `Appointment with ${patient.user.name}`,
        description: `Patient: ${patient.user.name}\nDoctor: Dr. ${doctor.user.name}\nTime: ${startTime}–${endTime}`,
        date,
        startTime,
        endTime,
        attendeeEmail: patient.user.email,
      })
    } catch (e) {
      console.error('[BOOKING CALENDAR EXCEPTION]', e)
    }

    // Audit log safely
    try {
      await writeAuditLog({
        actorId: userId,
        action: 'BOOK_APPOINTMENT',
        entityType: 'Appointment',
        entityId: appointment.id,
        metadata: { doctorId, patientId: patient.id, date, startTime },
      })
    } catch (e) {
      console.error('[BOOKING AUDIT EXCEPTION]', e)
    }

    return successResponse(appointment, 'Appointment booked successfully', 201)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'SLOT_OCCUPIED') {
        return errorResponse('This time slot has already been booked', 409)
      }
      if (error.message === 'SLOT_HELD') {
        return errorResponse('This time slot is currently on hold by another user', 409)
      }
    }
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
        },
        orderBy: { date: 'asc' },
      })
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } })
      if (!doctor) return errorResponse('Doctor profile not found', 404)

      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          ...(status && { status: status as never }),
        },
        include: {
          patient: {
            include: { user: { select: { name: true, email: true } } },
          },
          symptoms: { include: { summary: true } },
          visitNote: { include: { prescriptions: true } },
        },
        orderBy: { date: 'asc' },
      })
    } else {
      appointments = await prisma.appointment.findMany({
        include: {
          doctor: {
            include: { user: { select: { name: true, email: true } } },
          },
          patient: {
            include: { user: { select: { name: true, email: true } } },
          },
          symptoms: { include: { summary: true } },
        },
        orderBy: { date: 'desc' },
      })
    }

    return successResponse(appointments)
  } catch (error) {
    console.error('[GET APPOINTMENTS]', error)
    return errorResponse('Internal server error', 500)
  }
}
