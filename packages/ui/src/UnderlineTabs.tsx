"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ProBadge } from "./ProBadge";

export interface TabItem {
  id: string;
  label: string;
  isPro?: boolean;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface UnderlineTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  layoutId?: string;
  className?: string;
}

/**
 * Universal UnderlineTabs component:
 * - Clean horizontal tabs with hairline bottom border
 * - Active tab = bold navy text + 2px primary underline sliding with Framer Motion
 * - Supports keyboard navigation (ArrowLeft, ArrowRight, Home, End)
 * - Accessible ARIA roles & screen reader support
 */
export function UnderlineTabs({
  tabs,
  activeTab,
  onChange,
  layoutId = "activeTabUnderline",
  className = "",
}: UnderlineTabsProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onChange(tabs[nextIndex].id);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Content Tabs"
      className={`relative flex items-center gap-1 sm:gap-2 border-b border-brand-border overflow-x-auto scrollbar-none py-1 min-w-0 max-w-full justify-start md:justify-center ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabsRef.current[idx] = el;
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-150 rounded-t-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 ${
              isActive
                ? "text-brand-navy font-bold"
                : "text-brand-secondary hover:text-brand-navy hover:bg-brand-surface/60"
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.isPro && <ProBadge size="sm" variant="pill" />}
            {tab.badge && !tab.isPro && (
              <span className="shrink-0">{tab.badge}</span>
            )}

            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default UnderlineTabs;

