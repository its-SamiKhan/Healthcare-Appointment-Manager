import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { generatePostVisitSummary } from '@/lib/gemini'
import { generateMedicationReminders } from '@/lib/reminders'

type Params = { params: Promise<{ id: string }> }

// POST /api/doctor/appointments/[id]/notes — doctor submits post-visit notes
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: appointmentId } = await params
    const userId = request.headers.get('x-user-id')
    if (!userId) return errorResponse('Unauthorized', 401)

    const body = await request.json()
    const { clinicalNotes, diagnosis, followUpDate, prescriptions } = body

    if (!clinicalNotes || !diagnosis) {
      return errorResponse('clinicalNotes and diagnosis are required')
    }

    // Verify doctor owns this appointment
    const doctor = await prisma.doctor.findUnique({ where: { userId } })
    if (!doctor) return errorResponse('Doctor profile not found', 404)

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, doctorId: doctor.id },
      include: {
        patient: { include: { user: { select: { email: true, id: true } } } },
      },
    })
    if (!appointment) return errorResponse('Appointment not found', 404)

    // Create visit note with prescriptions
    const visitNote = await prisma.visitNote.create({
      data: {
        appointmentId,
        clinicalNotes,
        diagnosis,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        prescriptions: prescriptions?.length
          ? {
              createMany: {
                data: prescriptions.map(
                  (p: {
                    drugName: string
                    dosage: string
                    frequency: string
                    durationDays: number
                  }) => ({
                    drugName: p.drugName,
                    dosage: p.dosage,
                    frequency: p.frequency,
                    durationDays: p.durationDays,
                  })
                ),
              },
            }
          : undefined,
      },
      include: { prescriptions: true },
    })

    // Mark appointment as completed
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
    })

    // Generate medication reminders for each prescription
    if (visitNote.prescriptions.length > 0) {
      const patientId = appointment.patient.id
      const startDate = new Date()

      for (const prescription of visitNote.prescriptions) {
        await generateMedicationReminders(
          prescription.id,
          patientId,
          startDate,
          prescription.durationDays,
          prescription.frequency
        )
      }
    }

    // Generate AI patient-friendly summary (non-blocking)
    generatePatientSummary(visitNote.id, {
      clinicalNotes,
      diagnosis,
      prescriptions: visitNote.prescriptions,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    }).catch((e) => console.error('[POST VISIT AI]', e))

    return successResponse(visitNote, 'Visit notes saved and medication reminders created', 201)
  } catch (error) {
    console.error('[POST VISIT NOTES]', error)
    return errorResponse('Internal server error', 500)
  }
}

// GET /api/doctor/appointments/[id]/notes
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: appointmentId } = await params
    const visitNote = await prisma.visitNote.findUnique({
      where: { appointmentId },
      include: { prescriptions: true },
    })
    if (!visitNote) return errorResponse('No visit notes found', 404)
    return successResponse(visitNote)
  } catch (error) {
    console.error('[GET VISIT NOTES]', error)
    return errorResponse('Internal server error', 500)
  }
}

async function generatePatientSummary(
  visitNoteId: string,
  data: {
    clinicalNotes: string
    diagnosis: string
    prescriptions: Array<{
      drugName: string
      dosage: string
      frequency: string
      durationDays: number
    }>
    followUpDate: Date | null
  }
) {
  try {
    const { patientSummary } = await generatePostVisitSummary(data)
    await prisma.visitNote.update({
      where: { id: visitNoteId },
      data: { patientSummary },
    })
  } catch (error) {
    console.error('[POST VISIT AI FAILED]', error)
    // Non-fatal: note is saved, AI summary just won't be available
  }
}
