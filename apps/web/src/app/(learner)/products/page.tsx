"use client";

import React, { useState } from "react";
import { PRODUCTS_LIST, ProductItem } from "@/lib/data/products-data";
import { CheckoutModal } from "@/components/shop/CheckoutModal";
import { useAuth } from "@/lib/context/AuthContext";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Price } from "@/components/shared/Price";
import {
  ShoppingBag,
  Check,
  CheckCircle2,
  Crown,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ProductsPage() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const { user, updateProfile } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handlePaymentSuccess = () => {
    if (user) {
      updateProfile({ isVip: true });
    }
  };

  const handleOpenVipCheckout = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      setSelectedProduct(PRODUCTS_LIST[1]); // Lifetime VIP product
      setIsUpgrading(false);
    }, 200);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-14">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/20 text-amber-800 dark:text-yellow-300 border border-amber-500/30 text-xs font-bold shadow-xs">
          <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>
            {isEn
              ? "Premium VIP Membership & Lifetime Privileges"
              : "Gói Hội viên Premium & Đặc quyền VIP Trọn đời"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          {isEn
            ? "Invest Once, Master Korean for a Lifetime"
            : "Đầu tư một lần, làm chủ tiếng Hàn trọn đời"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "Unlimited access to 120+ TOPIK 1-6 lessons, native Seoul AI speech training, licensed mock exams, and smart SRS flashcards."
            : "Mở khoá không giới hạn 120+ bài học TOPIK 1-6, luyện nói phát âm AI chuẩn Seoul, kho đề thi thử bản quyền và bộ thẻ ghi nhớ SRS thông minh."}
        </p>
      </div>

      {/* 2. Free vs Lifetime VIP Cards (Equal-height CSS Grid, unclipped badge, single source of truth Price) */}
      <div className="max-w-5xl mx-auto pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-8 lg:gap-10">
          
          {/* Card 1: Free Tier (Mobile order-2, Desktop order-1) */}
          <div className="order-2 md:order-1 rounded-[24px] bg-white dark:bg-card border border-[#E9E9E4] dark:border-border p-8 shadow-soft flex flex-col justify-between transition-all hover:shadow-card">
            <div>
              {/* Eyebrow */}
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.08em] block">
                {isEn ? "STARTER" : "KHỞI ĐẦU"}
              </span>

              {/* Title */}
              <h3 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground mt-2">
                {isEn ? "Free Plan" : "Gói Miễn Phí"}
              </h3>

              {/* Description */}
              <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed min-h-[44px]">
                {isEn
                  ? "For learners taking their first steps with Hangul."
                  : "Dành cho người mới làm quen với bảng chữ cái Hangul."}
              </p>

              {/* Price Block */}
              <div className="mt-5 min-h-[80px] flex items-end">
                <Price
                  amount={0}
                  period={isEn ? "/ forever" : "/ mãi mãi"}
                  size="xl"
                  locale={isEn ? "en" : "vi"}
                />
              </div>

              {/* Hairline Divider */}
              <hr className="border-t border-[#E9E9E4] dark:border-border/60 my-6" />

              {/* Feature List */}
              <ul className="space-y-[14px] text-[15px]">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="text-foreground">
                    {isEn ? "Full 4-lesson Hangul alphabet set" : "Trọn bộ 4 bài bảng chữ cái Hangul"}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="text-foreground">
                    {isEn ? "First 2 basic grammar lessons" : "2 bài ngữ pháp sơ cấp đầu tiên"}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="text-foreground">
                    {isEn ? "Limited to 20 SRS Flashcards" : "Giới hạn tối đa 20 thẻ Flashcard SRS"}
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-muted/70 text-muted-foreground flex items-center justify-center shrink-0">
                      <Lock className="w-3 h-3 text-muted-foreground/80" />
                    </span>
                    <span className="text-muted-foreground/70">
                      {isEn ? "Unlimited mock TOPIK exams" : "Không giới hạn đề thi thử TOPIK"}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground font-medium shrink-0">
                    {isEn ? "Available in VIP" : "Chỉ có ở VIP"}
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-muted/70 text-muted-foreground flex items-center justify-center shrink-0">
                      <Lock className="w-3 h-3 text-muted-foreground/80" />
                    </span>
                    <span className="text-muted-foreground/70">
                      {isEn ? "Honey AI assistant 24/7" : "Trợ lý AI Honey giải đáp 24/7"}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground font-medium shrink-0">
                    {isEn ? "Available in VIP" : "Chỉ có ở VIP"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Bottom CTA Block */}
            <div className="pt-8">
              <button
                disabled
                className="w-full h-[52px] rounded-[14px] bg-secondary/80 border border-border text-muted-foreground font-bold text-sm flex items-center justify-center gap-2 cursor-default select-none transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isEn ? "Your current plan" : "Gói hiện tại của bạn"}</span>
              </button>
              {/* Invisible spacer so CTA positions match VIP card note */}
              <div className="h-5 mt-2.5" />
            </div>
          </div>

          {/* Card 2: Lifetime VIP Tier (Mobile order-1, Desktop order-2) */}
          <div className="order-1 md:order-2 relative mt-4 md:mt-0 rounded-[26px] p-[2px] bg-gradient-to-br from-amber-400 via-junghyeon-teal to-amber-500 shadow-card hover:shadow-card-hover transition-all">
            {/* Top Most Popular Badge (Fully visible, centered on top edge, not clipped) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-md select-none whitespace-nowrap">
                <Crown className="w-3.5 h-3.5 fill-white" />
                <span>{isEn ? "MOST POPULAR ⭐" : "PHỔ BIẾN NHẤT ⭐"}</span>
              </span>
            </div>

            {/* Inner Card Content */}
            <div className="rounded-[24px] bg-gradient-to-b from-amber-500/[0.05] via-white to-white dark:from-amber-500/[0.08] dark:via-card dark:to-card p-8 h-full flex flex-col justify-between">
              <div>
                {/* Eyebrow */}
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-[0.08em] block">
                  {isEn ? "MAXIMUM PRIVILEGES" : "ĐẶC QUYỀN TỐI ĐA"}
                </span>

                {/* Title */}
                <h3 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground mt-2 flex items-center justify-between">
                  <span>{isEn ? "Lifetime VIP Membership" : "Hội viên VIP Trọn Đời"}</span>
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                </h3>

                {/* Description */}
                <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed min-h-[44px]">
                  {isEn
                    ? "All features from Hangul to TOPIK 6 forever."
                    : "Tất cả tính năng từ Hangul đến TOPIK 6 vĩnh viễn."}
                </p>

                {/* Price Block (Deep green price #12302F, never monospace, strikethrough in muted gray) */}
                <div className="mt-5 min-h-[80px] flex items-end">
                  <Price
                    amount={1490000}
                    originalAmount={3500000}
                    period={isEn ? "/ lifetime" : "/ trọn đời"}
                    size="xl"
                    locale={isEn ? "en" : "vi"}
                  />
                </div>

                {/* Hairline Divider */}
                <hr className="border-t border-[#E9E9E4] dark:border-border/60 my-6" />

                {/* Feature List */}
                <ul className="space-y-[14px] text-[15px]">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-foreground font-medium">
                      {isEn
                        ? "Unlock all TOPIK 1 - 6 roadmap (120+ lessons)"
                        : "Mở khoá toàn bộ lộ trình TOPIK 1 - 6 (120+ bài)"}
                    </span>
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-foreground font-medium">
                      {isEn
                        ? "Unlimited SRS flashcard reviews"
                        : "Không giới hạn số lượng thẻ ôn tập SRS"}
                    </span>
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-foreground font-medium">
                      {isEn
                        ? "Native Seoul speech recognition practice"
                        : "Luyện phát âm chuẩn Seoul với nhận diện giọng nói"}
                    </span>
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-foreground font-medium">
                      {isEn
                        ? "Standardized TOPIK exams from NIIED"
                        : "Kho đề thi TOPIK chuẩn Viện Giáo dục Hàn Quốc"}
                    </span>
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-foreground font-medium">
                      {isEn
                        ? "Gift set of 500 printed flashcards delivered to doorstep"
                        : "Tặng kèm bộ Flashcard giấy 500 từ gửi tận nhà"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Bottom CTA Block (Coral button with hover lift & loading state) */}
              <div className="pt-8">
                <button
                  onClick={handleOpenVipCheckout}
                  disabled={isUpgrading}
                  className="w-full h-[52px] rounded-[14px] bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white font-bold text-sm shadow-coral-glow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75"
                >
                  <span>
                    {isUpgrading
                      ? (isEn ? "Opening Checkout..." : "Đang mở thanh toán...")
                      : (isEn ? "Upgrade to Lifetime VIP (Save 57%)" : "Nâng cấp VIP ngay (Tiết kiệm 57%)")}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[13px] text-muted-foreground text-center mt-2.5">
                  {isEn
                    ? "One-time payment · No hidden fees · 7-day money-back guarantee"
                    : "Thanh toán một lần · Không phí ẩn · Hoàn tiền 7 ngày"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Products, Courses & Printed Flashcards */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight text-center">
          {isEn ? "All Learning Products & Courses" : "Tất cả sản phẩm học tập"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS_LIST.map((prod) => (
            <div
              key={prod.id}
              className={`p-6 rounded-[24px] bg-card border transition-all flex flex-col justify-between group ${
                prod.isPopular
                  ? "border-amber-400 ring-2 ring-amber-400/20 shadow-card"
                  : "border-[#E9E9E4] dark:border-border shadow-soft hover:shadow-card"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">
                    {prod.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-foreground group-hover:text-junghyeon-teal transition-colors">
                  {prod.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {prod.description}
                </p>

                <div className="pt-2">
                  <Price
                    amount={prod.price}
                    originalAmount={prod.originalPrice}
                    size="md"
                    locale={isEn ? "en" : "vi"}
                  />
                </div>

                <ul className="space-y-2 pt-2 border-t border-border/60 text-[11px] text-foreground/80">
                  {prod.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60">
                <button
                  onClick={() => setSelectedProduct(prod)}
                  className="w-full py-2.5 rounded-xl bg-secondary hover:bg-junghyeon-teal hover:text-white text-xs font-bold text-foreground transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isEn ? "Select Package" : "Chọn mua gói này"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Checkout Modal with VietQR and Card */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
