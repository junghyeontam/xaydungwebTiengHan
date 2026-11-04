"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Camera, ZoomIn, ZoomOut, Check, X, Sparkles, Trash2, Loader2 } from "lucide-react";

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
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoadedImage(null);
      setImagePreviewUrl(currentAvatarUrl || null);
      setZoom(1);
      setErrorMsg("");
      setIsProcessing(false);
    }
  }, [isOpen, currentAvatarUrl]);

  // Generate cropped preview onto canvas
  const generateCroppedDataUrl = useCallback(
    (img: HTMLImageElement, zoomFactor: number): string => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      // High-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Compute square crop centered with zoom
      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      const cropSize = minDim / zoomFactor;
      const sx = (img.naturalWidth - cropSize) / 2;
      const sy = (img.naturalHeight - cropSize) / 2;

      ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, 256, 256);

      // Return lightweight, high quality compressed JPEG (~18KB)
      return canvas.toDataURL("image/jpeg", 0.88);
    },
    []
  );

  // Process chosen file
  const processFile = (file: File) => {
    setErrorMsg("");

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("Dung lượng tệp tối đa cho phép là 15MB.");
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setLoadedImage(img);
        setZoom(1);
        const initialCropped = generateCroppedDataUrl(img, 1);
        setImagePreviewUrl(initialCropped);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setErrorMsg("Không thể đọc định dạng hình ảnh này. Vui lòng thử ảnh khác.");
        setIsProcessing(false);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setErrorMsg("Đã xảy ra lỗi khi tải tệp từ thiết bị của bạn.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Clear input so same file can be re-selected if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Re-generate preview when zoom changes
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (loadedImage) {
      const updated = generateCroppedDataUrl(loadedImage, newZoom);
      setImagePreviewUrl(updated);
    }
  };

  // Save the cropped image
  const handleApply = () => {
    if (loadedImage) {
      const finalCropped = generateCroppedDataUrl(loadedImage, zoom);
      onSaveAvatar(finalCropped);
      onClose();
    } else if (imagePreviewUrl) {
      onSaveAvatar(imagePreviewUrl);
      onClose();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-brand-navy dark:text-white">
                Thay đổi ảnh đại diện
              </h3>
              <p className="text-xs text-brand-secondary">
                Tải ảnh từ máy tính hoặc chọn chú hổ Honey đại diện
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-bg hover:bg-brand-surface flex items-center justify-center text-brand-muted hover:text-brand-navy transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Circular Avatar Preview & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
            isDragging
              ? "border-brand-primary bg-brand-primary/5 border-dashed"
              : "border-brand-border bg-brand-bg"
          }`}
        >
          <div className="relative w-40 h-40 rounded-full border-4 border-white dark:border-brand-surface shadow-md overflow-hidden bg-brand-surface flex items-center justify-center">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 text-brand-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-[11px] font-semibold">Đang xử lý ảnh...</span>
              </div>
            ) : imagePreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-brand-muted">
                <Camera className="w-10 h-10" />
                <span className="text-[11px]">Chưa có ảnh</span>
              </div>
            )}
          </div>

          {/* Zoom Slider (available when image is loaded) */}
          {loadedImage && (
            <div className="w-full max-w-xs flex items-center gap-3 pt-4">
              <ZoomOut className="w-4 h-4 text-brand-muted" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-full accent-brand-primary cursor-pointer h-1.5 bg-brand-border rounded-lg"
              />
              <ZoomIn className="w-4 h-4 text-brand-muted" />
            </div>
          )}

          <p className="text-[11px] text-brand-muted pt-2 text-center">
            Kéo thả ảnh vào đây hoặc bấm tải từ thiết bị (tự động căn tròn 256x256)
          </p>
        </div>

        {/* Upload Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-xl border border-brand-border hover:border-brand-primary/40 bg-white dark:bg-brand-bg text-brand-navy dark:text-white font-bold flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-xs"
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
            className="p-3.5 rounded-xl border border-amber-300/80 bg-amber-500/10 hover:bg-amber-500/15 text-amber-800 dark:text-yellow-400 font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Chọn linh vật Honey</span>
          </button>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          {imagePreviewUrl ? (
            <button
              type="button"
              onClick={() => {
                onRemoveAvatar();
                setImagePreviewUrl(null);
                setLoadedImage(null);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Gỡ ảnh đại diện</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-brand-bg transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!imagePreviewUrl && !loadedImage}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50 transition-all"
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
