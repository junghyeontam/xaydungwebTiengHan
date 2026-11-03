"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  Search,
  ExternalLink,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Price } from "@/components/shared/Price";
import { formatCurrencyVND } from "@/lib/format";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { maskName } from "@/lib/utils/masking";

interface OrderItem {
  id: string;
  customer: string;
  plan: string;
  amount: number;
  status: "paid" | "pending" | "refund_proposed" | "refunded";
  method: string;
  date: string;
  refundProposal?: {
    proposedBy: string;
    amount: number;
    reason: string;
  };
}

export default function AdminOrdersPage() {
  const { can, adminUser, currentRole } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "ORD-8921",
      customer: "Nguyễn Hải Đăng",
      plan: "Gói VIP TOPIK 1 Năm",
      amount: 1290000,
      status: "refund_proposed",
      method: "PayOS / VietQR",
      date: "10 phút trước",
      refundProposal: {
        proposedBy: "sales@junghyeon.vn",
        amount: 1290000,
        reason: "Học viên đăng ký nhầm gói cấp độ 1 thay vì cấp độ 3",
      },
    },
    {
      id: "ORD-8920",
      customer: "Lê Phương Thảo",
      plan: "Gói VIP Trọn đời",
      amount: 2490000,
      status: "paid",
      method: "Chuyển khoản SePay",
      date: "45 phút trước",
    },
    {
      id: "ORD-8919",
      customer: "Phạm Văn Minh",
      plan: "Gói Luyện đề TOPIK 3-4",
      amount: 690000,
      status: "pending",
      method: "Thẻ ATM",
      date: "2 giờ trước",
    },
    {
      id: "ORD-8918",
      customer: "Hoàng Gia Huy",
      plan: "Gói VIP 6 Tháng",
      amount: 890000,
      status: "paid",
      method: "MoMo QR",
      date: "Hôm qua",
    },
  ]);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?role=${currentRole}`);
      const data = await res.json();
      let serverOrders: OrderItem[] = [];
      if (data?.orders) {
        serverOrders = data.orders.map((o: any) => ({
          id: o.id,
          customer: o.customerName,
          plan: o.plan,
          amount: o.amount,
          status: o.status,
          method: o.method,
          date: o.createdAt || "Vừa xong",
          refundProposal: o.refundProposal
            ? {
                proposedBy: o.refundProposal.proposedBy,
                amount: o.refundProposal.amount,
                reason: o.refundProposal.reason,
              }
            : undefined,
        }));
      }

      if (typeof window !== "undefined") {
        const localOrders: OrderItem[] = JSON.parse(
          localStorage.getItem("junghyeon_admin_orders") || "[]"
        );
        const existingIds = new Set(serverOrders.map((o) => o.id));
        const merged = [...serverOrders];
        for (const loc of localOrders) {
          if (!existingIds.has(loc.id)) {
            merged.unshift(loc);
            existingIds.add(loc.id);
          }
        }
        if (merged.length > 0) {
          setOrders(merged);
        }
      } else if (serverOrders.length > 0) {
        setOrders(serverOrders);
      }
    } catch (err) {
      console.warn("Failed to fetch server orders:", err);
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  useEffect(() => {
    loadOrders();
    const handleSync = () => loadOrders();
    window.addEventListener("jh_orders_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("jh_orders_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [loadOrders]);

  // Modal states
  const [proposingOrder, setProposingOrder] = useState<OrderItem | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const canViewRevenue = can("revenue.view");
  const canViewPii = can("learners.view_pii");
  const canProposeRefund = can("orders.refund_propose");
  const canApproveRefund = can("orders.refund_approve");

  const handleOpenProposeModal = (order: OrderItem) => {
    setProposingOrder(order);
    setRefundReason("");
    setRefundAmount(order.amount > 0 ? order.amount : 0);
  };

  const handleConfirmPropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposingOrder || !refundReason.trim()) return;

    try {
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "propose_refund",
          orderId: proposingOrder.id,
          amount: refundAmount,
          reason: refundReason,
          actorEmail: adminUser?.email || "sales@junghyeon.vn",
          actorRole: currentRole,
        }),
      });
    } catch (err) {
      console.warn("Server refund propose failed:", err);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === proposingOrder.id
          ? {
              ...o,
              status: "refund_proposed",
              refundProposal: {
                proposedBy: adminUser?.email || "sales@junghyeon.vn",
                amount: refundAmount,
                reason: refundReason,
              },
            }
          : o
      )
    );

    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("junghyeon_admin_orders") || "[]");
      const updated = stored.map((o: any) =>
        o.id === proposingOrder.id
          ? {
              ...o,
              status: "refund_proposed",
              refundProposal: {
                proposedBy: adminUser?.email || "sales@junghyeon.vn",
                amount: refundAmount,
                reason: refundReason,
              },
            }
          : o
      );
      localStorage.setItem("junghyeon_admin_orders", JSON.stringify(updated));
      window.dispatchEvent(new Event("jh_orders_updated"));
    }

    setProposingOrder(null);
  };

  const handleApproveRefund = async (order: OrderItem) => {
    // Check Two-Person Rule
    if (
      order.refundProposal &&
      adminUser?.email &&
      order.refundProposal.proposedBy.toLowerCase() === adminUser.email.toLowerCase()
    ) {
      alert(
        "Vi phạm quy tắc kiểm soát kép (Two-Person Rule): Người đề xuất hoàn tiền không thể tự mình phê duyệt hoàn tiền. Cần quản trị viên khác duyệt."
      );
      return;
    }

    if (
      window.confirm(
        `Xác nhận phê duyệt hoàn tiền ${formatCurrencyVND(order.refundProposal?.amount || 0)} cho đơn hàng ${order.id}? Thao tác này sẽ ghi nhận vào Audit Logs.`
      )
    ) {
      try {
        const res = await fetch("/api/admin/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "approve_refund",
            orderId: order.id,
            actorEmail: adminUser?.email || "supervisor@junghyeon.vn",
            actorRole: currentRole,
            notes: "Phê duyệt sau đối soát ngân hàng",
          }),
        });
        const data = await res.json();
        if (data.error) {
          alert(`Lỗi phê duyệt: ${data.error}`);
          return;
        }
      } catch (err: any) {
        console.warn("Failed to approve refund via API:", err);
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "refunded" } : o))
      );

      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("junghyeon_admin_orders") || "[]");
        const updated = stored.map((o: any) =>
          o.id === order.id ? { ...o, status: "refunded" } : o
        );
        localStorage.setItem("junghyeon_admin_orders", JSON.stringify(updated));
        window.dispatchEvent(new Event("jh_orders_updated"));
      }
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Sales & Consulting"
        title="Orders & VIP Packages"
        titleMuted="· 142 Orders this month"
        description="Quản lý giao dịch mua gói hội viên VIP, lịch sử thanh toán qua PayOS/SePay và quy trình phê duyệt hoàn tiền 2 bước (Dual Control)."
        actions={
          <div className="flex items-center gap-2">
            {!canViewRevenue && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-admin-pill text-xs font-medium text-admin-text-muted bg-admin-subtle/50 border border-admin-border">
                <Lock className="w-3 h-3" />
                <span>Doanh thu bị ẩn (PoLP)</span>
              </span>
            )}
          </div>
        }
      />

      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                <th className="py-3 px-4 font-medium">Mã đơn</th>
                <th className="py-3 px-4 font-medium">Khách hàng</th>
                <th className="py-3 px-4 font-medium">Gói đăng ký</th>
                <th className="py-3 px-4 font-medium">Số tiền</th>
                <th className="py-3 px-4 font-medium">Phương thức</th>
                <th className="py-3 px-4 font-medium">Trạng thái</th>
                <th className="py-3 px-4 font-medium text-right">Thao tác hoàn tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {orders.map((o) => {
                const customerDisplay = canViewPii ? o.customer : maskName(o.customer);
                const isProposer =
                  o.refundProposal &&
                  adminUser?.email &&
                  o.refundProposal.proposedBy.toLowerCase() === adminUser.email.toLowerCase();

                return (
                  <tr key={o.id} className="hover:bg-admin-subtle/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-admin-brand-teal">
                      {o.id}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-admin-text-primary">
                      {customerDisplay}
                    </td>

                    <td className="py-3.5 px-4 text-admin-text-secondary">
                      {o.plan}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-admin-text-primary">
                      {canViewRevenue ? (
                        <Price amount={o.amount} size="sm" />
                      ) : (
                        <span className="text-admin-text-muted tracking-widest">•••••• ₫</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-admin-text-muted">
                      {o.method}
                    </td>

                    <td className="py-3.5 px-4">
                      {o.status === "paid" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-success-tint text-admin-success border border-admin-success/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-admin-success" />
                          Đã thanh toán
                        </span>
                      )}
                      {o.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-warning-tint text-admin-warning border border-admin-warning/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-admin-warning" />
                          Chờ xử lý
                        </span>
                      )}
                      {o.status === "refund_proposed" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Chờ duyệt hoàn tiền
                        </span>
                      )}
                      {o.status === "refunded" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                          <RotateCcw className="w-3 h-3 text-red-500" />
                          Đã hoàn tiền
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {o.status === "paid" && canProposeRefund && (
                        <button
                          type="button"
                          onClick={() => handleOpenProposeModal(o)}
                          className="px-2.5 py-1 rounded-admin-control bg-admin-subtle hover:bg-admin-subtle/80 text-admin-text-secondary hover:text-admin-text-primary text-[11px] font-medium border border-admin-border transition-colors"
                        >
                          Đề xuất hoàn tiền
                        </button>
                      )}

                      {o.status === "refund_proposed" && canApproveRefund && (
                        <button
                          type="button"
                          disabled={Boolean(isProposer)}
                          onClick={() => handleApproveRefund(o)}
                          className={`px-3 py-1 rounded-admin-pill text-[11px] font-semibold transition-all ${
                            isProposer
                              ? "bg-admin-subtle text-admin-text-muted border border-admin-border cursor-not-allowed opacity-60"
                              : "bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white shadow-xs"
                          }`}
                          title={
                            isProposer
                              ? "Bạn là người đề xuất. Cần quản trị viên khác duyệt (Two-person rule)."
                              : "Phê duyệt hoàn tiền"
                          }
                        >
                          {isProposer ? "Chờ người khác duyệt" : "Duyệt hoàn tiền"}
                        </button>
                      )}

                      {o.status === "refunded" && (
                        <span className="text-[11px] text-admin-text-muted">Đã đối soát</span>
                      )}

                      {o.status === "pending" && (
                        <span className="text-[11px] text-admin-text-placeholder">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Propose Refund Modal */}
      {proposingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-admin-surface border border-admin-border rounded-admin-card shadow-admin-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-admin-brand-coral">
              <RotateCcw className="w-5 h-5 text-admin-brand-coral" />
              <h3 className="text-base font-bold text-admin-text-primary">
                Đề xuất hoàn tiền (Quy tắc 2 người)
              </h3>
            </div>
            <p className="text-xs text-admin-text-secondary leading-relaxed">
              Bạn đang tạo đề xuất hoàn tiền cho đơn hàng <strong className="text-admin-text-primary">{proposingOrder.id}</strong> ({proposingOrder.customer}). Đề xuất sẽ được gửi đến Administrator để thẩm định trước khi chuyển tiền.
            </p>

            <form onSubmit={handleConfirmPropose} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
                  Số tiền hoàn (VND)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
                  Lý do hoàn tiền (Bắt buộc)
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Ví dụ: Học viên thanh toán trùng 2 lần, hoặc gặp sự cố tài khoản..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProposingOrder(null)}
                  className="px-3.5 py-1.5 rounded-admin-pill text-xs font-semibold text-admin-text-secondary hover:bg-admin-subtle transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-admin-pill text-xs font-semibold bg-admin-brand-coral text-white hover:opacity-90 transition-opacity shadow-xs"
                >
                  Gửi đề xuất
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
