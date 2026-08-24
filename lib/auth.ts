import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export type JWTPayload = {
  userId: string
  email: string
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
  name: string
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production-32chars'
)

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getAuthCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === 'production'
  const secureFlag = isProd ? '; Secure' : ''
  return `token=${token}; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/${secureFlag}`
}
