import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, signJWT } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

const DEFAULT_WORKING_HOURS = {
  monday: { start: '09:00', end: '17:00', available: true },
  tuesday: { start: '09:00', end: '17:00', available: true },
  wednesday: { start: '09:00', end: '17:00', available: true },
  thursday: { start: '09:00', end: '17:00', available: true },
  friday: { start: '09:00', end: '17:00', available: true },
  saturday: { start: '09:00', end: '13:00', available: false },
  sunday: { start: '09:00', end: '13:00', available: false },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role = 'PATIENT' } = body

    // Validation
    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse('Invalid email format')
    }
    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters')
    }
    if (!['ADMIN', 'DOCTOR', 'PATIENT'].includes(role)) {
      return errorResponse('Invalid role. Must be ADMIN, DOCTOR, or PATIENT')
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return errorResponse('An account with this email already exists', 409)
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        ...(role === 'DOCTOR' && {
          doctor: {
            create: {
              specialization: 'General Physician',
              workingHours: DEFAULT_WORKING_HOURS,
              slotDuration: 30,
            },
          },
        }),
        ...(role === 'PATIENT' && {
          patient: {
            create: {},
          },
        }),
      },
      include: { doctor: true, patient: true },
    })

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const response = successResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          doctor: user.doctor,
          patient: user.patient,
        },
        token,
      },
      'Registration successful',
      201
    )

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    )

    return response
  } catch (error) {
    console.error('[REGISTER]', error)
    return errorResponse('Internal server error', 500)
  }
}
