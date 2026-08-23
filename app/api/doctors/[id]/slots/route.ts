import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { generateSlots } from '@/lib/slots'

type Params = { params: Promise<{ id: string }> }

// GET /api/doctors/[id]/slots?date=2024-01-15
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id: doctorId } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return errorResponse('date query parameter is required (YYYY-MM-DD)')
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse('Invalid date format. Use YYYY-MM-DD')
    }

    const slots = await generateSlots(doctorId, date)

    return successResponse({ date, doctorId, slots })
  } catch (error) {
    console.error('[GET SLOTS]', error)
    return errorResponse('Internal server error', 500)
  }
}
