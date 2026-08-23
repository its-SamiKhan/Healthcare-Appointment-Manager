import { NextRequest } from 'next/server'
import { processEmailRetryQueue } from '@/lib/email'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/cron/email-retry
// Called by Upstash QStash every 5 minutes
// Retries failed email notifications with exponential backoff
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
    const result = await processEmailRetryQueue()
    console.log(`[CRON EMAIL RETRY] Processed: ${result.processed}, Retried: ${result.retried}, Exhausted: ${result.exhausted}`)
    return successResponse(result, 'Email retry queue processed')
  } catch (error) {
    console.error('[CRON EMAIL RETRY]', error)
    return errorResponse('Internal server error', 500)
  }
}
