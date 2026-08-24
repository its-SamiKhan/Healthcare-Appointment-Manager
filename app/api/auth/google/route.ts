import { NextRequest, NextResponse } from 'next/server'

// GET /api/auth/google
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const origin = request.nextUrl.origin // Automatically gets http://localhost:3000 or https://your-vercel-domain.vercel.app
  const redirectUri = `${origin}/api/calendar/callback`

  if (!clientId) {
    return Response.json(
      { success: false, message: 'Google Client ID is not configured' },
      { status: 500 }
    )
  }

  const scope = encodeURIComponent('openid email profile')
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=auth_login`

  return NextResponse.redirect(authUrl)
}
