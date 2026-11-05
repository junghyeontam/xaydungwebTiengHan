"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  Search,
  Clock,
  CheckCircle2,
  UserCheck,
  MessageSquare,
  Filter,
  Trash2,
  RefreshCw,
  PhoneForwarded,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Phone } from "@/components/shared";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { maskName, maskPhone } from "@/lib/utils/masking";

interface LeadItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  goal: string;
  source: string;
  status: "new" | "contacted" | "enrolled" | "cancelled";
  createdAt: string;
  notes?: string[];
}

export default function AdminLeadsPage() {
  const { can, currentRole, user } = useAdminAuth();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUnmasked, setIsUnmasked] = useState(false);

  const canViewPii = can("learners.view_pii");
  const canManageLeads = can("leads.update") || ["super_admin", "admin", "sales_crm"].includes(currentRole);

  const loadLeads = async () => {
    setLoading(true);
    try {
      // 1. Fetch from backend API
      const activeRole = currentRole || "super_admin";
      const res = await fetch(`/api/admin/leads?role=${activeRole}`);
      const data = await res.json();
      let serverLeads: LeadItem[] = data?.leads || [];

      // 2. Merge with any local submissions from learner tests
      if (typeof window !== "undefined") {
        const localLeads: LeadItem[] = JSON.parse(
          localStorage.getItem("junghyeon_leads") || "[]"
        );
        const existingIds = new Set(serverLeads.map((l) => l.id));
        const merged = [...serverLeads];
        for (const loc of localLeads) {
          if (!existingIds.has(loc.id)) {
            merged.unshift(loc);
            existingIds.add(loc.id);
          }
        }
        serverLeads = merged;
      }

      setLeads(serverLeads);
    } catch (err) {
      console.error("Error loading leads:", err);
      // Local fallback
      if (typeof window !== "undefined") {
        const localLeads: LeadItem[] = JSON.parse(
          localStorage.getItem("junghyeon_leads") || "[]"
        );
        setLeads(localLeads);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();

    const handleUpdate = () => loadLeads();
    if (typeof window !== "undefined") {
      window.addEventListener("jh_leads_updated", handleUpdate);
      return () => window.removeEventListener("jh_leads_updated", handleUpdate);
    }
  }, [currentRole]);

  const handleUpdateStatus = async (
    leadId: string,
    newStatus: "new" | "contacted" | "enrolled" | "cancelled"
  ) => {
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
    } catch {}

    // Update local state
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    // Update localStorage
    if (typeof window !== "undefined") {
      const stored: LeadItem[] = JSON.parse(
        localStorage.getItem("junghyeon_leads") || "[]"
      );
      const updated = stored.map((l) =>
        l.id === leadId ? { ...l, status: newStatus } : l
      );
      localStorage.setItem("junghyeon_leads", JSON.stringify(updated));
      window.dispatchEvent(new Event("jh_leads_updated"));
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lead tư vấn này không?")) return;

    try {
      await fetch(`/api/admin/leads?id=${leadId}`, { method: "DELETE" });
    } catch {}

    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (typeof window !== "undefined") {
      const stored: LeadItem[] = JSON.parse(
        localStorage.getItem("junghyeon_leads") || "[]"
      );
      const updated = stored.filter((l) => l.id !== leadId);
      localStorage.setItem("junghyeon_leads", JSON.stringify(updated));
      window.dispatchEvent(new Event("jh_leads_updated"));
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = l.fullName?.toLowerCase().includes(q);
      const matchPhone = l.phone?.includes(q);
      const matchGoal = l.goal?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchGoal) return false;
    }
    return true;
  });

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Sales & Consulting"
        title="Consultation Leads CRM"
        titleMuted={`· ${newLeadsCount} Yêu cầu mới`}
        description="Quản lý khách đăng ký tư vấn lộ trình học tiếng Hàn, cam kết phản hồi trong 15 phút và phân công chuyên viên tư vấn."
      />

      {/* Control Bar: Search, Status Filter, Unmask, Refresh */}
      <div className="p-4 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-admin-text-placeholder absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, SĐT hoặc mục tiêu..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary placeholder:text-admin-text-placeholder focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 focus:border-admin-brand-teal"
            />
          </div>

          <div className="flex items-center gap-1">
            {[
              { id: "all", label: "Tất cả" },
              { id: "new", label: "Mới nhận" },
              { id: "contacted", label: "Đã liên hệ" },
              { id: "enrolled", label: "Đã nhập học" },
              { id: "cancelled", label: "Đã hủy" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-admin-control text-xs font-semibold transition-colors ${
                  statusFilter === tab.id
                    ? "bg-admin-brand-teal/15 text-admin-brand-teal font-bold"
                    : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {canViewPii && (
            <button
              type="button"
              onClick={() => setIsUnmasked(!isUnmasked)}
              className="px-3 py-1.5 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs font-semibold text-admin-text-secondary flex items-center gap-1.5 transition-colors"
              title="Hiện / Ẩn thông tin liên hệ đầy đủ (PII)"
            >
              {isUnmasked ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-admin-brand-coral" />
                  <span>Ẩn PII</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-admin-brand-teal" />
                  <span>Hiện PII</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={loadLeads}
            disabled={loading}
            className="p-1.5 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-admin-text-secondary transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                <th className="py-3 px-4 font-medium">Họ & Tên</th>
                <th className="py-3 px-4 font-medium">Số điện thoại</th>
                <th className="py-3 px-4 font-medium">Mục tiêu học tập</th>
                <th className="py-3 px-4 font-medium">Nguồn đăng ký</th>
                <th className="py-3 px-4 font-medium">Trạng thái</th>
                <th className="py-3 px-4 font-medium">Thời gian</th>
                <th className="py-3 px-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-admin-text-muted">
                    {loading ? "Đang tải danh sách..." : "Không tìm thấy yêu cầu tư vấn nào."}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => {
                  const displayName = isUnmasked || canViewPii ? l.fullName : maskName(l.fullName);
                  const displayPhone = isUnmasked || canViewPii ? l.phone : maskPhone(l.phone);

                  return (
                    <tr key={l.id} className="hover:bg-admin-subtle/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-admin-text-primary">
                        {displayName}
                        {l.email && (
                          <span className="block text-[11px] font-normal text-admin-text-muted">
                            {l.email}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-admin-brand-teal font-medium">
                        <Phone phone={displayPhone} />
                      </td>
                      <td className="py-3.5 px-4 text-admin-text-secondary max-w-xs truncate">
                        {l.goal}
                      </td>
                      <td className="py-3.5 px-4 text-admin-text-muted">
                        {l.source}
                      </td>
                      <td className="py-3.5 px-4">
                        {l.status === "new" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-brand-coral/10 text-admin-brand-coral border border-admin-brand-coral/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-admin-brand-coral" />
                            Mới nhận
                          </span>
                        )}
                        {l.status === "contacted" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-brand-teal/10 text-admin-brand-teal border border-admin-brand-teal/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-admin-brand-teal" />
                            Đã gọi điện
                          </span>
                        )}
                        {l.status === "enrolled" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã nhập học
                          </span>
                        )}
                        {l.status === "cancelled" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-neutral-500/10 text-neutral-500 border border-neutral-500/20">
                            <XCircle className="w-3 h-3 text-neutral-500" />
                            Đã hủy
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-admin-text-muted text-[11px]">
                        {l.createdAt.includes("T")
                          ? new Date(l.createdAt).toLocaleDateString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : l.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {l.status === "new" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(l.id, "contacted")}
                              className="px-2 py-1 rounded-admin-control bg-admin-brand-teal text-white hover:bg-admin-brand-teal/90 text-[11px] font-bold transition-all shadow-xs"
                              title="Đánh dấu đã gọi điện tư vấn"
                            >
                              Đã gọi
                            </button>
                          )}
                          {l.status === "contacted" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(l.id, "enrolled")}
                              className="px-2 py-1 rounded-admin-control bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold transition-all shadow-xs"
                              title="Xác nhận học viên đã đăng ký khóa học"
                            >
                              Nhập học
                            </button>
                          )}
                          {canManageLeads && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(l.id)}
                              className="p-1 rounded-admin-control text-admin-text-muted hover:text-admin-brand-coral hover:bg-admin-brand-coral/10 transition-colors"
                              title="Xóa lead này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
