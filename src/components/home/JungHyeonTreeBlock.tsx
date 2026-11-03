"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Num, Percent } from "@/components/shared";
import { Card } from "@/components/shared/Card";
import { Chip } from "@/components/shared/Chip";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import {
  Sparkles,
  Droplets,
  Award,
  Check,
  Lock,
  Leaf,
  Info,
} from "lucide-react";

interface StageInfo {
  id: number;
  nameVi: string;
  nameEn: string;
  minXp: number;
  maxXp: number;
  icon: string;
  badge: string;
  badgeEn: string;
  descriptionVi: string;
  descriptionEn: string;
}

const TREE_STAGES: StageInfo[] = [
  {
    id: 1,
    nameVi: "Hạt giống hiếu học",
    nameEn: "Eager Seed",
    minXp: 0,
    maxXp: 150,
    icon: "🌱",
    badge: "Hạt giống",
    badgeEn: "Seed",
    descriptionVi: "Bạn vừa gieo những mầm tri thức đầu tiên vào vùng đất tiếng Hàn.",
    descriptionEn: "You just sowed your first seeds in the Korean knowledge garden.",
  },
  {
    id: 2,
    nameVi: "Mầm non vươn chồi",
    nameEn: "Fresh Sprout",
    minXp: 150,
    maxXp: 400,
    icon: "🌿",
    badge: "Mầm non",
    badgeEn: "Sprout",
    descriptionVi: "Đã quen mặt chữ Hangul, mầm xanh đang vươn mình đón ánh nắng.",
    descriptionEn: "Familiar with Hangul, the young green sprout stretches toward sunlight.",
  },
  {
    id: 3,
    nameVi: "Cây con xanh tươi",
    nameEn: "Green Sapling",
    minXp: 400,
    maxXp: 800,
    icon: "🪴",
    badge: "Cây con",
    badgeEn: "Sapling",
    descriptionVi: "Rễ đã bám chắc vào ngữ pháp cơ bản, cành lá sum suê từ vựng.",
    descriptionEn: "Roots firmly grounded in basic grammar, branches thriving with vocabulary.",
  },
  {
    id: 4,
    nameVi: "Cây đại thụ vững chãi",
    nameEn: "Mighty Tree",
    minXp: 800,
    maxXp: 1500,
    icon: "🌳",
    badge: "Đại thụ",
    badgeEn: "Mighty Tree",
    descriptionVi: "Tự tin giao tiếp và tư duy bằng tiếng Hàn, vươn tầm TOPIK trung cấp.",
    descriptionEn: "Confident conversation and intermediate TOPIK fluency achieved.",
  },
  {
    id: 5,
    nameVi: "Hoa Mugunghwa rực rỡ",
    nameEn: "Blooming Mugunghwa",
    minXp: 1500,
    maxXp: 3000,
    icon: "🌺",
    badge: "Quốc hoa nở rộ",
    badgeEn: "Mugunghwa Bloom",
    descriptionVi: "Đỉnh cao thông thạo tiếng Hàn TOPIK 5-6, đoá hoa kiên định toả hương.",
    descriptionEn: "Top proficiency TOPIK 5-6 reached, the national blossom blooms in glory.",
  },
];

export function JungHyeonTreeBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  // Điểm XP mặc định giả lập
  const [currentXp, setCurrentXp] = useState(485);
  const [isWatering, setIsWatering] = useState(false);

  // Xác định giai đoạn cây hiện tại
  const currentStageIndex = TREE_STAGES.findIndex(
    (s) => currentXp >= s.minXp && currentXp < s.maxXp
  );
  const activeStage =
    currentStageIndex !== -1 ? TREE_STAGES[currentStageIndex] : TREE_STAGES[TREE_STAGES.length - 1];

  // Tính phần trăm tiến độ giai đoạn hiện tại
  const xpInCurrentStage = currentXp - activeStage.minXp;
  const stageRange = activeStage.maxXp - activeStage.minXp;
  const stagePercentage = Math.min(100, Math.round((xpInCurrentStage / stageRange) * 100));
  const xpRemaining = Math.max(0, activeStage.maxXp - currentXp);

  // Hàm tương tác thử nghiệm tưới nước (+35 XP)
  const handleWaterTree = () => {
    setIsWatering(true);
    const newXp = currentXp + 35;
    setCurrentXp(newXp);

    // Kích hoạt pháo hoa confetti khi thăng cấp (respects prefers-reduced-motion)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery.matches) {
      if (newXp >= activeStage.maxXp && currentStageIndex < TREE_STAGES.length - 1) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3DBBA8", "#F5B93A", "#E8604C"],
        });
      }
    }

    setTimeout(() => {
      setIsWatering(false);
    }, 600);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 my-12 sm:my-16">
      {/* Outer panel: Surface fill #F7F9FC, NO thick black borders */}
      <div className="rounded-panel bg-brand-surface p-6 sm:p-10 relative overflow-hidden shadow-xs">
        {/* Soft background ambient gradient decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-growth/50 via-brand-tint/30 to-transparent rounded-full pointer-events-none" />

        {/* 1. Header: Eyebrow pill, navy title, secondary subtitle & Tint XP summary */}
        <ScrollReveal animation="fade-up" distance={20} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="mb-2.5">
              <Chip variant="growth" size="sm" icon={<Leaf className="w-3.5 h-3.5" />}>
                {t("tree.badge")}
              </Chip>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight flex items-center gap-3">
              <span>{t("tree.title")}</span>
              <span className="text-2xl select-none">{activeStage.icon}</span>
            </h2>
            <p className="text-sm text-brand-secondary mt-1.5 max-w-xl leading-relaxed">
              {t("tree.subtitle")}
            </p>
          </div>

          {/* XP Summary: Tint card with NO border, gold star circle, large number + muted XP */}
          <div className="flex items-center gap-3.5 bg-brand-tint/70 px-4 py-2.5 rounded-card shrink-0 self-start md:self-auto shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#FEF5E7] dark:bg-[#F5B93A]/20 text-[#D97706] dark:text-[#FAC44F] flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[11px] text-brand-secondary font-medium">
                {t("tree.totalXp")}
              </div>
              <div className="text-xl font-bold text-brand-navy flex items-baseline">
                <Num value={currentXp} />
                <span className="text-xs font-semibold text-brand-muted ml-1.5">
                  XP
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2. Main Content Grid: Left Tree Panel + Right Evolution Columns */}
        <ScrollReveal animation="fade-up" delay={0.15} distance={24} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Filled Surface Card (No border, soft tint circle, navy pill, primary water button) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-card bg-brand-bg text-center relative shadow-xs">
            {/* Water animation feedback */}
            {isWatering && (
              <div className="absolute top-6 text-blue-400 animate-bounce text-2xl select-none">
                💧 💧 💧
              </div>
            )}

            {/* Tree Stage Mascot Circle: Soft tint circle, NO dashed black lines */}
            <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-brand-growth/40 flex flex-col items-center justify-center relative shadow-xs mb-5 group">
              <span className="text-6xl sm:text-7xl select-none transition-transform group-hover:scale-110 duration-300">
                {activeStage.icon}
              </span>
              {/* Level label: Dark-navy pill overlapping bottom of circle */}
              <span className="absolute -bottom-3 px-3.5 py-1 rounded-pill bg-brand-navy text-white text-[11px] font-bold shadow-xs whitespace-nowrap">
                {isEn ? `Level ${activeStage.id}: ${activeStage.badgeEn}` : `Cấp ${activeStage.id}: ${activeStage.badge}`}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-brand-navy mt-1">
              {locale === "vi" ? activeStage.nameVi : activeStage.nameEn}
            </h3>
            <p className="text-xs text-brand-secondary mt-1.5 max-w-xs leading-relaxed">
              {locale === "vi" ? activeStage.descriptionVi : activeStage.descriptionEn}
            </p>

            {/* Action Button: Primary pill with water drop icon */}
            <div className="mt-5">
              <Button
                variant="primary"
                pill
                size="md"
                onClick={handleWaterTree}
                disabled={isWatering}
                loading={isWatering}
                icon={<Droplets className="w-4 h-4 fill-current" />}
              >
                <span>{t("tree.waterButton")}</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Progress Card, 5 Evolution Levels, Ways to Earn XP */}
          <div className="lg:col-span-7 space-y-5">
            {/* A. Progress Card (Surface fill #FFFFFF, NO border) */}
            <div className="p-5 rounded-card bg-brand-bg shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-brand-navy">
                    {isEn ? "Current Stage Progress" : "Tiến độ giai đoạn hiện tại"}
                  </span>
                  <Chip variant="tint" size="xs">
                    <Percent value={stagePercentage} isDecimal={false} />
                  </Chip>
                </div>

                {/* Right-aligned coral CTA note */}
                <span className="text-brand-coral font-bold text-xs flex items-center gap-1">
                  <span>{isEn ? "Remaining" : "Còn"}</span>
                  <Num value={xpRemaining} />
                  <span>{t("tree.xpRemaining")}</span>
                </span>
              </div>

              {/* 10px Rounded Progress Bar in teal-to-green gradient */}
              <ProgressBar value={stagePercentage} height="md" variant="teal" />
            </div>

            {/* B. 5 Cấp độ tiến hoá (Equal Grid, Snap on mobile) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                  {t("tree.evolutionLevels")}
                </p>
                <span className="text-[10px] text-brand-muted sm:hidden">
                  Vuốt ngang để xem →
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-1 sm:pb-0">
                {TREE_STAGES.map((stage) => {
                  const isCurrent = stage.id === activeStage.id;
                  const isPassed = currentXp >= stage.maxXp;

                  return (
                    <Card
                      key={stage.id}
                      variant={isCurrent ? "selected" : isPassed ? "surface" : "locked"}
                      padding="sm"
                      className="text-center snap-center min-w-[100px] sm:min-w-0 flex flex-col items-center justify-center transition-all"
                    >
                      <div className="text-2xl mb-1 select-none relative">
                        {stage.icon}
                        {isPassed && (
                          <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-brand-success text-white flex items-center justify-center text-[9px] shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                        {!isCurrent && !isPassed && (
                          <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-brand-surface text-brand-muted flex items-center justify-center text-[9px]">
                            <Lock className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-brand-navy truncate w-full">
                        {isEn ? stage.badgeEn : stage.badge}
                      </div>
                      <div className="text-[10px] text-brand-secondary mt-0.5 num-tabular font-medium">
                        {stage.minXp}-{stage.maxXp} XP
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* C. Cách tích lũy XP (Surface fill, info icon, gold chips, responsive grid) */}
            <div className="p-4 rounded-card bg-brand-bg shadow-xs space-y-2.5">
              <div className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-brand-primary" />
                <span>{t("tree.howItWorks")}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-brand-secondary">
                <div className="flex items-center justify-between p-2 rounded-control bg-brand-surface/70">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F9D6B] shrink-0" />
                    <span className="truncate">{t("tree.rule1")}</span>
                  </div>
                  <Chip variant="gold" size="xs">+20 XP</Chip>
                </div>

                <div className="flex items-center justify-between p-2 rounded-control bg-brand-surface/70">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B93A] shrink-0" />
                    <span className="truncate">{t("tree.rule2")}</span>
                  </div>
                  <Chip variant="gold" size="xs">+15 XP</Chip>
                </div>

                <div className="flex items-center justify-between p-2 rounded-control bg-brand-surface/70">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8604C] shrink-0" />
                    <span className="truncate">{t("tree.rule3")}</span>
                  </div>
                  <Chip variant="gold" size="xs">+30 XP</Chip>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default JungHyeonTreeBlock;
