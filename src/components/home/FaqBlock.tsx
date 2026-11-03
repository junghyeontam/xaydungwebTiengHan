"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/shared/Badge";
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/shared/ScrollReveal";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: t("faq.q1") || (isEn ? "Can I learn if I'm starting completely from scratch?" : "Người mới bắt đầu từ số 0 có học được không?"),
      a: t("faq.a1") || (isEn ? "Yes! The roadmap starts with step-by-step Hangul alphabet mastery designed to be completed in 3 days with audio and native mouth shape guides." : "Hoàn toàn được! Lộ trình JungHyeon được thiết kế chuyên biệt cho người bắt đầu từ số 0, bắt đầu từ bài học bảng chữ cái Hangul chuẩn Viện Ngôn ngữ Seoul giúp bạn đọc viết thành thạo trong 3 ngày."),
    },
    {
      q: t("faq.q2") || (isEn ? "What makes the JungHyeon methodology unique?" : "Phương pháp của JungHyeon có gì khác biệt so với các trung tâm khác?"),
      a: t("faq.a2") || (isEn ? "We integrate Spaced Repetition (SRS) algorithms with real-time AI pronunciation analysis, allowing you to memorize vocabulary permanently without cramming." : "JungHyeon ứng dụng thuật toán lặp lại ngắt quãng Spaced Repetition (SRS) kết hợp cùng công nghệ AI phân tích sóng âm giọng nói, giúp học viên nhớ từ vựng vĩnh viễn và sửa ngữ điệu chuẩn người bản xứ."),
    },
    {
      q: t("faq.q3") || (isEn ? "How long does it take to reach TOPIK 3 - 4?" : "Mất bao lâu để đạt chứng chỉ TOPIK 3 - 4?"),
      a: t("faq.a3") || (isEn ? "With 30-45 minutes of daily practice following our structured curriculum, most learners achieve TOPIK 3 in 4-6 months." : "Nếu duy trì học đều đặn 30 - 45 phút mỗi ngày theo đúng lộ trình, học viên thường đạt TOPIK 3 trong khoảng 4 đến 6 tháng."),
    },
    {
      q: t("faq.q4") || (isEn ? "Does the Lifetime VIP plan include future lesson updates?" : "Gói VIP trọn đời có được cập nhật bài học mới trong tương lai không?"),
      a: t("faq.a4") || (isEn ? "Yes, Lifetime VIP members receive all current and future lessons, exam updates, and feature upgrades at no additional cost." : "Có, hội viên VIP trọn đời được truy cập vĩnh viễn tất cả bài giảng hiện tại và các bộ đề thi thử, tính năng AI mới được cập nhật liên tục mà không phải trả thêm bất kỳ chi phí nào."),
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 sm:py-24 bg-brand-surface/40 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <SectionHeading
            eyebrow={<Badge variant="tint">{isEn ? "Help & Questions" : "Hỏi đáp thường gặp"}</Badge>}
            title={
              isEn
                ? "Frequently Asked <hl>Questions</hl>"
                : "Giải đáp thắc mắc <hl>thường gặp</hl>"
            }
            subtitle={
              isEn
                ? "Everything you need to know about our courses, VIP membership, and study methodology."
                : "Mọi thông tin bạn cần biết về lộ trình học, gói hội viên và phương pháp giảng dạy."
            }
          />

          <ScrollRevealGroup stagger={0.08} className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <ScrollRevealItem
                  key={idx}
                  animation="fade-up"
                  distance={16}
                  className="rounded-card border border-brand-border bg-brand-bg shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-brand-navy hover:text-brand-primary transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-muted transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-brand-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-brand-secondary leading-relaxed border-t border-brand-border/60 pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </ScrollRevealItem>
              );
            })}
          </ScrollRevealGroup>
        </div>
      </div>
    </section>
  );
}

export default FaqBlock;
