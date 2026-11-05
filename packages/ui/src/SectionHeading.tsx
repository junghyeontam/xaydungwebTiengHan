"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

export interface SectionHeadingProps {
  /**
   * Title text or React node.
   * If a string is provided, `<hl>word</hl>` or `<highlight>word</highlight>`
   * will be replaced with primary blue highlighted text.
   */
  title: string | React.ReactNode;
  /** Optional subtitle or description */
  subtitle?: React.ReactNode;
  /** Optional top eyebrow badge or tag */
  eyebrow?: React.ReactNode;
  /** Alignment: default centered */
  align?: "center" | "left";
  className?: string;
  /** Enable buttery smooth scroll reveal animation (default true) */
  animate?: boolean;
}

interface WordToken {
  text: string;
  isHighlight: boolean;
}

const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.06,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(5px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Universal SectionHeading component:
 * - Pure navy #1B2A6B heading
 * - Primary blue #2347B5 keyword highlights
 * - Max width 720px, airy typography (40-48px desktop, 28-32px mobile)
 * - Buttery-smooth word-by-word scroll reveal animation
 */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className = "",
  animate = true,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  // If animations are disabled, render classic static markup
  if (!animate) {
    const renderStaticTitle = () => {
      if (typeof title !== "string") return title;
      const parts = title.split(/(<hl>.*?<\/hl>|<highlight>.*?<\/highlight>)/g);
      return parts.map((part, index) => {
        const match = part.match(/^<(?:hl|highlight)>(.*?)<\/(?:hl|highlight)>$/);
        if (match) {
          return (
            <span key={index} className="text-brand-primary">
              {match[1]}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      });
    };

    return (
      <div className={`max-w-[720px] ${alignClass} ${className}`}>
        {eyebrow && <div className="mb-3.5 inline-block">{eyebrow}</div>}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-extrabold text-brand-navy tracking-tight leading-[1.2]">
          {renderStaticTitle()}
        </h2>
        {subtitle && (
          <p className="mt-3.5 text-sm sm:text-base text-brand-secondary leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  // Parse words and highlights
  const tokens: WordToken[] = [];
  let isStringTitle = typeof title === "string";

  if (isStringTitle && typeof title === "string") {
    const parts = title.split(/(<hl>.*?<\/hl>|<highlight>.*?<\/highlight>)/g);
    parts.forEach((part) => {
      if (!part) return;
      const match = part.match(/^<(?:hl|highlight)>(.*?)<\/(?:hl|highlight)>$/);
      if (match) {
        const words = match[1].split(/\s+/).filter(Boolean);
        words.forEach((w) => tokens.push({ text: w, isHighlight: true }));
      } else {
        const words = part.split(/\s+/).filter(Boolean);
        words.forEach((w) => tokens.push({ text: w, isHighlight: false }));
      }
    });
  }

  const subtitleDelay = Math.min(tokens.length * 0.035 + 0.12, 0.45);

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        delay: subtitleDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -50px 0px" }}
      className={`max-w-[720px] ${alignClass} ${className}`}
    >
      {/* Eyebrow badge */}
      {eyebrow && (
        <motion.div variants={eyebrowVariants} className="mb-3.5 inline-block">
          {eyebrow}
        </motion.div>
      )}

      {/* Headline */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-extrabold text-brand-navy tracking-tight leading-[1.2]">
        {isStringTitle ? (
          <motion.span variants={titleContainerVariants} className="inline-block">
            {tokens.map((token, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className={`inline-block mr-[0.25em] last:mr-0 ${
                  token.isHighlight ? "text-brand-primary" : ""
                }`}
              >
                {token.text}
              </motion.span>
            ))}
          </motion.span>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {title}
          </motion.div>
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={subtitleVariants}
          className="mt-3.5 text-sm sm:text-base text-brand-secondary leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export default SectionHeading;

