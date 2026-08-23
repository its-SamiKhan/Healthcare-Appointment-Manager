import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationStatus, Prisma } from '@prisma/client'

// Lazy-initialize Resend to avoid build-time errors when env vars are missing
let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  return _resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@healthcare-app.com'
const APP_NAME = 'HealthCare Manager'

// ─── Retry delay schedule ────────────────────────────────────────────────────
const RETRY_DELAYS_MS = [5 * 60 * 1000, 15 * 60 * 1000, 30 * 60 * 1000]
const MAX_RETRIES = 3

// ─── Core send + log function ────────────────────────────────────────────────

async function sendEmail(params: {
  to: string
  subject: string
  html: string
  type: NotificationType
  payload: Record<string, unknown>
}): Promise<void> {
  // Create notification log entry
  const log = await prisma.notificationLog.create({
    data: {
      recipient: params.to,
      type: params.type,
      status: NotificationStatus.PENDING,
      payload: params.payload as Prisma.InputJsonValue,
      attempts: 0,
    },
  })

  try {
    await getResend().emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    await prisma.notificationLog.update({
      where: { id: log.id },
      data: { status: NotificationStatus.SENT, attempts: 1 },
    })
  } catch (error) {
    console.error(`[EMAIL] Failed to send ${params.type} to ${params.to}:`, error)

    const nextRetryAt = new Date(Date.now() + RETRY_DELAYS_MS[0])
    await prisma.notificationLog.update({
      where: { id: log.id },
      data: {
        status: NotificationStatus.FAILED,
        attempts: 1,
        nextRetryAt,
      },
    })
  }
}

// ─── Email Templates ─────────────────────────────────────────────────────────

export async function sendBookingConfirmation(params: {
  to: string
  patientName: string
  doctorName: string
  specialization: string
  date: string
  startTime: string
  endTime: string
  appointmentId: string
}) {
  await sendEmail({
    to: params.to,
    subject: `✅ Appointment Confirmed — Dr. ${params.doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmed</h2>
        <p>Dear <strong>${params.patientName}</strong>,</p>
        <p>Your appointment has been successfully booked.</p>
        <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p><strong>Doctor:</strong> Dr. ${params.doctorName} (${params.specialization})</p>
          <p><strong>Date:</strong> ${params.date}</p>
          <p><strong>Time:</strong> ${params.startTime} – ${params.endTime}</p>
          <p><strong>Appointment ID:</strong> ${params.appointmentId}</p>
        </div>
        <p>Please arrive 10 minutes early. If you need to cancel or reschedule, please do so at least 2 hours before your appointment.</p>
        <p>Best regards,<br/><strong>${APP_NAME}</strong></p>
      </div>
    `,
    type: NotificationType.BOOKING_CONFIRMATION,
    payload: params,
  })
}

export async function sendAppointmentReminder(params: {
  to: string
  patientName: string
  doctorName: string
  date: string
  startTime: string
  appointmentId: string
}) {
  await sendEmail({
    to: params.to,
    subject: `⏰ Reminder: Appointment Tomorrow with Dr. ${params.doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Appointment Reminder</h2>
        <p>Dear <strong>${params.patientName}</strong>,</p>
        <p>This is a friendly reminder about your upcoming appointment.</p>
        <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p><strong>Doctor:</strong> Dr. ${params.doctorName}</p>
          <p><strong>Date:</strong> ${params.date}</p>
          <p><strong>Time:</strong> ${params.startTime}</p>
        </div>
        <p>Best regards,<br/><strong>${APP_NAME}</strong></p>
      </div>
    `,
    type: NotificationType.APPOINTMENT_REMINDER,
    payload: params,
  })
}

export async function sendCancellationEmail(params: {
  to: string
  patientName: string
  doctorName: string
  date: string
  startTime: string
  reason?: string
}) {
  await sendEmail({
    to: params.to,
    subject: `❌ Appointment Cancelled — Dr. ${params.doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Cancelled</h2>
        <p>Dear <strong>${params.patientName}</strong>,</p>
        <p>Your appointment has been cancelled.</p>
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p><strong>Doctor:</strong> Dr. ${params.doctorName}</p>
          <p><strong>Date:</strong> ${params.date}</p>
          <p><strong>Time:</strong> ${params.startTime}</p>
          ${params.reason ? `<p><strong>Reason:</strong> ${params.reason}</p>` : ''}
        </div>
        <p>Please book a new appointment at your convenience.</p>
        <p>Best regards,<br/><strong>${APP_NAME}</strong></p>
      </div>
    `,
    type: NotificationType.CANCELLATION,
    payload: params,
  })
}

export async function sendRescheduleEmail(params: {
  to: string
  patientName: string
  doctorName: string
  oldDate: string
  oldTime: string
  newDate: string
  newTime: string
}) {
  await sendEmail({
    to: params.to,
    subject: `🔄 Appointment Rescheduled — Dr. ${params.doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Appointment Rescheduled</h2>
        <p>Dear <strong>${params.patientName}</strong>,</p>
        <p>Your appointment has been rescheduled.</p>
        <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p><strong>Doctor:</strong> Dr. ${params.doctorName}</p>
          <p><s>Old time: ${params.oldDate} at ${params.oldTime}</s></p>
          <p><strong>New time: ${params.newDate} at ${params.newTime}</strong></p>
        </div>
        <p>Best regards,<br/><strong>${APP_NAME}</strong></p>
      </div>
    `,
    type: NotificationType.RESCHEDULE,
    payload: params,
  })
}

export async function sendLeaveNotification(params: {
  to: string
  patientName: string
  doctorName: string
  date: string
  startTime: string
}) {
  await sendEmail({
    to: params.to,
    subject: `📢 Important: Your appointment with Dr. ${params.doctorName} has been cancelled`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Cancelled Due to Doctor's Leave</h2>
        <p>Dear <strong>${params.patientName}</strong>,</p>
        <p>We regret to inform you that Dr. <strong>${params.doctorName}</strong> will be on leave, and your appointment has been cancelled.</p>
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p><strong>Cancelled appointment:</strong> ${params.date} at ${params.startTime}</p>
        </div>
        <p>We sincerely apologize for the inconvenience. Please book a new appointment with another doctor or wait for Dr. ${params.doctorName}'s return.</p>
        <p>Best regards,<br/><strong>${APP_NAME}</strong></p>
      </div>
    `,
    type: NotificationType.LEAVE_NOTIFICATION,
    payload: params,
  })
}

export async function sendMedicationReminder(params: {
  to: string
  patientName: string
  drugName: string
  dosage: string
  frequency: string
}) {
  await sendEmail({
    to: params.to,
    subject: `💊 Medication Reminder: Time to take ${params.drugName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Medication Reminder</h2>
        <p>Dear <strong>${params.patientName}</strong>,</p>
        <p>It's time to take your medication.</p>
        <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p><strong>Medication:</strong> ${params.drugName}</p>
          <p><strong>Dosage:</strong> ${params.dosage}</p>
          <p><strong>Schedule:</strong> ${params.frequency}</p>
        </div>
        <p>Take care and stay healthy!</p>
        <p>Best regards,<br/><strong>${APP_NAME}</strong></p>
      </div>
    `,
    type: NotificationType.MEDICATION_REMINDER,
    payload: params,
  })
}

// ─── Retry Worker ─────────────────────────────────────────────────────────────

/**
 * Processes the email retry queue. Called by cron job.
 * Retries failed notifications up to MAX_RETRIES times with exponential backoff.
 */
export async function processEmailRetryQueue(): Promise<{
  processed: number
  retried: number
  exhausted: number
}> {
  const failedLogs = await prisma.notificationLog.findMany({
    where: {
      status: NotificationStatus.FAILED,
      attempts: { lt: MAX_RETRIES },
      nextRetryAt: { lte: new Date() },
    },
    take: 50,
  })

  let retried = 0
  let exhausted = 0

  for (const log of failedLogs) {
    const payload = log.payload as Record<string, unknown>

    try {
      await getResend().emails.send({
        from: `${APP_NAME} <${FROM_EMAIL}>`,
        to: log.recipient,
        subject: `[Retry] Notification from ${APP_NAME}`,
        html: `<p>Retrying notification for: ${JSON.stringify(payload)}</p>`,
      })

      await prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          status: NotificationStatus.SENT,
          attempts: { increment: 1 },
          nextRetryAt: null,
        },
      })
      retried++
    } catch {
      const newAttempts = log.attempts + 1

      if (newAttempts >= MAX_RETRIES) {
        await prisma.notificationLog.update({
          where: { id: log.id },
          data: {
            attempts: { increment: 1 },
            nextRetryAt: null,
          },
        })
        exhausted++
      } else {
        const nextDelay = RETRY_DELAYS_MS[newAttempts] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]
        await prisma.notificationLog.update({
          where: { id: log.id },
          data: {
            attempts: { increment: 1 },
            nextRetryAt: new Date(Date.now() + nextDelay),
          },
        })
      }
    }
  }

  return { processed: failedLogs.length, retried, exhausted }
}
