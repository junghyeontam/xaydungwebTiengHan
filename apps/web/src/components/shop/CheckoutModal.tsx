"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { ProductItem } from "@/lib/data/products-data";
import { BRAND_CONFIG } from "@/config/brand";
import { validateCoupon } from "@/features/marketing/marketing-service";
import { useAuth } from "@/lib/context/AuthContext";
import { Price } from "@/components/shared/Price";
import { formatCurrencyVND } from "@/lib/format";
import {
  X,
  QrCode,
  CreditCard,
  CheckCircle2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";

interface CheckoutModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ product, onClose, onSuccess }: CheckoutModalProps) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "card">("vietqr");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  if (!product) return null;

  const finalPrice = Math.max(0, product.price - discountAmount);
  const orderCode = `JH${Date.now().toString().slice(-6)}`;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();

    const result = validateCoupon(code);
    if (result.valid) {
      const discount = Math.round((product.price * result.discountPercent) / 100);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      setCouponError(result.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handleConfirmPayment = async () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3DBBA8", "#F5B93A", "#E8604C"],
    });

    const orderPayload = {
      orderId: orderCode,
      productId: product.id,
      productTitle: product.title,
      plan: product.title,
      amount: finalPrice,
      paymentMethod: paymentMethod === "vietqr" ? "PayOS / VietQR" : "Thẻ Quốc tế",
      method: paymentMethod === "vietqr" ? "PayOS / VietQR" : "Thẻ Quốc tế",
      status: "paid",
      customerName: user?.fullName || "Học viên JungHyeon",
      customerEmail: user?.email || "hocvien@junghyeon.vn",
      customerPhone: "0988 112 233",
      createdAt: new Date().toISOString(),
    };

    // 1. Dispatch to server API
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.warn("Failed to sync order with server API:", err);
    }

    // 2. Lưu đơn hàng vào localStorage cho cả Learner và Admin
    if (typeof window !== "undefined") {
      const orders = JSON.parse(localStorage.getItem("junghyeon_orders") || "[]");
      orders.unshift(orderPayload);
      localStorage.setItem("junghyeon_orders", JSON.stringify(orders));

      const adminOrders = JSON.parse(localStorage.getItem("junghyeon_admin_orders") || "[]");
      adminOrders.unshift({
        id: `ORD-${Date.now().toString().slice(-4)}`,
        customer: user?.fullName || "Học viên JungHyeon",
        plan: product.title,
        amount: finalPrice,
        status: "paid",
        method: paymentMethod === "vietqr" ? "PayOS / VietQR" : "Thẻ Quốc tế",
        date: "Vừa xong",
      });
      localStorage.setItem("junghyeon_admin_orders", JSON.stringify(adminOrders));

      window.dispatchEvent(new Event("jh_orders_updated"));
    }

    setIsPaymentConfirmed(true);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {!isPaymentConfirmed ? (
          <>
            <div>
              <span className="text-xs font-bold text-junghyeon-teal uppercase tracking-wider">
                Thanh toán an toàn
              </span>
              <h3 className="text-xl font-extrabold text-foreground">
                {product.title}
              </h3>
            </div>

            {/* Chi tiết giá & Khuyến mãi */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Giá gốc niêm yết:</span>
                <Price amount={product.originalPrice} size="sm" strikethrough />
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                  <span>Mã giảm giá đã áp dụng:</span>
                  <div className="flex items-center">
                    <span>-</span>
                    <Price amount={discountAmount} size="sm" color="teal" />
                  </div>
                </div>
              )}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">
                  Tổng thanh toán:
                </span>
                <Price amount={finalPrice} size="lg" color="coral" />
              </div>
            </div>

            {/* Nhập mã giảm giá */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã (Gợi ý: JUNGHYEON2026 hoặc HONEY)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground uppercase num font-bold focus:ring-2 focus:ring-junghyeon-teal outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground transition-all shrink-0"
              >
                Áp dụng
              </button>
            </form>
            {couponError && (
              <p className="text-[11px] text-red-500 font-medium">{couponError}</p>
            )}

            {/* Phương thức thanh toán */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Phương thức thanh toán:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("vietqr")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === "vietqr"
                      ? "border-junghyeon-teal bg-junghyeon-teal/10 shadow-soft ring-2 ring-junghyeon-teal/20"
                      : "border-border bg-background hover:bg-secondary/60"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-junghyeon-teal shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Chuyển khoản VietQR</div>
                    <div className="text-[10px] text-muted-foreground">Quét QR tự động</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === "card"
                      ? "border-junghyeon-teal bg-junghyeon-teal/10 shadow-soft ring-2 ring-junghyeon-teal/20"
                      : "border-border bg-background hover:bg-secondary/60"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Thẻ Quốc Tế</div>
                    <div className="text-[10px] text-muted-foreground">Visa, Master (Stripe)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Chi tiết chuyển khoản VietQR */}
            {paymentMethod === "vietqr" && (
              <div className="p-4 rounded-2xl bg-white dark:bg-junghyeon-dark-card border border-border space-y-3 text-center">
                {/* SVG VietQR giả lập */}
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-gray-200 shadow-xs flex flex-col items-center justify-center">
                  <div className="w-28 h-28 bg-gray-900 rounded-lg p-1 flex items-center justify-center">
                    <div className="w-full h-full bg-white flex flex-col items-center justify-center text-[10px] font-mono font-bold text-gray-900">
                      <span>VIETQR</span>
                      <span className="text-[8px] mt-1 text-gray-500">{orderCode}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-left pt-2 border-t border-border/80">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngân hàng:</span>
                    <strong className="text-foreground">MB Bank (Quân Đội)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Số tài khoản:</span>
                    <div className="flex items-center gap-1 num-tabular font-bold text-foreground">
                      <span>0988123456</span>
                      <button
                        onClick={() => handleCopyText("0988123456")}
                        className="text-junghyeon-teal hover:underline text-[10px]"
                      >
                        {isCopied ? "Đã chép" : "Chép"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nội dung CK:</span>
                    <div className="num-tabular font-bold text-junghyeon-coral">
                      {orderCode}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmPayment}
              className="w-full py-3.5 rounded-2xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white text-xs sm:text-sm font-bold shadow-coral-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Xác nhận đã thanh toán ({formatCurrencyVND(finalPrice)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bảo mật 100% qua chuẩn SSL 256-bit • Hoá đơn gửi qua Email</span>
            </div>
          </>
        ) : (
          /* MÀN HÌNH XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG */
          <div className="text-center space-y-4 py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Kích hoạt gói thành công!
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Mã đơn hàng: <strong>{orderCode}</strong>. Toàn bộ đặc quyền của {product.title} đã được kích hoạt ngay vào tài khoản của bạn!
            </p>
            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-junghyeon-teal text-white text-xs font-bold shadow-teal-glow"
            >
              Vào học bài ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
