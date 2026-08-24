import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

const PUBLIC_ROUTES = ['/', '/login', '/register']
const PUBLIC_API_PREFIXES = ['/api/auth', '/api/cron']

const ROLE_ROUTE_MAP: Record<string, string[]> = {
  ADMIN: ['/admin', '/api/admin'],
  DOCTOR: ['/doctor', '/api/doctor'],
  PATIENT: ['/patient', '/api/patient'],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static assets & image files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Allow public page routes
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next()

  // Allow public API prefixes
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Extract token from cookie or Authorization header
  const cookieToken = request.cookies.get('token')?.value
  const headerToken = request.headers
    .get('authorization')
    ?.replace('Bearer ', '')
  const token = cookieToken || headerToken

  if (!token) {
    if (pathname.startsWith('/api')) {
      return Response.json(
        { success: false, message: 'Unauthorized — no token provided' },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = await verifyJWT(token)

  if (!payload) {
    if (pathname.startsWith('/api')) {
      return Response.json(
        { success: false, message: 'Unauthorized — invalid or expired token' },
        { status: 401 }
      )
    }
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('token')
    return res
  }

  // Role-based access control
  for (const [role, prefixes] of Object.entries(ROLE_ROUTE_MAP)) {
    for (const prefix of prefixes) {
      if (pathname.startsWith(prefix) && payload.role !== role) {
        if (pathname.startsWith('/api')) {
          return Response.json(
            { success: false, message: 'Forbidden — insufficient permissions' },
            { status: 403 }
          )
        }
        return NextResponse.redirect(new URL(`/${payload.role.toLowerCase()}/dashboard`, request.url))
      }
    }
  }

  // Forward user info to API route handlers via headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-user-role', payload.role)
  requestHeaders.set('x-user-email', payload.email)
  requestHeaders.set('x-user-name', payload.name)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)'],
}
