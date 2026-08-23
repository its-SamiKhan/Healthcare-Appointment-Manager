import { prisma } from '@/lib/prisma'

interface ReminderTime {
  hour: number
  minute: number
}

// Parse frequency string to reminder times per day
function parseFrequencyToTimes(frequency: string): ReminderTime[] {
  const freq = frequency.toLowerCase()

  if (freq.includes('3') || freq.includes('three') || freq.includes('thrice')) {
    return [
      { hour: 8, minute: 0 },
      { hour: 14, minute: 0 },
      { hour: 20, minute: 0 },
    ]
  }
  if (freq.includes('2') || freq.includes('two') || freq.includes('twice')) {
    return [
      { hour: 8, minute: 0 },
      { hour: 20, minute: 0 },
    ]
  }
  // Default: once daily
  return [{ hour: 8, minute: 0 }]
}

/**
 * Generates medication reminder records for a prescription.
 * E.g. "Paracetamol 3x daily for 5 days" → 15 reminder records
 */
export async function generateMedicationReminders(
  prescriptionId: string,
  patientId: string,
  startDate: Date,
  durationDays: number,
  frequency: string
): Promise<number> {
  const times = parseFrequencyToTimes(frequency)
  const reminders: Array<{ prescriptionId: string; patientId: string; scheduledAt: Date }> = []

  for (let day = 0; day < durationDays; day++) {
    for (const time of times) {
      const scheduledAt = new Date(startDate)
      scheduledAt.setDate(scheduledAt.getDate() + day)
      scheduledAt.setHours(time.hour, time.minute, 0, 0)

      // Skip reminders in the past
      if (scheduledAt > new Date()) {
        reminders.push({ prescriptionId, patientId, scheduledAt })
      }
    }
  }

  if (reminders.length === 0) return 0

  const result = await prisma.medicationReminder.createMany({ data: reminders })
  return result.count
}
