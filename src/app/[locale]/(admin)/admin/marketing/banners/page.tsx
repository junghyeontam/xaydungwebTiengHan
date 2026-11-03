"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, ExternalLink, Save, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminBannersPage() {
  const [isActive, setIsActive] = useState(true);
  const [textVi, setTextVi] = useState("🎉 Khai giảng lớp luyện thi TOPIK cấp tốc 2026 — Giảm 40% trọn đời!");
  const [textEn, setTextEn] = useState("🎉 Rapid TOPIK Prep Cohort 2026 is Open — Save 40% Lifetime!");
  const [link, setLink] = useState("/products");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Fetch current banner
    fetch("/api/admin/marketing?type=banner")
      .then((res) => res.json())
      .then((data) => {
        if (data?.banner) {
          setIsActive(data.banner.isActive ?? true);
          if (data.banner.textVi) setTextVi(data.banner.textVi);
          if (data.banner.textEn) setTextEn(data.banner.textEn);
          if (data.banner.link) setLink(data.banner.link);
        }
      })
      .catch((err) => console.error("Failed to load banner", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_banner",
          textVi,
          textEn,
          link,
          isActive,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Marketing"
        title="Banners & Announcements"
        titleMuted="· Global Top Bar"
        description="Quản lý thanh thông báo và chiến dịch truyền thông hiển thị ở vị trí cao nhất trên website học viên."
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-admin-pill bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white font-medium text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? <AlertCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        }
      />

      {savedSuccess && (
        <div className="p-3 rounded-admin-card bg-admin-success-tint border border-admin-success/30 text-admin-success text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Cập nhật banner thành công! Dữ liệu đã được revalidate trên toàn hệ thống học viên.</span>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border p-5 shadow-admin-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-admin-text-muted flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-admin-brand-teal" />
            Live Preview (Xem trước hiển thị)
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-admin-pill ${
              isActive
                ? "bg-admin-success-tint text-admin-success border border-admin-success/20"
                : "bg-admin-subtle text-admin-text-muted border border-admin-border"
            }`}
          >
            {isActive ? "Đang bật công khai" : "Đang tắt"}
          </span>
        </div>

        <div
          className={`p-3 rounded-lg border text-center transition-all ${
            isActive
              ? "bg-gradient-to-r from-admin-brand-dark via-[#1A4543] to-admin-brand-teal text-white border-admin-brand-teal/30 shadow-xs"
              : "bg-admin-subtle/60 text-admin-text-muted border-dashed border-admin-border"
          }`}
        >
          {isActive ? (
            <div className="flex items-center justify-center gap-2 text-xs font-medium">
              <span>{textVi || "Nội dung thông báo..."}</span>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 flex items-center gap-1 hover:text-admin-brand-coral font-semibold"
              >
                Xem chi tiết <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <p className="text-xs italic py-1">Banner hiện đang tắt. Người dùng sẽ không thấy thông báo này.</p>
          )}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border p-5 shadow-admin-card space-y-5">
        <div className="flex items-center justify-between border-b border-admin-border pb-4">
          <div>
            <h3 className="text-sm font-semibold text-admin-text-primary">Trạng thái phát sóng</h3>
            <p className="text-xs text-admin-text-secondary">Bật hoặc tắt hiển thị thanh thông báo trên toàn site.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isActive ? "bg-admin-brand-teal" : "bg-admin-border"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-admin-text-primary">Tiêu đề tiếng Việt</label>
            <input
              type="text"
              value={textVi}
              onChange={(e) => setTextVi(e.target.value)}
              placeholder="VD: Khai giảng lớp TOPIK tháng 11..."
              className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-admin-text-primary">Tiêu đề tiếng Anh (EN)</label>
            <input
              type="text"
              value={textEn}
              onChange={(e) => setTextEn(e.target.value)}
              placeholder="VD: Rapid TOPIK Prep Cohort 2026..."
              className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-admin-text-primary">Đường dẫn đích (CTA Link)</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/products hoặc https://..."
              className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
