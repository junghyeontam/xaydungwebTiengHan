"use client";

import React from "react";

export interface MockupFrameProps {
  title?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Universal MockupFrame component:
 * - Window-style preview frame with three colored control dots (red, yellow, green)
 * - 6-8px light-blue framing border (#BFD9F7)
 * - White inner card, radius 24px, soft shadow
 * - Used to showcase interactive learning tools & admin screens
 */
export function MockupFrame({
  title = "JungHyeon Study Room",
  badge,
  children,
  className = "",
}: MockupFrameProps) {
  return (
    <div
      className={`p-2 sm:p-2.5 rounded-[28px] bg-brand-frame/40 border border-brand-frame/70 shadow-card transition-all ${className}`}
    >
      <div className="rounded-card bg-brand-bg border border-brand-border overflow-hidden shadow-2xs">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-brand-surface border-b border-brand-border">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>

          <div className="text-[11px] font-semibold text-brand-secondary truncate max-w-[200px] text-center">
            {title}
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            {badge || (
              <span className="w-2 h-2 rounded-full bg-brand-primary/40 animate-pulse" />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-7">{children}</div>
      </div>
    </div>
  );
}

export default MockupFrame;

