import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/patient/dashboard
export async function GET(request: NextRequest) {
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

    const patient = await prisma.patient.findUnique({ where: { userId } })
    if (!patient) return errorResponse('Patient profile not found', 404)

    const now = new Date()

    const [upcomingAppointments, pastAppointments, pendingReminders] =
      await Promise.all([
        prisma.appointment.findMany({
          where: {
            patientId: patient.id,
            date: { gte: now },
            status: { in: ['CONFIRMED', 'RESCHEDULED'] },
          },
          include: {
            doctor: {
              include: { user: { select: { name: true } } },
            },
          },
          orderBy: { date: 'asc' },
          take: 5,
        }),
        prisma.appointment.findMany({
          where: {
            patientId: patient.id,
            status: 'COMPLETED',
          },
          include: {
            doctor: { include: { user: { select: { name: true } } } },
            visitNote: { include: { prescriptions: true } },
          },
          orderBy: { date: 'desc' },
          take: 5,
        }),
        prisma.medicationReminder.findMany({
          where: {
            patientId: patient.id,
            status: 'PENDING',
            scheduledAt: { gte: now },
          },
          include: { prescription: true },
          orderBy: { scheduledAt: 'asc' },
          take: 10,
        }),
      ])

    return successResponse({
      upcoming: upcomingAppointments,
      past: pastAppointments,
      medicationReminders: pendingReminders,
    })
  } catch (error) {
    console.error('[PATIENT DASHBOARD]', error)
    return errorResponse('Internal server error', 500)
  }
}
