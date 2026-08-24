import { NextRequest, NextResponse } from 'next/server'

// GET /api/calendar/auth — initiate Google Calendar OAuth flow for Patient/Doctor
export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin // Dynamically detects http://localhost:3000 or https://...vercel.app
    const redirectUri = `${origin}/api/calendar/callback`
    const clientId = process.env.GOOGLE_CLIENT_ID || ''

    if (!clientId) {
      return NextResponse.redirect(`${origin}/login?error=Google+Client+ID+not+configured`)
    }

    const scope = encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar.events')
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=calendar_connect`

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('[CALENDAR AUTH]', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=Failed+to+generate+OAuth+URL`)
  }
}
