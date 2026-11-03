"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Copy, Check, Percent, Users, Trash2, Power } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New coupon modal state
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("20");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/marketing");
      const data = await res.json();
      if (data?.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Failed to load coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = async (code: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_coupon",
          code,
          isActive: !currentStatus,
        }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.code === code ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_coupon",
          code: newCode.toUpperCase(),
          discountPercent: Number(newDiscount),
          description: newDesc,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setNewCode("");
        setNewDesc("");
        fetchCoupons();
      }
    } catch (err) {
      console.error("Create coupon error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Marketing"
        title="Discount Coupons & Vouchers"
        titleMuted={`· ${coupons.length} Active Codes`}
        description="Quản lý mã giảm giá cho khóa học VIP, combo sách và gói hội viên ôn thi TOPIK."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-admin-pill bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo mã coupon mới
          </button>
        }
      />

      {/* Coupon List Table */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                <th className="py-3 px-4 font-medium">Mã coupon</th>
                <th className="py-3 px-4 font-medium">Mức giảm giá</th>
                <th className="py-3 px-4 font-medium">Mô tả chương trình</th>
                <th className="py-3 px-4 font-medium">Lượt sử dụng</th>
                <th className="py-3 px-4 font-medium">Trạng thái</th>
                <th className="py-3 px-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-admin-subtle/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs tracking-wider text-admin-brand-dark bg-admin-subtle px-2 py-1 rounded border border-admin-border">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="text-admin-text-muted hover:text-admin-brand-teal transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="w-3.5 h-3.5 text-admin-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-admin-brand-teal">
                    {coupon.discountPercent}% OFF
                  </td>
                  <td className="py-3 px-4 text-admin-text-secondary max-w-xs truncate">
                    {coupon.description || "—"}
                  </td>
                  <td className="py-3 px-4 text-admin-text-primary font-num">
                    {coupon.usageCount} lượt
                  </td>
                  <td className="py-3 px-4">
                    {coupon.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-success-tint text-admin-success border border-admin-success/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-admin-success" />
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-subtle text-admin-text-muted border border-admin-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-admin-text-muted" />
                        Đã tạm dừng
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggle(coupon.code, coupon.isActive)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-admin-pill font-medium border transition-colors ${
                        coupon.isActive
                          ? "text-admin-brand-coral border-admin-brand-coral/30 hover:bg-admin-brand-coral/10"
                          : "text-admin-brand-teal border-admin-brand-teal/30 hover:bg-admin-brand-teal/10"
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      {coupon.isActive ? "Tắt" : "Kích hoạt"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal create coupon */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-admin-surface border border-admin-border rounded-admin-card shadow-admin-floating max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-admin-text-primary">Tạo mã giảm giá mới</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-admin-text-primary">Mã Coupon</label>
                <input
                  type="text"
                  required
                  placeholder="VD: TOPIK50, SUMMER2026"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary num font-bold focus:outline-none focus:border-admin-brand-teal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-admin-text-primary">Mức giảm (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-admin-text-primary">Mô tả / Ghi chú</label>
                <input
                  type="text"
                  placeholder="VD: Giảm 20% cho học viên mới đợt khai giảng"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 text-xs text-admin-text-secondary hover:text-admin-text-primary transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white rounded-admin-pill transition-colors"
                >
                  {submitting ? "Đang tạo..." : "Xác nhận tạo mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
