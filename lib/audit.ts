import { prisma } from '@/lib/prisma'
import { AuditLog, Prisma } from '@prisma/client'

interface AuditParams {
  actorId?: string
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
}

export async function writeAuditLog(params: AuditParams): Promise<AuditLog> {
  return prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata as Prisma.InputJsonValue | undefined,
    },
  })
}
