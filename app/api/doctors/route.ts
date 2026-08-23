import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/doctors?specialization=Cardiology&search=john
// Public route — no auth required for listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get('specialization')
    const search = searchParams.get('search')

    const doctors = await prisma.doctor.findMany({
      where: {
        ...(specialization && { specialization }),
        ...(search && {
          user: {
            name: { contains: search, mode: 'insensitive' },
          },
        }),
      },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { appointments: true } },
      },
      orderBy: { specialization: 'asc' },
    })

    return successResponse(doctors)
  } catch (error) {
    console.error('[GET DOCTORS PUBLIC]', error)
    return errorResponse('Internal server error', 500)
  }
}
