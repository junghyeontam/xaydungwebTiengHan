import React from "react";
import { LucideIcon } from "lucide-react";
import { Num } from "@/components/shared/Num";
import { Delta } from "@/components/shared/Delta";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  change?: {
    value: string | number;
    isPositive?: boolean;
    period?: string;
  };
  icon: LucideIcon;
  colorVariant?: "teal" | "coral" | "blue" | "amber" | "emerald";
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  colorVariant = "teal",
  loading = false,
}: StatCardProps) {
  const variantStyles = {
    teal: "bg-teal-500/10 text-junghyeon-teal dark:text-emerald-400 border-teal-500/20",
    coral: "bg-coral-500/10 text-junghyeon-coral border-junghyeon-coral/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  if (loading) {
    return (
      <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-soft animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-2xl" />
        </div>
        <div className="h-7 w-32 bg-muted rounded-lg" />
        <div className="h-3 w-20 bg-muted rounded-md" />
      </div>
    );
  }

  return (
    <div className="p-5 rounded-card bg-admin-surface border border-admin-border shadow-admin-card hover:shadow-card transition-shadow relative overflow-hidden group">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-admin-text-secondary">{title}</p>
          <div
            data-num="true"
            className="text-3xl font-semibold tracking-[-0.02em] text-admin-text-primary num select-text"
          >
            {typeof value === "number" ? <Num value={value} /> : value}
          </div>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${variantStyles[colorVariant]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {change && (
        <div className="mt-3 pt-3 border-t border-admin-border/50 flex items-center gap-1.5 text-xs font-medium">
          <Delta
            value={
              change.isPositive !== false
                ? Math.abs(Number(change.value))
                : -Math.abs(Number(change.value))
            }
            isDecimal={false}
            period={change.period || "so với tháng trước"}
          />
        </div>
      )}
    </div>
  );
}
