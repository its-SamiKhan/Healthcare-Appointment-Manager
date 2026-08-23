import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { sendMedicationReminder } from '@/lib/email'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/cron/medication-reminders
// Called by Upstash QStash every minute
// Sends due medication reminders via email
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'

  const isValid =
    isVercelCron ||
    secret === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isValid) {
    return errorResponse('Unauthorized', 401)
  }

  try {
    const now = new Date()
    const windowEnd = new Date(now.getTime() + 60 * 1000) // 1-minute window

    // Find all pending reminders due in this window
    const dueReminders = await prisma.medicationReminder.findMany({
      where: {
        status: 'PENDING',
        scheduledAt: { gte: now, lte: windowEnd },
      },
      include: {
        prescription: true,
      },
      take: 100,
    })

    let sent = 0
    let failed = 0

    for (const reminder of dueReminders) {
      // Get patient email
      const patient = await prisma.patient.findUnique({
        where: { id: reminder.patientId },
        include: { user: { select: { email: true, name: true } } },
      })

      if (!patient) continue

      try {
        await sendMedicationReminder({
          to: patient.user.email,
          patientName: patient.user.name,
          drugName: reminder.prescription.drugName,
          dosage: reminder.prescription.dosage,
          frequency: reminder.prescription.frequency,
        })

        await prisma.medicationReminder.update({
          where: { id: reminder.id },
          data: { status: 'SENT', sentAt: new Date() },
        })
        sent++
      } catch (error) {
        console.error(`[MED REMINDER] Failed for reminder ${reminder.id}:`, error)
        await prisma.medicationReminder.update({
          where: { id: reminder.id },
          data: { status: 'FAILED' },
        })
        failed++
      }
    }

    console.log(`[CRON MED REMINDERS] Sent: ${sent}, Failed: ${failed}`)
    return successResponse({ sent, failed, total: dueReminders.length })
  } catch (error) {
    console.error('[CRON MED REMINDERS]', error)
    return errorResponse('Internal server error', 500)
  }
}
