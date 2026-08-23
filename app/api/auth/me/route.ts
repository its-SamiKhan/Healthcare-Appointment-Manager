import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return errorResponse('Unauthorized', 401)

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
