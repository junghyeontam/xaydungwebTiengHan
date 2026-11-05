"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nContext";
import { BRAND_CONFIG } from "@/config/brand";
import { MascotHoney } from "@/components/shared/MascotHoney";
import { Button } from "@/components/shared/Button";
import { StatBand } from "@/components/shared/StatBand";
import { ScrollHintButton } from "@/components/shared/ScrollHintButton";
import { playKoreanSpeech } from "@/lib/utils/speech";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Languages,
  CheckCircle2,
  GraduationCap,
  Trophy,
  Volume2,
} from "lucide-react";

export function HeroSection() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handleSpeak = (koreanText: string) => {
    setPlayingWord(koreanText);
    playKoreanSpeech(koreanText, 0.85);
    setTimeout(() => setPlayingWord(null), 1200);
  };

  return (
    <section className="relative pt-6 sm:pt-8 pb-14 sm:pb-20 bg-brand-bg transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Large Rounded Tint Hero Container matching Prep reference */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-[#EEF5FF] dark:bg-[#111F36] border border-[#D5E5FA] dark:border-[#1E3252] p-8 sm:p-12 lg:p-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border text-brand-primary text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <span>{t("hero.badge")}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-brand-navy tracking-tight leading-[1.15]">
                {t("hero.titleMain")}{" "}
                <span className="text-brand-primary">
                  {t("hero.titleAccent")}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-brand-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t("hero.subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  href="/roadmap"
                  variant="primary"
                  size="lg"
                  pill
                  iconRight={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-sm hover:shadow-card font-bold"
                >
                  {t("hero.ctaStart")}
                </Button>

                <Button
                  href="/consultation#test"
                  variant="secondary"
                  size="lg"
                  pill
                  icon={<Sparkles className="w-4 h-4 text-brand-gold" />}
                  className="w-full sm:w-auto bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border hover:bg-brand-surface font-semibold"
                >
                  {t("hero.ctaPlacement")}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-brand-secondary font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span>{t("hero.featureFree")}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span>{t("hero.featureNoCard")}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                  <span>{t("hero.featureStandard")}</span>
                </span>
              </div>
            </motion.div>

            {/* Right Column: Interactive Mascot Honey & Audio Tags */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative flex items-center justify-center py-4"
            >
              <div className="relative w-72 h-72 sm:w-84 sm:h-84 lg:w-92 lg:h-92 rounded-full bg-gradient-to-tr from-amber-100/80 via-white/80 to-blue-100/80 dark:from-amber-950/30 dark:via-brand-surface dark:to-blue-950/30 flex items-center justify-center p-6 border border-white/60 dark:border-white/10 shadow-card">
                <div className="animate-float-slow">
                  <MascotHoney mood="celebrate" size={200} />
                </div>

                {/* Floating Interactive Sound Card: 안녕! */}
                <button
                  type="button"
                  onClick={() => handleSpeak("안녕하세요")}
                  title="Bấm để nghe phát âm: 안녕!"
                  className={`absolute -top-2 -left-2 sm:-left-4 px-3.5 py-2 rounded-2xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border shadow-card flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-left ${
                    playingWord === "안녕하세요" ? "ring-2 ring-brand-primary" : ""
                  }`}
                >
                  <span className="text-base">👋</span>
                  <div>
                    <div className="font-korean font-bold text-xs text-brand-navy flex items-center gap-1">
                      <span>안녕!</span>
                      <Volume2 className="w-3 h-3 text-brand-primary" />
                    </div>
                    <div className="text-[10px] text-brand-muted">annyeong • Xin chào</div>
                  </div>
                </button>

                {/* Floating Sound Card: 사랑 */}
                <button
                  type="button"
                  onClick={() => handleSpeak("사랑해요")}
                  title="Bấm để nghe phát âm: 사랑"
                  className={`absolute top-1/4 -right-2 sm:-right-4 px-3.5 py-2 rounded-2xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border shadow-card flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-left ${
                    playingWord === "사랑해요" ? "ring-2 ring-brand-coral" : ""
                  }`}
                >
                  <span className="text-base">💖</span>
                  <div>
                    <div className="font-korean font-bold text-xs text-brand-coral flex items-center gap-1">
                      <span>사랑</span>
                      <Volume2 className="w-3 h-3 text-brand-coral" />
                    </div>
                    <div className="text-[10px] text-brand-muted">sarang • Tình yêu</div>
                  </div>
                </button>

                {/* Floating Sound Card: 감사합니다 */}
                <button
                  type="button"
                  onClick={() => handleSpeak("감사합니다")}
                  title="Bấm để nghe phát âm: 감사합니다"
                  className={`absolute -bottom-3 left-4 px-3.5 py-2 rounded-2xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border shadow-card flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-left ${
                    playingWord === "감사합니다" ? "ring-2 ring-brand-primary" : ""
                  }`}
                >
                  <span className="text-base">✨</span>
                  <div>
                    <div className="font-korean font-bold text-xs text-brand-primary flex items-center gap-1">
                      <span>감사합니다</span>
                      <Volume2 className="w-3 h-3 text-brand-primary" />
                    </div>
                    <div className="text-[10px] text-brand-muted">gamsahamnida • Cảm ơn</div>
                  </div>
                </button>

                {/* Floating Badge: 화이팅 */}
                <button
                  type="button"
                  onClick={() => handleSpeak("화이팅")}
                  title="Bấm để nghe phát âm: 화이팅!"
                  className={`absolute bottom-8 -right-2 px-3.5 py-1.5 rounded-full bg-brand-gold-tint border border-brand-gold/40 shadow-xs flex items-center gap-1 hover:scale-105 transition-transform ${
                    playingWord === "화이팅" ? "ring-2 ring-brand-gold" : ""
                  }`}
                >
                  <span className="text-xs">🔥</span>
                  <span className="font-korean font-bold text-xs text-amber-800 dark:text-yellow-400">
                    화이팅!
                  </span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Scroll Hint Button neatly anchored at bottom center of the hero box */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20">
            <ScrollHintButton targetId="stat-band-section" />
          </div>
        </div>

        {/* StatBand Highlights immediately below */}
        <div id="stat-band-section" className="mt-14 sm:mt-18">
          <StatBand
            stats={[
              {
                value: 120,
                suffix: "+",
                label: t("hero.statsGrammar") || "Bài học Ngữ pháp",
                sublabel: isEn ? "From A1 to C2 standard" : "Lộ trình ngữ pháp trọng tâm",
                icon: <BookOpen className="w-5 h-5" />,
              },
              {
                value: 4500,
                suffix: "+",
                label: t("hero.statsVocab") || "Từ vựng cốt lõi",
                sublabel: isEn ? "Native voice recordings" : "Phát âm chuẩn kèm Flashcard",
                icon: <Languages className="w-5 h-5" />,
              },
              {
                value: 40,
                suffix: "",
                label: t("hero.statsHangul") || "Chữ cái Hangul",
                sublabel: isEn ? "Master in 3 days" : "Thành thạo trong 3 ngày",
                icon: <GraduationCap className="w-5 h-5" />,
              },
              {
                value: 6,
                prefix: "1 - ",
                label: t("hero.statsTopik") || "Cấp độ TOPIK",
                sublabel: isEn ? "Target TOPIK 6 pass" : "Cam kết đạt mục tiêu thi cử",
                icon: <Trophy className="w-5 h-5" />,
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
