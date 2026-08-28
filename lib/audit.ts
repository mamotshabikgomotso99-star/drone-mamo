import { db } from "./db";
import { auditLog } from "./db/schema";

export interface AuditEntry {
  actorId?: string | null;
  actorLabel: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: unknown;
  ipAddress?: string | null;
}

export async function logAudit(entry: AuditEntry) {
  try {
    await db.insert(auditLog).values({
      actorId: entry.actorId ?? null,
      actorLabel: entry.actorLabel,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId ?? null,
      details: (entry.details as object) ?? null,
      ipAddress: entry.ipAddress ?? null,
    });
  } catch (err) {
    console.error("[audit] failed to write log entry:", err);
  }
}