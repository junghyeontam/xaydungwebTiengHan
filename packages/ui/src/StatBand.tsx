"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { formatNumber } from "@junghyeon/features";
import { useI18n } from "@junghyeon/i18n";

export interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface StatBandProps {
  stats: StatItem[];
  className?: string;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  locale,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  locale: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const startTime = performance.now();
          const duration = 1200; // 1.2s smooth animation

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(easeOut * value);
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={elementRef} className="num inline-flex items-baseline font-bold tracking-tight">
      {prefix && <span className="mr-0.5 text-brand-primary">{prefix}</span>}
      <span>{formatNumber(displayValue, locale)}</span>
      {suffix && <span className="ml-0.5 text-brand-primary">{suffix}</span>}
    </span>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Universal StatBand component:
 * - 4 clean white cards in a responsive grid
 * - Smooth scroll reveal with stagger
 * - Pure lining numbers formatted with formatNumber
 */
export function StatBand({ stats, className = "" }: StatBandProps) {
  const { locale } = useI18n();

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 p-5 sm:p-6 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3.5 mb-3">
              {stat.icon && (
                <div className="w-11 h-11 rounded-xl bg-[#EEF5FF] dark:bg-[#15253F] text-brand-primary flex items-center justify-center shrink-0 shadow-2xs">
                  {stat.icon}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy leading-none tracking-tight">
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    locale={locale}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold text-brand-secondary line-clamp-1">
                {stat.label}
              </p>
              {stat.sublabel && (
                <span className="text-[11px] text-brand-muted line-clamp-1 mt-0.5">
                  {stat.sublabel}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default StatBand;

