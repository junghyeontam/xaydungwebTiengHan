"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/shared/ScrollReveal";
import { ArrowRight, CheckCircle2, Sparkles, BookOpen } from "lucide-react";

export function RoadmapSummaryBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  const stages = [
    {
      id: "stage-1",
      level: "1-2",
      badgeText: isEn ? "BEGINNER" : "SƠ CẤP",
      title: "Hangul & TOPIK 1 - 2",
      koreanLabel: "초급 과정",
      target: isEn
        ? "Zero-base beginners & Hangul starters"
        : "Người mới bắt đầu từ số 0",
      stats: isEn
        ? "40 letters • 1,200 vocab • 45 grammar points"
        : "40 chữ cái • 1.200 từ vựng • 45 điểm ngữ pháp",
      outcomes: isEn
        ? [
            "Read and write Hangul fluently in 3 days",
            "Daily shopping, greetings, dining & directions",
            "Confidently pass TOPIK Level 1 and 2",
          ]
        : [
            "Đọc viết chuẩn Hangul trong 3 ngày",
            "Giao tiếp mua sắm, chào hỏi, gọi món, chỉ đường",
            "Tự tin đạt chứng chỉ TOPIK cấp 1 và cấp 2",
          ],
      link: "/roadmap?tab=hangul",
    },
    {
      id: "stage-2",
      level: "3-4",
      badgeText: isEn ? "INTERMEDIATE" : "TRUNG CẤP",
      title: "TOPIK 3 - 4",
      koreanLabel: "중급 과정",
      target: isEn
        ? "Study abroad majors & Working in Korean firms"
        : "Du học chuyên ngành & Làm việc cty Hàn",
      stats: isEn
        ? "3,000 core vocab • 70 advanced patterns"
        : "3.000 từ vựng chuyên sâu • 70 cấu trúc nâng cao",
      outcomes: isEn
        ? [
            "Write cohesive essays expressing clear viewpoints",
            "Business communication, emails & official reports",
            "Eligible for university scholarship & D-2 visa",
          ]
        : [
            "Viết đoạn văn biểu đạt quan điểm mạch lạc",
            "Giao tiếp công sở, viết email và báo cáo công việc",
            "Đủ điều kiện xét học bổng và xin visa du học D2",
          ],
      link: "/roadmap?tab=topik3",
    },
    {
      id: "stage-3",
      level: "5-6",
      badgeText: isEn ? "ADVANCED" : "CAO CẤP",
      title: "TOPIK 5 - 6",
      koreanLabel: "고급 과정",
      target: isEn
        ? "Professional translation, interpretation & teaching"
        : "Biên phiên dịch & Giảng dạy tiếng Hàn",
      stats: isEn
        ? "5,500+ academic words • Idioms & Nuances"
        : "5.500+ từ học thuật • Thành ngữ & Quán dụng ngữ",
      outcomes: isEn
        ? [
            "Comprehend Korean political, economic & social media",
            "Professional simultaneous & conference interpretation",
            "Deep insight into Korean culture and mindset",
          ]
        : [
            "Đọc hiểu báo chí chính trị, kinh tế, xã hội Hàn",
            "Kỹ năng dịch cabin, dịch hội thảo chuyên nghiệp",
            "Thấu hiểu chiều sâu văn hóa và tư duy người Hàn",
          ],
      link: "/roadmap?tab=topik5",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-brand-bg transition-colors">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Heading */}
        <SectionHeading
          eyebrow={<Badge variant="tint">{isEn ? "3-Stage Curriculum" : "Lộ trình 3 giai đoạn"}</Badge>}
          title={
            isEn
              ? "Structured Roadmap from <hl>Zero to TOPIK 6</hl>"
              : "Lộ trình chuẩn hoá từ <hl>con số 0 đến TOPIK 6</hl>"
          }
          subtitle={
            isEn
              ? "Each stage includes bite-sized grammar units, native pronunciation practice, and spaced-repetition flashcards."
              : "Chia nhỏ thành từng chặng mục tiêu rõ ràng, tích hợp luyện ngữ pháp, phát âm và bộ thẻ ôn tập thông minh."
          }
        />

        {/* 3 Stage Cards with Staggered Scroll Reveal */}
        <ScrollRevealGroup stagger={0.12} delayChildren={0.05} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {stages.map((stage) => (
            <ScrollRevealItem
              key={stage.id}
              animation="fade-up"
              distance={24}
              className="rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="tint">{stage.badgeText}</Badge>
                  <span className="font-korean text-xs font-semibold text-brand-muted">
                    {stage.koreanLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-navy tracking-tight group-hover:text-brand-primary transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-brand-secondary mt-1">
                    {stage.target}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-brand-surface border border-brand-border/60 text-xs font-medium text-brand-body flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
                  <span className="num">{stage.stats}</span>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                    {isEn ? "Learning Outcomes:" : "Kết quả đạt được:"}
                  </div>
                  <ul className="space-y-2 text-xs text-brand-secondary">
                    {stage.outcomes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6">
                <Button
                  href={stage.link}
                  variant="secondary"
                  size="md"
                  pill
                  iconRight={<ArrowRight className="w-4 h-4" />}
                  className="w-full justify-center group-hover:border-brand-primary font-semibold"
                >
                  {isEn ? "View Lesson Roadmap" : "Xem danh sách bài học"}
                </Button>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>

        {/* Global CTA */}
        <ScrollReveal animation="fade-up" delay={0.2} distance={18} className="text-center pt-4">
          <Button
            href="/roadmap"
            variant="primary"
            size="lg"
            pill
            icon={<BookOpen className="w-4 h-4" />}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="shadow-sm hover:shadow-card font-bold"
          >
            {isEn ? "Explore Full Learning Roadmap" : "Khám phá toàn bộ Lộ trình học"}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default RoadmapSummaryBlock;
