import { NextRequest } from 'next/server'
import { getAuthUrl, exchangeCodeForTokens } from '@/lib/google-calendar'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/calendar/auth — initiate Google OAuth flow
export async function GET() {
  try {
    const authUrl = getAuthUrl()
    return Response.redirect(authUrl)
  } catch (error) {
    console.error('[CALENDAR AUTH]', error)
    return errorResponse('Failed to generate OAuth URL', 500)
  }
}
