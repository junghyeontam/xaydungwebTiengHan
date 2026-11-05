"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/shared/Badge";
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/shared/ScrollReveal";
import { Star, Award } from "lucide-react";

export function TestimonialsBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  const reviews = [
    {
      name: t("testimonials.review1Name") || "Trần Thu Hương",
      role: t("testimonials.review1Role") || "Học viên TOPIK 4",
      avatar: "TH",
      quote:
        t("testimonials.review1Text") ||
        "Nhờ phương pháp SRS lặp lại ngắt quãng và phòng luyện phát âm AI, mình đã tự tin đỗ TOPIK 4 chỉ sau 6 tháng học từ số 0!",
      badge: "TOPIK 4 • 192/300",
    },
    {
      name: t("testimonials.review2Name") || "Nguyễn Minh Đức",
      role: t("testimonials.review2Role") || "Kỹ sư tại Seoul",
      avatar: "MD",
      quote:
        t("testimonials.review2Text") ||
        "Giao diện học rất tinh gọn, hiện đại và không hề bị rối mắt. Các bài hội thoại thực tế giúp mình giao tiếp tự tin khi đi làm tại công ty Hàn Quốc.",
      badge: isEn ? "Software Engineer in Seoul" : "Kỹ sư làm việc tại Seoul",
    },
    {
      name: t("testimonials.review3Name") || "Lê Hoàng Yến",
      role: t("testimonials.review3Role") || "Du học sinh Hàn Quốc",
      avatar: "HY",
      quote:
        t("testimonials.review3Text") ||
        "Các bài sửa luận TOPIK 54 của cô JungHyeon cực kỳ chi tiết. Mình đã đạt học bổng chính phủ GKS toàn phần nhờ bài luận xuất sắc!",
      badge: isEn ? "GKS Scholarship 2024" : "Học bổng GKS 2024",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-brand-bg transition-colors">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        <SectionHeading
          eyebrow={<Badge variant="tint">{isEn ? "Learner Success" : "Thành tích học viên"}</Badge>}
          title={
            isEn
              ? "Trusted by Thousands of <hl>Successful Learners</hl>"
              : "Học viên nói gì về <hl>Tiếng Hàn JungHyeon</hl>"
          }
          subtitle={
            isEn
              ? "Real stories and verified achievements from learners across Vietnam and South Korea."
              : "Những câu chuyện chinh phục tiếng Hàn thực tế từ cộng đồng hơn 14.000 học viên."
          }
        />

        <ScrollRevealGroup stagger={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {reviews.map((item, idx) => (
            <ScrollRevealItem
              key={idx}
              animation="fade-up"
              distance={24}
              className="rounded-card bg-brand-bg border border-brand-border p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="space-y-4">
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-sm text-brand-body leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-brand-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {item.avatar}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-brand-navy truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-brand-secondary font-medium truncate">
                    {item.role}
                  </p>
                  <p className="text-[10px] text-brand-primary font-semibold mt-0.5">
                    {item.badge}
                  </p>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}

export default TestimonialsBlock;
