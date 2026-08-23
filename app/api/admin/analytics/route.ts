import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/admin/analytics
export async function GET() {
  try {
    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      appointmentsByStatus,
      recentAuditLogs,
      topSpecializations,
    ] = await Promise.all([
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.appointment.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.doctor.groupBy({
        by: ['specialization'],
        _count: { specialization: true },
        orderBy: { _count: { specialization: 'desc' } },
        take: 5,
      }),
    ])

    const statusMap = Object.fromEntries(
      appointmentsByStatus.map((s) => [s.status, s._count.status])
    )

    return successResponse({
      overview: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        confirmed: statusMap['CONFIRMED'] || 0,
        cancelled: statusMap['CANCELLED'] || 0,
        completed: statusMap['COMPLETED'] || 0,
        hold: statusMap['HOLD'] || 0,
      },
      topSpecializations: topSpecializations.map((s) => ({
        name: s.specialization,
        count: s._count.specialization,
      })),
      recentActivity: recentAuditLogs,
    })
  } catch (error) {
    console.error('[ADMIN ANALYTICS]', error)
    return errorResponse('Internal server error', 500)
  }
}
