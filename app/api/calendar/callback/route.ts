import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { signJWT, hashPassword, verifyJWT } from '@/lib/auth'

// GET /api/calendar/callback — Google OAuth Callback (Connects Google Calendar & SSO Login)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/calendar/callback`

  if (error || !code) {
    console.error('[GOOGLE OAUTH ERROR]', error)
    return NextResponse.redirect(`${origin}/login?error=Google+login+cancelled`)
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    // 1. Exchange code for Google OAuth tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[GOOGLE TOKEN EXCHANGE FAILED]', tokenData)
      return NextResponse.redirect(`${origin}/login?error=Failed+to+exchange+Google+token`)
    }

    // 2. Check if user is ALREADY logged in (connecting Google Calendar from dashboard)
    const cookieToken = request.cookies.get('token')?.value
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '')
    const sessionToken = cookieToken || headerToken

    let currentUserId: string | null = null
    if (sessionToken) {
      const payload = await verifyJWT(sessionToken)
      if (payload) currentUserId = payload.userId
    }

    let user

    if (currentUserId) {
      // Connect Google Calendar tokens directly to the current logged-in user profile!
      user = await prisma.user.update({
        where: { id: currentUserId },
        data: {
          googleAccessToken: tokenData.access_token,
          ...(tokenData.refresh_token && { googleRefreshToken: tokenData.refresh_token }),
        },
        include: { doctor: true, patient: true },
      })
    } else {
      // 3. Fetch user profile from Google UserInfo endpoint for SSO login
      const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })

      const googleUser = await userinfoRes.json()

      if (!googleUser.email) {
        return NextResponse.redirect(`${origin}/login?error=Could+not+retrieve+Google+email`)
      }

      const email = googleUser.email
      const name = googleUser.name || email.split('@')[0]

      user = await prisma.user.findUnique({
        where: { email },
        include: { doctor: true, patient: true },
      })

      if (!user) {
        const dummyPassword = await hashPassword(`google-auth-${Date.now()}-${Math.random()}`)
        user = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash: dummyPassword,
            role: 'PATIENT',
            googleAccessToken: tokenData.access_token,
            googleRefreshToken: tokenData.refresh_token || null,
            patient: {
              create: {},
            },
          },
          include: { doctor: true, patient: true },
        })
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            googleAccessToken: tokenData.access_token,
            ...(tokenData.refresh_token && { googleRefreshToken: tokenData.refresh_token }),
          },
        })
      }
    }

    // 4. Issue JWT auth token cookie
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const roleTarget = user.role.toLowerCase()
    const redirectUrl = new URL(`/${roleTarget}/dashboard?google=connected&token=${token}`, origin)
    const response = NextResponse.redirect(redirectUrl)

    response.cookies.set('token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (err) {
    console.error('[GOOGLE CALLBACK EXCEPTION]', err)
    return NextResponse.redirect(`${origin}/login?error=Google+login+internal+error`)
  }
}
