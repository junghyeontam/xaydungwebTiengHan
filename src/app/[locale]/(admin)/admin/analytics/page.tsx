"use client";

import React, { useState } from "react";
import { LineChart, TrendingUp, Users, DollarSign, Calendar, ArrowUpRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "12m">("30d");

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Analytics & Reports"
        title="Performance & Funnels"
        titleMuted="· Real-time Aggregation"
        description="Báo cáo chuyên sâu về tăng trưởng học viên, doanh thu trả phí, tỷ lệ hoàn thành lộ trình và phân tích Retention theo Cohort."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Doanh thu tháng này", value: "$48,210", delta: "+12% vs last month", up: true },
          { label: "Học viên đăng ký mới", value: "342", delta: "+8.4% vs last month", up: true },
          { label: "Tỷ lệ vượt TOPIK", value: "94.2%", delta: "+3.1% vs target", up: true },
          { label: "Thời gian học TB/ngày", value: "24.5 min", delta: "+15% vs avg", up: true },
        ].map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card space-y-2"
          >
            <span className="text-xs text-admin-text-muted">{m.label}</span>
            <p className="text-3xl font-semibold num text-admin-text-primary tracking-[-0.02em]">
              {m.value}
            </p>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-admin-success">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{m.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="p-6 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-admin-text-muted">Tổng quan doanh thu đa kênh</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-semibold num text-admin-text-primary tracking-[-0.02em]">
                $124,860.40
              </span>
              <span className="text-xs font-semibold text-admin-success flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> 4.2% vs kỳ trước
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-admin-control bg-admin-subtle border border-admin-border">
            {(["7d", "30d", "90d", "12m"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-colors ${
                  range === r
                    ? "bg-admin-surface text-admin-text-primary shadow-xs"
                    : "text-admin-text-muted hover:text-admin-text-primary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Chart Placeholder */}
        <div className="h-64 rounded-admin-control bg-admin-subtle/40 border border-admin-border flex items-center justify-center text-xs text-admin-text-muted flex-col gap-2">
          <LineChart className="w-8 h-8 text-admin-brand-teal/60" />
          <span>Biểu đồ đường cong Recharts đa tầng (sẵn sàng tích hợp ở Phase UI-2)</span>
        </div>
      </div>
    </div>
  );
}
