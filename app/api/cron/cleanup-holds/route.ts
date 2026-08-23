import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/cron/cleanup-holds
// Called by Upstash QStash every minute
// Cleans up expired slot holds so slots become available again
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
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
