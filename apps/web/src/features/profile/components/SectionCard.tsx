"use client";

import React from "react";
import { Edit3, Check, X, Loader2 } from "lucide-react";

interface SectionCardProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onEditClick?: () => void;
  onCancelClick?: () => void;
  onSaveClick?: () => void;
  hideEditControls?: boolean;
  children: React.ReactNode;
  footerNotice?: React.ReactNode;
  customActions?: React.ReactNode;
}

export function SectionCard({
  id,
  title,
  description,
  icon,
  isEditing = false,
  isSubmitting = false,
  onEditClick,
  onCancelClick,
  onSaveClick,
  hideEditControls = false,
  children,
  footerNotice,
  customActions,
}: SectionCardProps) {
  return (
    <div
      id={id}
      className={`rounded-3xl bg-white dark:bg-brand-surface border transition-all ${
        isEditing
          ? "border-brand-primary/40 shadow-md ring-2 ring-brand-primary/10"
          : "border-brand-border shadow-xs hover:border-brand-border/80"
      }`}
    >
      {/* Card Header */}
      <div className="p-6 sm:p-7 border-b border-brand-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-black text-brand-navy dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {customActions}

          {!hideEditControls && (
            !isEditing ? (
              <button
                type="button"
                onClick={onEditClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-surface hover:border-brand-primary/40 text-xs font-bold text-brand-navy transition-all active:scale-95 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancelClick}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl border border-brand-border hover:bg-brand-bg text-xs font-bold text-brand-secondary transition-colors"
                >
                  Hủy
                </button>
                {onSaveClick && (
                  <button
                    type="button"
                    onClick={onSaveClick}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Lưu thay đổi</span>
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Card Content (View Mode or Form Mode) */}
      <div className="p-6 sm:p-7 space-y-6">{children}</div>

      {/* Card Footer notice if any */}
      {footerNotice && (
        <div className="px-6 sm:px-7 py-3.5 border-t border-brand-border/60 bg-brand-bg text-[11px] text-brand-muted rounded-b-3xl">
          {footerNotice}
        </div>
      )}
    </div>
  );
}
