import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/admin/doctors — list all doctors with user info
export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, createdAt: true },
        },
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return successResponse(doctors)
  } catch (error) {
    console.error('[ADMIN GET DOCTORS]', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/admin/doctors — create a new doctor account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      specialization,
      bio,
      phone,
      slotDuration = 30,
      workingHours,
    } = body

    if (!name || !email || !specialization) {
      return errorResponse('Name, email, and specialization are required')
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return errorResponse('A user with this email already exists', 409)
    }

    const { hashPassword } = await import('@/lib/auth')
    // Generate a temporary password
    const tempPassword = `Temp@${Math.random().toString(36).slice(2, 10)}`
    const passwordHash = await hashPassword(tempPassword)

    const defaultWorkingHours = workingHours || {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '09:00', end: '13:00', available: false },
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'DOCTOR',
        doctor: {
          create: {
            specialization,
            bio,
            phone,
            slotDuration,
            workingHours: defaultWorkingHours,
          },
        },
      },
      include: { doctor: true },
    })

    const { writeAuditLog } = await import('@/lib/audit')
    const actorId = request.headers.get('x-user-id') || undefined
    await writeAuditLog({
      actorId,
      action: 'CREATE_DOCTOR',
      entityType: 'Doctor',
      entityId: user.doctor!.id,
      metadata: { name, email, specialization },
    })

    return successResponse(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        doctor: user.doctor,
        tempPassword, // Return temp password so admin can share with doctor
      },
      'Doctor created successfully',
      201
    )
  } catch (error) {
    console.error('[ADMIN CREATE DOCTOR]', error)
    return errorResponse('Internal server error', 500)
  }
}
