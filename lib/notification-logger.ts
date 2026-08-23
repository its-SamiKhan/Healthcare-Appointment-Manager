import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationStatus, Prisma } from '@prisma/client'

interface LogNotificationParams {
  recipient: string
  type: NotificationType
  payload: Record<string, unknown>
}

export async function logNotification(params: LogNotificationParams) {
  return prisma.notificationLog.create({
    data: {
      recipient: params.recipient,
      type: params.type,
      status: NotificationStatus.PENDING,
      payload: params.payload as Prisma.InputJsonValue,
      attempts: 0,
    },
  })
}

export async function markNotificationSent(id: string) {
  return prisma.notificationLog.update({
    where: { id },
    data: { status: NotificationStatus.SENT, attempts: { increment: 1 } },
  })
}

export async function markNotificationFailed(id: string, nextRetryAt?: Date) {
  return prisma.notificationLog.update({
    where: { id },
    data: {
      status: NotificationStatus.FAILED,
      attempts: { increment: 1 },
      nextRetryAt: nextRetryAt ?? null,
    },
  })
}
