import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/doctor/dashboard
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return errorResponse('Unauthorized', 401)

    const doctor = await prisma.doctor.findUnique({ where: { userId } })
    if (!doctor) return errorResponse('Doctor profile not found', 404)

    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    const [todayAppointments, upcomingAppointments, totalPatients] =
      await Promise.all([
        prisma.appointment.findMany({
          where: {
            doctorId: doctor.id,
            date: { gte: todayStart, lte: todayEnd },
            status: { in: ['CONFIRMED', 'COMPLETED', 'RESCHEDULED'] },
          },
          include: {
            patient: {
              include: { user: { select: { name: true, email: true } } },
            },
            symptoms: { include: { summary: true } },
          },
          orderBy: { startTime: 'asc' },
        }),
        prisma.appointment.findMany({
          where: {
            doctorId: doctor.id,
            date: { gt: todayEnd },
            status: { in: ['CONFIRMED', 'RESCHEDULED'] },
          },
          include: {
            patient: {
              include: { user: { select: { name: true } } },
            },
            symptoms: { include: { summary: true } },
          },
          orderBy: { date: 'asc' },
          take: 10,
        }),
        prisma.appointment.findMany({
          where: { doctorId: doctor.id, status: 'COMPLETED' },
          select: { patientId: true },
          distinct: ['patientId'],
        }),
      ])

    // Flag urgent cases (HIGH urgency from AI or high manual severity)
    const urgentCases = todayAppointments.filter(
      (a) => a.symptoms?.summary?.urgency === 'HIGH'
    )

    return successResponse({
      today: {
        appointments: todayAppointments,
        urgentCount: urgentCases.length,
      },
      upcoming: upcomingAppointments,
      stats: {
        totalPatientsServed: totalPatients.length,
        todayCount: todayAppointments.length,
        urgentToday: urgentCases.length,
      },
    })
  } catch (error) {
    console.error('[DOCTOR DASHBOARD]', error)
    return errorResponse('Internal server error', 500)
  }
}
