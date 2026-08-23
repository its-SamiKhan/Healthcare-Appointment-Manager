import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, signJWT } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('Email and password are required')
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctor: true, patient: true },
    })

    // Use the same error for both not found and wrong password to prevent user enumeration
    if (!user) {
      return errorResponse('Invalid credentials', 401)
    }

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
      return errorResponse('Invalid credentials', 401)
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const response = successResponse({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctor: user.doctor,
        patient: user.patient,
      },
      token,
    })

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    )

    return response
  } catch (error) {
    console.error('[LOGIN]', error)
    return errorResponse('Internal server error', 500)
  }
}
