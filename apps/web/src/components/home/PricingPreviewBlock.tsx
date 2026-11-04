"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Price } from "@/components/shared/Price";
import { ProBadge } from "@/components/shared/ProBadge";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/shared/ScrollReveal";
import { CheckCircle2, ArrowRight, Sparkles, Crown, Star } from "lucide-react";

export function PricingPreviewBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  return (
    <section id="pricing-section" className="py-20 sm:py-24 bg-brand-surface/60 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        <SectionHeading
          eyebrow={<Badge variant="tint">{isEn ? "Pricing & Membership" : "Gói học & Học phí"}</Badge>}
          title={
            isEn
              ? "Choose the Right Plan to <hl>Master Korean</hl>"
              : "Chọn gói học phù hợp <hl>làm chủ tiếng Hàn</hl>"
          }
          subtitle={
            isEn
              ? "Start completely free or unlock lifetime access to all 120+ TOPIK lessons, AI speech feedback, and full mock tests."
              : "Bắt đầu hoàn toàn miễn phí hoặc sở hữu trọn đời toàn bộ 120+ bài học, phòng luyện phát âm AI và kho đề thi TOPIK chuẩn quốc tế."
          }
        />

        {/* Pricing Cards Grid with Staggered Scroll Reveal */}
        <ScrollRevealGroup stagger={0.15} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Free Starter Plan */}
          <ScrollRevealItem
            animation="fade-up"
            distance={24}
            className="rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-card transition-all duration-200"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF5FF] text-brand-primary text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-brand-primary" />
                  <span>{isEn ? "FREE TIER" : "Tự học chủ động"}</span>
                </span>
                <Badge variant="free">Miễn phí</Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-brand-navy tracking-tight">
                  {isEn ? "Free Starter" : "Khởi đầu Miễn phí"}
                </h3>
                <p className="text-xs text-brand-secondary mt-1">
                  {isEn
                    ? "Ideal for Hangul beginners learning the alphabet"
                    : "Dành cho người mới bắt đầu làm quen chữ cái Hangul"}
                </p>
              </div>

              <div className="py-2">
                <Price amount={0} currency="VND" size="xl" />
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-brand-body">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{isEn ? "Full Hangul Alphabet Course" : "Toàn bộ bài học Bảng chữ cái Hangul"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{isEn ? "5 Starter Grammar Lessons" : "5 bài học Ngữ pháp Sơ cấp cơ bản"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{isEn ? "Basic SRS Flashcard Deck" : "Bộ thẻ ôn tập 300 từ vựng cốt lõi"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-brand-muted">
                  <span className="w-4 h-4 rounded-full border border-brand-border flex items-center justify-center text-[10px]">✕</span>
                  <span>{isEn ? "No AI Speech Analyzer" : "Chưa gồm phòng luyện phát âm AI"}</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button href="/roadmap" variant="secondary" size="lg" pill className="w-full justify-center font-semibold">
                {isEn ? "Start Free Now" : "Bắt đầu học miễn phí"}
              </Button>
            </div>
          </ScrollRevealItem>

          {/* Card 2: Lifetime VIP Plan */}
          <ScrollRevealItem
            animation="fade-up"
            distance={24}
            className="relative rounded-2xl bg-white dark:bg-brand-surface border border-amber-300/80 dark:border-amber-600/40 p-7 sm:p-8 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            {/* Top Ribbon */}
            <div className="absolute -top-3.5 right-6">
              <span className="px-3.5 py-1 rounded-full bg-brand-gold text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                {isEn ? "RECOMMENDED • 50% OFF" : "ĐỀ XUẤT • GIẢM 50%"}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800/40">
                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>{isEn ? "PRO ALL-IN-ONE" : "Học & luyện đề toàn diện"}</span>
                </span>
                <ProBadge size="sm" label="LIFETIME VIP" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-brand-navy tracking-tight">
                  {isEn ? "Lifetime VIP Plan" : "Hội viên VIP Trọn đời"}
                </h3>
                <p className="text-xs text-brand-secondary mt-1">
                  {isEn
                    ? "Full access to all roadmaps from zero to TOPIK 6"
                    : "Mở khoá toàn diện lộ trình từ số 0 đến TOPIK 6"}
                </p>
              </div>

              <div className="py-2 flex items-baseline gap-3">
                <Price amount={1490000} currency="VND" size="xl" />
                <span className="line-through text-xs sm:text-sm text-brand-muted">
                  2.980.000 ₫
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-brand-body">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span className="font-medium">{isEn ? "All 120+ Grammar Lessons (A1 - C2)" : "Toàn bộ 120+ bài học Ngữ pháp TOPIK 1 - 6"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span className="font-medium">{isEn ? "Full SRS 4,500+ Flashcard Deck" : "Kho 4.500+ thẻ từ vựng lặp lại ngắt quãng SRS"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span className="font-medium">{isEn ? "AI Speech & Pronunciation Analyzer" : "Phòng luyện phát âm AI sửa lỗi âm điệu tức thì"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span className="font-medium">{isEn ? "Full TOPIK 1 - 2 Mock Tests with Explanations" : "Kho đề thi thử TOPIK có giải thích chi tiết"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span className="font-medium">{isEn ? "Lifetime free updates & offline access" : "Cập nhật bài học mới vĩnh viễn miễn phí"}</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button href="/products" variant="primary" size="lg" pill iconRight={<ArrowRight className="w-5 h-5" />} className="w-full justify-center shadow-sm hover:shadow-card font-bold">
                {isEn ? "Get Lifetime VIP Access" : "Đăng ký học ngay"}
              </Button>
            </div>
          </ScrollRevealItem>
        </ScrollRevealGroup>
      </div>
    </section>
  );
}

export default PricingPreviewBlock;
