"use client";

import React, { useEffect } from "react";
import { AlertCircle, Check, X, Loader2, Sparkles } from "lucide-react";

interface StickySaveBarProps {
  show: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  message?: string;
}

export function StickySaveBar({
  show,
  isSaving,
  onSave,
  onDiscard,
  message = "Bạn có thay đổi chưa được lưu vào hệ thống",
}: StickySaveBarProps) {
  // Listen for Ctrl+S or Cmd+S
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onSave]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-3xl mx-auto animate-in slide-in-from-bottom-5 duration-200">
      <div className="p-4 rounded-2xl bg-brand-navy text-white shadow-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-6 h-6 rounded-full bg-amber-400 text-brand-navy flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold">{message}</span>
            <span className="hidden sm:inline text-white/60 ml-2">
              (Nhấn <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">Ctrl+S</kbd> để lưu nhanh)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
