"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  PhoneCall,
  TrendingUp,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { RbacGuard } from "@/components/admin/RbacGuard";
import { Num, Price, Percent, Phone } from "@/components/shared";

interface DraftSummary {
  id: string;
  title: string;
  contentType: "lesson" | "roadmap" | "banner";
  author: string;
  status: "draft" | "in_review" | "approved";
  updatedAt: string;
}

interface LeadSummary {
  id: string;
  fullName: string;
  phone: string;
  goal: string;
  createdAt: string;
  status: "new" | "contacted";
}

interface AuditSummary {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

export default function AdminDashboardPage() {
  const { user, currentRole } = useAdminAuth();
  const [isExporting, setIsExporting] = useState(false);

  // Mock initial dashboard state
  const [drafts] = useState<DraftSummary[]>([
    {
      id: "v-102",
      title: "Bài 14: Kính ngữ & Đuôi câu trang trọng -(으)시-",
      contentType: "lesson",
      author: "Trần Hương (Teacher)",
      status: "in_review",
      updatedAt: "15 phút trước",
    },
    {
      id: "v-103",
      title: "Bộ thẻ 50 từ vựng TOPIK 2: Sinh hoạt công sở",
      contentType: "lesson",
      author: "Nguyễn Văn Đạt (Editor)",
      status: "draft",
      updatedAt: "1 giờ trước",
    },
    {
      id: "v-104",
      title: "Banner Ưu đãi Khai giảng Tháng 11",
      contentType: "banner",
      author: "Lê Minh (Marketing)",
      status: "approved",
      updatedAt: "3 giờ trước",
    },
  ]);

  const [leads, setLeads] = useState<LeadSummary[]>([]);

  const fetchLatestLeads = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/leads?role=${currentRole}`);
      const data = await res.json();
      let serverLeads: any[] = data?.leads || [];

      if (typeof window !== "undefined") {
        const localLeads = JSON.parse(localStorage.getItem("junghyeon_leads") || "[]");
        const existingIds = new Set(serverLeads.map((l: any) => l.id));
        const merged = [...serverLeads];
        for (const loc of localLeads) {
          if (!existingIds.has(loc.id)) {
            merged.unshift(loc);
            existingIds.add(loc.id);
          }
        }
        serverLeads = merged;
      }

      setLeads(
        serverLeads.map((l: any) => ({
          id: l.id,
          fullName: l.fullName,
          phone: l.phone,
          goal: l.goal,
          createdAt: l.createdAt ? new Date(l.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "Vừa xong",
          status: l.status === "contacted" ? "contacted" : "new",
        }))
      );
    } catch {
      // Fallback local
      if (typeof window !== "undefined") {
        const localLeads = JSON.parse(localStorage.getItem("junghyeon_leads") || "[]");
        setLeads(
          localLeads.map((l: any) => ({
            id: l.id,
            fullName: l.fullName,
            phone: l.phone,
            goal: l.goal,
            createdAt: "Vừa xong",
            status: l.status === "contacted" ? "contacted" : "new",
          }))
        );
      }
    }
  }, [currentRole]);

  useEffect(() => {
    fetchLatestLeads();
    const handleUpdate = () => {
      fetchLatestLeads();
    };
    window.addEventListener("jh_leads_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("jh_leads_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [fetchLatestLeads]);

  const [auditLogs] = useState<AuditSummary[]>([
    {
      id: "aud-1",
      actor: "Trần Hương",
      action: "Gửi duyệt xuất bản",
      target: "Bài 14: Kính ngữ",
      time: "15 phút trước",
    },
    {
      id: "aud-2",
      actor: "Admin (Bạn)",
      action: "Xuất bản phiên bản v2",
      target: "Lộ trình TOPIK 1",
      time: "2 giờ trước",
    },
    {
      id: "aud-3",
      actor: "Hệ thống Revalidate",
      action: "Làm mới Cache Next.js",
      target: "/roadmap & /lessons/hangul-01",
      time: "2 giờ trước",
    },
  ]);

  const handleQuickMarkLead = async (id: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "contacted" } : l))
    );
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: id,
          status: "contacted",
          note: "Nhân viên chăm sóc nhanh qua Dashboard",
          actorEmail: user?.email || "admin@junghyeon.vn",
          actorRole: currentRole,
        }),
      });
    } catch (e) {
      console.warn("Failed to update status on server:", e);
    }
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("junghyeon_leads") || "[]");
      const updated = stored.map((l: any) =>
        l.id === id ? { ...l, status: "contacted" } : l
      );
      localStorage.setItem("junghyeon_leads", JSON.stringify(updated));
      window.dispatchEvent(new Event("jh_leads_updated"));
    }
  };

  const handleExportSummaryCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent =
        "Loại dữ liệu,Chỉ số,Kỳ đánh giá\n" +
        "Học viên tích cực,14250,Tháng 11/2026\n" +
        "Doanh thu tuần,48500000,Tuần 44\n" +
        "Leads mới chưa xử lý,14,Hôm nay\n" +
        "Tỉ lệ hoàn thành bài,78.4%,Toàn hệ thống\n";
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `junghyeon-executive-kpi-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsExporting(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome - Clean Tint Panel */}
      <div className="p-6 rounded-card bg-brand-tint border border-brand-frame/70 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
            Xin chào, {user?.name || "Quản trị viên"}!
          </h1>
          <p className="text-xs text-brand-secondary max-w-xl">
            Tổng quan hiệu suất vận hành, hàng chờ duyệt xuất bản và danh sách học viên cần chăm sóc hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
          <button
            onClick={handleExportSummaryCsv}
            disabled={isExporting}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-control bg-brand-bg hover:bg-brand-surface border border-brand-border text-brand-navy font-bold text-xs transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-brand-primary" />
            <span>{isExporting ? "Đang xuất..." : "Xuất báo cáo"}</span>
          </button>

          <RbacGuard permission="content.publish">
            <Link
              href="/admin/publishing"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-control bg-brand-coral hover:bg-brand-coral-hover text-white font-extrabold text-xs shadow-xs transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Duyệt xuất bản</span>
            </Link>
          </RbacGuard>
        </div>
      </div>

      {/* 4 Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Học viên tích cực tháng này"
          value={<Num value={14250} />}
          change={{ value: 12.8, isPositive: true }}
          icon={Users}
          colorVariant="teal"
        />
        <RbacGuard
          permission="analytics.read"
          fallback={
            <div className="p-5 rounded-3xl bg-secondary/40 border border-border flex items-center justify-between opacity-60">
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Doanh thu tài chính</span>
                <div className="text-sm font-bold text-muted-foreground mt-1">Bị ẩn theo phân quyền RBAC</div>
              </div>
              <DollarSign className="w-6 h-6 text-muted-foreground/50" />
            </div>
          }
        >
          <StatCard
            title="Doanh thu tuần này"
            value={<Price amount={48500000} compact size="kpi" />}
            change={{ value: 8.4, isPositive: true }}
            icon={DollarSign}
            colorVariant="emerald"
          />
        </RbacGuard>
        <StatCard
          title="Lead tư vấn mới nhận"
          value={<Num value={leads.filter((l) => l.status === "new").length} />}
          change={{ value: 5.2, isPositive: false, period: "so với hôm qua" }}
          icon={PhoneCall}
          colorVariant="coral"
        />
        <StatCard
          title="Tỉ lệ hoàn thành bài học"
          value={<Percent value={0.784} />}
          change={{ value: 3.1, isPositive: true }}
          icon={TrendingUp}
          colorVariant="blue"
        />
      </div>

      {/* Mid Section: Publishing Queue & Urgent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Content Drafts & Publishing Queue */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-foreground">
                  Hàng chờ Duyệt & Xuất bản
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Bản nháp được lưu riêng, chưa hiển thị cho học viên
                </p>
              </div>
            </div>

            <Link
              href="/admin/publishing"
              className="text-xs font-bold text-junghyeon-teal hover:underline inline-flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/70 border border-border/60 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground truncate max-w-[240px] sm:max-w-xs">
                      {draft.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        draft.status === "in_review"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : draft.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {draft.status === "in_review"
                        ? "Chờ duyệt"
                        : draft.status === "approved"
                        ? "Đã duyệt"
                        : "Bản nháp"}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>{draft.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {draft.updatedAt}
                    </span>
                  </div>
                </div>

                <RbacGuard permission="content.publish">
                  <Link
                    href="/admin/publishing"
                    className="px-3 py-1.5 rounded-xl bg-junghyeon-dark text-white dark:bg-junghyeon-teal dark:text-junghyeon-dark font-bold text-[11px] shrink-0"
                  >
                    Xem xét
                  </Link>
                </RbacGuard>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Urgent Consultation Leads */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-junghyeon-coral/15 text-junghyeon-coral flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-foreground">
                  Khách hẹn Tư vấn mới
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Đồng bộ Realtime từ form tư vấn học viên
                </p>
              </div>
            </div>

            <Link
              href="/admin/sales/leads"
              className="text-xs font-bold text-junghyeon-coral hover:underline inline-flex items-center gap-1"
            >
              <span>CRM Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/70 border border-border/60 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{lead.fullName}</span>
                    <Phone phone={lead.phone} className="text-muted-foreground text-[11px]" />
                    {lead.status === "new" ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-600 font-bold text-[10px]">
                        Mới
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-bold text-[10px]">
                        Đã gọi
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                    {lead.goal}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {lead.status === "new" && (
                    <button
                      onClick={() => handleQuickMarkLead(lead.id)}
                      className="px-2.5 py-1 rounded-xl bg-junghyeon-teal/15 text-junghyeon-teal hover:bg-junghyeon-teal hover:text-white font-bold text-[11px] transition-colors"
                    >
                      Đã gọi
                    </button>
                  )}
                  <a
                    href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                    className="p-1.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground border border-border"
                    title="Gọi ngay"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Realtime Audit Trail & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Logs (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-card border border-border shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-junghyeon-teal" />
              <span>Nhật ký Hoạt động Quản trị gần đây</span>
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              Xem toàn bộ log
            </Link>
          </div>

          <div className="divide-y divide-border/60 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-foreground truncate">{log.actor}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-junghyeon-teal dark:text-emerald-400 font-medium">
                    {log.action}
                  </span>
                  <span className="text-muted-foreground hidden sm:inline truncate max-w-xs">
                    ({log.target})
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground num shrink-0">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health & Architecture Status (1 col) */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-4">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2 pb-2 border-b border-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Hạ tầng & Đồng bộ</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cơ sở dữ liệu Supabase:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Kết nối OK
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cache Revalidation:</span>
              <span className="font-bold text-foreground">Sẵn sàng (Tag + Path)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Bảo mật RLS:</span>
              <span className="font-bold text-emerald-600">Đã kích hoạt</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chế độ Bảo trì:</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary font-bold text-[10px] text-muted-foreground">
                Đang tắt (Online)
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <Link
              href="/admin/settings"
              className="w-full py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Quản lý Cài đặt Hệ thống</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
