import { NextRequest } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/google-calendar'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/calendar/callback — Google OAuth callback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const userId = request.headers.get('x-user-id')

    if (!code) return errorResponse('Authorization code missing', 400)
    if (!userId) return errorResponse('Unauthorized', 401)

    const { accessToken, refreshToken } = await exchangeCodeForTokens(code)

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
      },
    })

    // Redirect to dashboard with success
    const role = request.headers.get('x-user-role')?.toLowerCase()
    return Response.redirect(
      new URL(`/${role}/dashboard?calendar=connected`, request.url)
    )
  } catch (error) {
    console.error('[CALENDAR CALLBACK]', error)
    return errorResponse('Failed to connect Google Calendar', 500)
  }
}
