"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, ZoomIn, ZoomOut, Check, X, Sparkles, Trash2 } from "lucide-react";

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAvatar: (avatarDataUrl: string) => void;
  onOpenMascotGallery: () => void;
  onRemoveAvatar: () => void;
  currentAvatarUrl?: string;
}

export function AvatarCropModal({
  isOpen,
  onClose,
  onSaveAvatar,
  onOpenMascotGallery,
  onRemoveAvatar,
  currentAvatarUrl,
}: AvatarCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMsg("Chỉ hỗ trợ file ảnh JPG, PNG hoặc WebP");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Dung lượng ảnh tối đa là 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (imageSrc) {
      onSaveAvatar(imageSrc);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-brand-navy dark:text-white">
                Thay đổi ảnh đại diện
              </h3>
              <p className="text-xs text-brand-secondary">
                Tải ảnh từ máy tính hoặc chọn linh vật Honey độc quyền
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

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 text-red-600 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Crop / Preview Area */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-4">
          <div className="relative w-40 h-40 rounded-full border-4 border-white dark:border-brand-surface shadow-md overflow-hidden bg-brand-surface flex items-center justify-center">
            {imageSrc || currentAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc || currentAvatarUrl}
                alt="Preview"
                style={{ transform: `scale(${zoom})` }}
                className="w-full h-full object-cover transition-transform duration-100"
              />
            ) : (
              <Camera className="w-10 h-10 text-brand-muted" />
            )}
          </div>

          {/* Zoom Slider */}
          {imageSrc && (
            <div className="w-full max-w-xs flex items-center gap-2 pt-2">
              <ZoomOut className="w-4 h-4 text-brand-muted" />
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-brand-primary cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-brand-muted" />
            </div>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl border border-brand-border hover:border-brand-primary/40 bg-white dark:bg-brand-bg text-brand-navy dark:text-white font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Upload className="w-4 h-4 text-brand-primary" />
            <span>Tải ảnh từ máy tính</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenMascotGallery();
            }}
            className="p-3 rounded-xl border border-amber-300 bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-yellow-400 font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-amber-500" />
            <span>Chọn linh vật Honey</span>
          </button>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          {currentAvatarUrl ? (
            <button
              type="button"
              onClick={() => {
                onRemoveAvatar();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Gỡ ảnh</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-brand-bg"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!imageSrc}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu ảnh đại diện</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
