"use client";

import React, { useState, useEffect } from "react";
import { History, Search, RefreshCw, Shield, Terminal, ArrowUpRight, Filter, Clock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate, formatTime } from "@/lib/format";

interface AuditEntry {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit");
      const data = await res.json();
      if (data?.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType.toLowerCase().includes(search.toLowerCase()) ||
      l.entityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="System Administration"
        title="Audit Logs & Security Trail"
        titleMuted={`· ${logs.length} Recorded Events`}
        description="Nhật ký kiểm toán bất biến ghi lại mọi thao tác quan trọng: xuất bản nội dung, cấp quyền, cấu hình hệ thống, tạo coupon và truy cập dữ liệu."
        actions={
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-admin-pill bg-admin-surface border border-admin-border text-admin-text-primary hover:bg-admin-subtle font-medium text-xs shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        }
      />

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 max-w-sm w-full px-3 py-2 rounded-admin-pill bg-admin-surface border border-admin-border shadow-xs">
          <Search className="w-4 h-4 text-admin-text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo hành động, email, entity..."
            className="bg-transparent text-xs text-admin-text-primary placeholder:text-admin-text-muted focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                <th className="py-3 px-4 font-medium">Thời gian</th>
                <th className="py-3 px-4 font-medium">Hành động (Action)</th>
                <th className="py-3 px-4 font-medium">Người thực hiện</th>
                <th className="py-3 px-4 font-medium">Đối tượng (Entity)</th>
                <th className="py-3 px-4 font-medium">IP Address</th>
                <th className="py-3 px-4 font-medium text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-admin-text-muted text-xs">
                    {loading ? "Đang tải nhật ký kiểm toán..." : "Chưa có bản ghi nào phù hợp."}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-admin-subtle/50 transition-colors">
                    <td className="py-3.5 px-4 text-admin-text-secondary whitespace-nowrap text-[11px]">
                      <div className="flex items-center gap-1.5 num-tabular">
                        <Clock className="w-3 h-3 text-admin-text-muted shrink-0" />
                        <span>{formatDate(log.createdAt)}</span>
                        <span className="text-admin-text-muted">{formatTime(log.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-admin-brand-teal text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="text-admin-text-primary font-medium text-xs">{log.actorEmail}</div>
                      <div className="text-[10px] text-admin-text-muted">{log.actorRole}</div>
                    </td>
                    <td className="py-3.5 px-4 text-admin-text-secondary text-xs">
                      <span className="text-admin-text-muted font-normal">{log.entityType}:</span>{" "}
                      <span className="font-semibold text-admin-text-primary">{log.entityId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-admin-text-muted text-[11px]">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={() => setSelectedEntry(log)}
                        className="text-xs text-admin-brand-coral hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Xem JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-admin-surface border border-admin-border rounded-admin-card shadow-admin-floating max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-admin-text-primary flex items-center gap-2">
                <Terminal className="w-4 h-4 text-admin-brand-teal" />
                Audit Log Payload Detail
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-xs text-admin-text-muted hover:text-admin-text-primary"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="bg-admin-subtle/80 p-3 rounded-lg border border-admin-border font-mono text-[11px] overflow-x-auto max-h-72">
              <pre className="text-admin-text-primary">
                {JSON.stringify(
                  {
                    id: selectedEntry.id,
                    action: selectedEntry.action,
                    actor: {
                      email: selectedEntry.actorEmail,
                      role: selectedEntry.actorRole,
                    },
                    entity: {
                      type: selectedEntry.entityType,
                      id: selectedEntry.entityId,
                    },
                    details: selectedEntry.details,
                    ipAddress: selectedEntry.ipAddress,
                    timestamp: selectedEntry.createdAt,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
