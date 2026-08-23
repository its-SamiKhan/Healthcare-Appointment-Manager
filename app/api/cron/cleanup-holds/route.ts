import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/cron/cleanup-holds
// Called by Upstash QStash every minute
// Cleans up expired slot holds so slots become available again
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'

  const isValid =
    isVercelCron ||
    secret === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isValid) {
    return errorResponse('Unauthorized', 401)
  }

  try {
    const result = await prisma.slotHold.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    })

    console.log(`[CRON] Cleaned ${result.count} expired slot holds`)
    return successResponse({ cleaned: result.count }, 'Expired holds cleaned')
  } catch (error) {
    console.error('[CRON CLEANUP HOLDS]', error)
    return errorResponse('Internal server error', 500)
  }
}
