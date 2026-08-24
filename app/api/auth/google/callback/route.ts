import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { signJWT, hashPassword } from '@/lib/auth'

// GET /api/auth/google/callback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const redirectUri = `${baseUrl}/api/auth/google/callback`

  if (error || !code) {
    console.error('[GOOGLE OAUTH ERROR]', error)
    return NextResponse.redirect(`${baseUrl}/login?error=Google+login+cancelled`)
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    // 1. Exchange authorization code for tokens
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
      return NextResponse.redirect(`${baseUrl}/login?error=Failed+to+exchange+Google+token`)
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const googleUser = await userinfoRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=Could+not+retrieve+Google+email`)
    }

    const email = googleUser.email
    const name = googleUser.name || email.split('@')[0]

    // 3. Find existing user or register new Google user
    let user = await prisma.user.findUnique({
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
      // Update tokens for existing user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleAccessToken: tokenData.access_token,
          ...(tokenData.refresh_token && { googleRefreshToken: tokenData.refresh_token }),
        },
      })
    }

    // 4. Issue JWT auth token
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const roleTarget = user.role.toLowerCase()
    const redirectUrl = new URL(`/${roleTarget}/dashboard`, baseUrl)
    const response = NextResponse.redirect(redirectUrl)

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    )

    return response
  } catch (err) {
    console.error('[GOOGLE CALLBACK EXCEPTION]', err)
    return NextResponse.redirect(`${baseUrl}/login?error=Google+login+internal+error`)
  }
}
