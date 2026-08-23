export async function POST() {
  const response = Response.json({ success: true, message: 'Logged out successfully' })
  response.headers.set(
    'Set-Cookie',
    'token=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/'
  )
  return response
}
