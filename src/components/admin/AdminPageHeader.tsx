"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Download,
  Plus,
  ArrowRightLeft,
  ChevronDown,
} from "lucide-react";

export interface AdminPageHeaderProps {
  category?: string;
  title: string;
  titleMuted?: string;
  description?: string;
  dateRangeText?: string;
  showCompareToggle?: boolean;
  compareActive?: boolean;
  onToggleCompare?: () => void;
  onExport?: () => void;
  exportLoading?: boolean;
  primaryAction?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    href?: string;
    onClick?: () => void;
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  category = "Overview",
  title,
  titleMuted,
  description,
  dateRangeText = "Oct 1 – Oct 31, 2026",
  showCompareToggle = false,
  compareActive = false,
  onToggleCompare,
  onExport,
  exportLoading = false,
  primaryAction,
  actions,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-admin-border/60">
      {/* Left: Category and large lightweight title */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-admin-text-muted">
          <span>{category}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-admin-text-primary">
          {title}{" "}
          {titleMuted && (
            <span className="text-admin-text-muted font-normal">
              {titleMuted}
            </span>
          )}
        </h1>

        {description && (
          <p className="text-xs text-admin-text-secondary max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 shrink-0">
        {/* Date Range Picker Badge */}
        {dateRangeText && (
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs font-medium text-admin-text-secondary transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-admin-text-muted" />
            <span className="num-tabular">{dateRangeText}</span>
            <ChevronDown className="w-3 h-3 text-admin-text-muted" />
          </button>
        )}

        {/* Compare Toggle */}
        {showCompareToggle && (
          <button
            type="button"
            onClick={onToggleCompare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-admin-control border text-xs font-medium transition-colors ${
              compareActive
                ? "bg-admin-brand-teal/10 border-admin-brand-teal text-admin-brand-teal font-semibold"
                : "border-admin-border bg-admin-surface hover:bg-admin-subtle text-admin-text-secondary"
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>
        )}

        {/* Export Button */}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            disabled={exportLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs font-medium text-admin-text-secondary disabled:opacity-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-admin-text-muted" />
            <span>{exportLoading ? "Exporting..." : "Export"}</span>
          </button>
        )}

        {/* Extra actions & children */}
        {actions}
        {children}

        {/* Primary Action (Coral CTA only) */}
        {primaryAction && (
          <>
            {primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-admin-control bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all duration-150"
              >
                {primaryAction.icon ? (
                  <primaryAction.icon className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{primaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-admin-control bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all duration-150"
              >
                {primaryAction.icon ? (
                  <primaryAction.icon className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{primaryAction.label}</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
