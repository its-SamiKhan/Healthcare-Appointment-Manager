import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { writeAuditLog } from '@/lib/audit'

type Params = { params: Promise<{ id: string }> }

// GET /api/admin/doctors/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        leaves: { orderBy: { startDate: 'desc' } },
        _count: { select: { appointments: true } },
      },
    })
    if (!doctor) return errorResponse('Doctor not found', 404)
    return successResponse(doctor)
  } catch (error) {
    console.error('[GET DOCTOR]', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/admin/doctors/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, specialization, bio, phone, slotDuration, workingHours } = body

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { user: true },
    })
    if (!doctor) return errorResponse('Doctor not found', 404)

    const [updatedDoctor] = await prisma.$transaction([
      prisma.doctor.update({
        where: { id },
        data: {
          ...(specialization && { specialization }),
          ...(bio !== undefined && { bio }),
          ...(phone !== undefined && { phone }),
          ...(slotDuration && { slotDuration }),
          ...(workingHours && { workingHours }),
        },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      ...(name
        ? [prisma.user.update({ where: { id: doctor.userId }, data: { name } })]
        : []),
    ])

    const actorId = request.headers.get('x-user-id') || undefined
    await writeAuditLog({
      actorId,
      action: 'UPDATE_DOCTOR',
      entityType: 'Doctor',
      entityId: id,
      metadata: body,
    })

    return successResponse(updatedDoctor, 'Doctor updated successfully')
  } catch (error) {
    console.error('[UPDATE DOCTOR]', error)
    return errorResponse('Internal server error', 500)
  }
}

// DELETE /api/admin/doctors/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const doctor = await prisma.doctor.findUnique({ where: { id } })
    if (!doctor) return errorResponse('Doctor not found', 404)

    // Check for future confirmed appointments
    const futureAppointments = await prisma.appointment.count({
      where: {
        doctorId: id,
        date: { gte: new Date() },
        status: 'CONFIRMED',
      },
    })

    if (futureAppointments > 0) {
      return errorResponse(
        `Cannot delete doctor with ${futureAppointments} upcoming confirmed appointments. Cancel them first.`,
        409
      )
    }

    await prisma.user.delete({ where: { id: doctor.userId } })

    const actorId = request.headers.get('x-user-id') || undefined
    await writeAuditLog({
      actorId,
      action: 'DELETE_DOCTOR',
      entityType: 'Doctor',
      entityId: id,
    })

    return successResponse(null, 'Doctor deleted successfully')
  } catch (error) {
    console.error('[DELETE DOCTOR]', error)
    return errorResponse('Internal server error', 500)
  }
}
