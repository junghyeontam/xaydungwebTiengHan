"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

export type ScrollAnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "scale-up"
  | "blur-in";

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  amount?: number | "some" | "all";
  margin?: string;
}

const createVariants = (
  animation: ScrollAnimationType,
  distance: number,
  duration: number,
  delay: number
): Variants => {
  const ease = [0.22, 1, 0.36, 1]; // Premium fluid cubic bezier

  switch (animation) {
    case "fade-up":
      return {
        hidden: { opacity: 0, y: distance, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration, delay, ease },
        },
      };
    case "fade-down":
      return {
        hidden: { opacity: 0, y: -distance, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration, delay, ease },
        },
      };
    case "fade-left":
      return {
        hidden: { opacity: 0, x: distance, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: { duration, delay, ease },
        },
      };
    case "fade-right":
      return {
        hidden: { opacity: 0, x: -distance, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: { duration, delay, ease },
        },
      };
    case "scale-up":
      return {
        hidden: { opacity: 0, scale: 0.94, y: distance * 0.5 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration, delay, ease },
        },
      };
    case "blur-in":
      return {
        hidden: { opacity: 0, filter: "blur(10px)", scale: 0.98 },
        visible: {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          transition: { duration, delay, ease },
        },
      };
    case "fade-in":
    default:
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration, delay, ease },
        },
      };
  }
};

/**
 * Universal ScrollReveal component:
 * Triggers silky smooth entrance animations when scrolling into view.
 */
export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.55,
  distance = 24,
  className = "",
  once = true,
  amount = 0.2,
  margin = "0px 0px -50px 0px",
}: ScrollRevealProps) {
  const variants = createVariants(animation, distance, duration, delay);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface ScrollRevealGroupProps {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  className?: string;
  once?: boolean;
  amount?: number | "some" | "all";
  margin?: string;
}

/**
 * ScrollRevealGroup:
 * Container that staggers the reveal of its children when scrolled into view.
 */
export function ScrollRevealGroup({
  children,
  stagger = 0.1,
  delayChildren = 0,
  className = "",
  once = true,
  amount = 0.15,
  margin = "0px 0px -40px 0px",
}: ScrollRevealGroupProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface ScrollRevealItemProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  duration?: number;
  distance?: number;
  className?: string;
}

/**
 * ScrollRevealItem:
 * Child item designed to be placed inside ScrollRevealGroup.
 */
export function ScrollRevealItem({
  children,
  animation = "fade-up",
  duration = 0.5,
  distance = 24,
  className = "",
}: ScrollRevealItemProps) {
  const variants = createVariants(animation, distance, duration, 0);

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

export interface ScrollRevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  highlightText?: string | string[];
  highlightClassName?: string;
  once?: boolean;
}

/**
 * ScrollRevealText:
 * Gradually reveals words in a string one by one with a soft blur-to-clear upward glide.
 */
export function ScrollRevealText({
  text,
  className = "",
  delay = 0,
  stagger = 0.035,
  highlightText,
  highlightClassName = "text-brand-primary",
  once = true,
}: ScrollRevealTextProps) {
  const words = text.split(/\s+/).filter(Boolean);
  const highlights = Array.isArray(highlightText)
    ? highlightText
    : highlightText
    ? [highlightText]
    : [];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(4px)",
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

  const isHighlighted = (word: string) => {
    const clean = word.toLowerCase().replace(/[^a-z0-9Ã Ã¡áº¡áº£Ã£Ã¢áº§áº¥áº­áº©áº«Äƒáº±áº¯áº·áº³áºµÃ¨Ã©áº¹áº»áº½Ãªá»áº¿á»‡á»ƒá»…Ã¬Ã­á»‹á»‰Ä©Ã²Ã³á»á»ÃµÃ´á»“á»‘á»™á»•á»—Æ¡á»á»›á»£á»Ÿá»¡Ã¹Ãºá»¥á»§Å©Æ°á»«á»©á»±á»­á»¯á»³Ã½á»µá»·á»¹Ä‘]/g, "");
    return highlights.some((hl) => {
      const hlClean = hl.toLowerCase().replace(/[^a-z0-9Ã Ã¡áº¡áº£Ã£Ã¢áº§áº¥áº­áº©áº«Äƒáº±áº¯áº·áº³áºµÃ¨Ã©áº¹áº»áº½Ãªá»áº¿á»‡á»ƒá»…Ã¬Ã­á»‹á»‰Ä©Ã²Ã³á»á»ÃµÃ´á»“á»‘á»™á»•á»—Æ¡á»á»›á»£á»Ÿá»¡Ã¹Ãºá»¥á»§Å©Æ°á»«á»©á»±á»­á»¯á»³Ã½á»µá»·á»¹Ä‘]/g, "");
      return hlClean && clean.includes(hlClean);
    });
  };

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: "0px 0px -40px 0px" }}
      variants={containerVariants}
      className={`inline-block ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          className={`inline-block mr-[0.26em] last:mr-0 ${
            isHighlighted(word) ? highlightClassName : ""
          }`}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

