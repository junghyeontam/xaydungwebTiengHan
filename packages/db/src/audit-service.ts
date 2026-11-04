import { getServiceSupabase } from "./supabase-server";

export interface AuditLogEntry {
  id: string;
  actorId?: string | null;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any> | null;
  ipAddress?: string;
  createdAt: string;
}

// Global singleton persistent cache for HMR and multi-bundle environments
interface GlobalAuditState {
  memoryAuditLogs: AuditLogEntry[];
}

const globalForAudit = globalThis as unknown as { __jh_audit?: GlobalAuditState };

if (!globalForAudit.__jh_audit) {
  globalForAudit.__jh_audit = {
    memoryAuditLogs: [
      {
        id: "audit-seed-1",
        actorId: "usr-admin-1",
        actorEmail: "admin@junghyeon.vn",
        actorRole: "super_admin",
        action: "system:initialize",
        entityType: "system",
        entityId: "core",
        details: { version: "1.0.0", env: "production" },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  };
}

const memoryAuditLogs = globalForAudit.__jh_audit.memoryAuditLogs;

export async function recordAuditLog(params: {
  actorId?: string | null;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any> | null;
  ipAddress?: string;
}): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actorId: params.actorId || null,
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    details: params.details || null,
    ipAddress: params.ipAddress || "127.0.0.1",
    createdAt: new Date().toISOString(),
  };

  memoryAuditLogs.unshift(entry);

  try {
    const supabase = getServiceSupabase();
    await (supabase.from("audit_logs") as any).insert({
      id: entry.id,
      actor_id: entry.actorId,
      actor_email: entry.actorEmail,
      actor_role: entry.actorRole,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      details: entry.details,
      ip_address: entry.ipAddress,
      created_at: entry.createdAt,
    });
  } catch (err: any) {
    console.debug("[AuditLog] Supabase insert skipped (using memory):", err?.message);
  }

  return entry;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const supabase = getServiceSupabase();
    const result: any = await Promise.race([
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
      new Promise((resolve) => setTimeout(() => resolve({ data: null, error: true }), 350)),
    ]);

    if (result && !result.error && result.data && result.data.length > 0) {
      const dbLogs = result.data.map((row: any) => ({
        id: row.id,
        actorId: row.actor_id,
        actorEmail: row.actor_email,
        actorRole: row.actor_role,
        action: row.action,
        entityType: row.entity_type,
        entityId: row.entity_id,
        details: row.details,
        ipAddress: row.ip_address,
        createdAt: row.created_at,
      }));
      const mergedMap = new Map<string, AuditLogEntry>();
      memoryAuditLogs.forEach((l) => mergedMap.set(l.id, l));
      dbLogs.forEach((l: AuditLogEntry) => mergedMap.set(l.id, l));
      return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  } catch {}

  return memoryAuditLogs;
}
