import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { generatePreVisitSummary } from '@/lib/gemini'

type Params = { params: Promise<{ id: string }> }

// POST /api/appointments/[id]/symptoms
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: appointmentId } = await params
    const userId = request.headers.get('x-user-id')
    if (!userId) return errorResponse('Unauthorized', 401)

    const body = await request.json()
    const {
      chiefComplaint,
      duration,
      severity,
      previousConditions,
      currentMedicines,
    } = body

    if (!chiefComplaint || !duration || !severity) {
      return errorResponse('chiefComplaint, duration, and severity are required')
    }
    if (severity < 1 || severity > 10) {
      return errorResponse('severity must be between 1 and 10')
    }

    // Verify appointment belongs to this patient
    const patient = await prisma.patient.findUnique({ where: { userId } })
    if (!patient) return errorResponse('Patient profile not found', 404)

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, patientId: patient.id },
    })
    if (!appointment) return errorResponse('Appointment not found', 404)

    // Upsert symptoms
    const symptom = await prisma.symptom.upsert({
      where: { appointmentId },
      update: { chiefComplaint, duration, severity, previousConditions, currentMedicines },
      create: {
        appointmentId,
        chiefComplaint,
        duration,
        severity,
        previousConditions,
        currentMedicines,
      },
    })

    // Trigger AI summary asynchronously (non-blocking)
    generateAISummary(symptom.id, {
      chiefComplaint,
      duration,
      severity,
      previousConditions,
      currentMedicines,
    }).catch((e) => console.error('[AI SUMMARY TRIGGER]', e))

    return successResponse(symptom, 'Symptoms recorded. AI summary being generated.', 201)
  } catch (error) {
    console.error('[POST SYMPTOMS]', error)
    return errorResponse('Internal server error', 500)
  }
}

async function generateAISummary(
  symptomId: string,
  symptoms: {
    chiefComplaint: string
    duration: string
    severity: number
    previousConditions?: string | null
    currentMedicines?: string | null
  }
) {
  try {
    const summary = await generatePreVisitSummary(symptoms)

    await prisma.symptomSummary.upsert({
      where: { symptomId },
      update: {
        urgency: summary.urgency,
        chiefComplaint: summary.chiefComplaint,
        doctorQuestions: summary.doctorQuestions,
        status: 'COMPLETED',
      },
      create: {
        symptomId,
        urgency: summary.urgency,
        chiefComplaint: summary.chiefComplaint,
        doctorQuestions: summary.doctorQuestions,
        status: 'COMPLETED',
      },
    })
  } catch (error) {
    console.error('[AI SUMMARY FAILED]', error)
    // Graceful degradation: store failed status so doctor knows to check raw symptoms
    await prisma.symptomSummary.upsert({
      where: { symptomId },
      update: {
        urgency: 'MEDIUM',
        chiefComplaint: 'AI summary unavailable — see raw symptoms',
        doctorQuestions: [],
        status: 'FAILED',
        rawResponse: error instanceof Error ? error.message : 'Unknown error',
      },
      create: {
        symptomId,
        urgency: 'MEDIUM',
        chiefComplaint: 'AI summary unavailable — see raw symptoms',
        doctorQuestions: [],
        status: 'FAILED',
        rawResponse: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
}
