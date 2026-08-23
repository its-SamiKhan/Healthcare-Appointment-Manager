export function successResponse(data: unknown, message = 'Success', status = 200) {
  return Response.json({ success: true, message, data }, { status })
}

export function errorResponse(message: string, status = 400, errors?: unknown) {
  return Response.json({ success: false, message, errors }, { status })
}
