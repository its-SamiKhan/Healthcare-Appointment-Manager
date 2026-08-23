import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent',
  })
}

export async function exchangeCodeForTokens(
  code: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const { tokens } = await oauth2Client.getToken(code)
  return {
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token!,
  }
}

/**
 * Sets OAuth credentials for a user, refreshing if needed.
 */
async function setUserCredentials(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.googleAccessToken) return false

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  })

  // Auto-refresh token
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.user.update({
        where: { id: userId },
        data: { googleAccessToken: tokens.access_token },
      })
    }
  })

  return true
}

/**
 * Creates a Google Calendar event for an appointment.
 */
export async function createCalendarEvent(params: {
  userId: string
  appointmentId: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  startTime: string // HH:MM
  endTime: string // HH:MM
  attendeeEmail: string
}): Promise<string | null> {
  const hasCredentials = await setUserCredentials(params.userId)
  if (!hasCredentials) return null

  try {
    const startDateTime = `${params.date}T${params.startTime}:00`
    const endDateTime = `${params.date}T${params.endTime}:00`

    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: params.title,
        description: params.description,
        start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
        end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
        attendees: [{ email: params.attendeeEmail }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      },
    })

    const googleEventId = event.data.id!
    const googleCalendarId = event.data.organizer?.email || 'primary'

    // Store in DB
    await prisma.calendarEvent.create({
      data: {
        appointmentId: params.appointmentId,
        googleEventId,
        googleCalendarId,
      },
    })

    return googleEventId
  } catch (error) {
    console.error('[CALENDAR] Create event failed:', error)
    return null
  }
}

/**
 * Updates a Google Calendar event (for reschedules).
 */
export async function updateCalendarEvent(params: {
  userId: string
  googleEventId: string
  date: string
  startTime: string
  endTime: string
}): Promise<boolean> {
  const hasCredentials = await setUserCredentials(params.userId)
  if (!hasCredentials) return false

  try {
    const startDateTime = `${params.date}T${params.startTime}:00`
    const endDateTime = `${params.date}T${params.endTime}:00`

    await calendar.events.update({
      calendarId: 'primary',
      eventId: params.googleEventId,
      requestBody: {
        start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
        end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
      },
    })

    return true
  } catch (error) {
    console.error('[CALENDAR] Update event failed:', error)
    return false
  }
}

/**
 * Deletes a Google Calendar event (for cancellations).
 */
export async function deleteCalendarEvent(params: {
  userId: string
  googleEventId: string
}): Promise<boolean> {
  const hasCredentials = await setUserCredentials(params.userId)
  if (!hasCredentials) return false

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: params.googleEventId,
    })
    return true
  } catch (error) {
    console.error('[CALENDAR] Delete event failed:', error)
    return false
  }
}
