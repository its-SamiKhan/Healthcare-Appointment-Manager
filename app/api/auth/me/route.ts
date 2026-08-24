import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

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
        if (payload) {
          userId = payload.userId
        }
      }
    }

    if (!userId) return errorResponse('Unauthorized — no token provided', 401)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctor: true, patient: true },
    })

    if (!user) return errorResponse('User not found', 404)

    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      doctor: user.doctor,
      patient: user.patient,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('[ME]', error)
    return errorResponse('Internal server error', 500)
  }
}
