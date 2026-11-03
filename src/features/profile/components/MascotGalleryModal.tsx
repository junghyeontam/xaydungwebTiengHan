"use client";

import React, { useState } from "react";
import { MascotHoney } from "@/components/ui/MascotHoney";
import { MASCOT_AVATARS_GALLERY, MascotPreset } from "../reference-data";
import { X, Check, Sparkles } from "lucide-react";

interface MascotGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMascot: (mascot: MascotPreset) => void;
  currentMascotId?: string;
}

export function MascotGalleryModal({
  isOpen,
  onClose,
  onSelectMascot,
  currentMascotId = "honey-default",
}: MascotGalleryModalProps) {
  const [selectedId, setSelectedId] = useState(currentMascotId);

  if (!isOpen) return null;

  const activeMascot = MASCOT_AVATARS_GALLERY.find((m) => m.id === selectedId) || MASCOT_AVATARS_GALLERY[0];

  const handleConfirm = () => {
    onSelectMascot(activeMascot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white dark:bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-brand-navy dark:text-white">
                Bộ sưu tập Linh vật Honey
              </h3>
              <p className="text-xs text-brand-secondary">
                Chọn phong cách chú hổ Honey đại diện cho lộ trình tiếng Hàn của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-brand-muted hover:text-brand-navy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Big Preview */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-brand-bg to-brand-surface border border-brand-border flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-brand-bg shadow-sm flex items-center justify-center border-2 border-brand-primary/30">
            <MascotHoney mood={activeMascot.mood} size={70} />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold">
              {activeMascot.tag}
            </span>
            <h4 className="text-sm font-bold text-brand-navy dark:text-white mt-1">
              {activeMascot.nameVi}
            </h4>
          </div>
        </div>

        {/* Mascot Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {MASCOT_AVATARS_GALLERY.map((mascot) => {
            const isSelected = selectedId === mascot.id;
            return (
              <button
                key={mascot.id}
                type="button"
                onClick={() => setSelectedId(mascot.id)}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary/10 shadow-sm ring-2 ring-brand-primary/20"
                    : "border-brand-border bg-brand-bg hover:bg-white hover:border-brand-primary/30"
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <MascotHoney mood={mascot.mood} size={42} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-brand-navy dark:text-white truncate max-w-[80px]">
                    {mascot.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-brand-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-brand-bg"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-xs active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Áp dụng ảnh Honey</span>
          </button>
        </div>
      </div>
    </div>
  );
}
