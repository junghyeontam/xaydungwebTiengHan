"use client";

import React from "react";
import { formatPhoneVN } from "@/lib/format";

export interface PhoneProps {
  /** Raw or spaced phone string */
  phone: string;
  /** Whether to wrap in a clickable tel: link */
  clickable?: boolean;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Standard Vietnamese Phone Number formatter.
 * - Always renders in primary sans font (never monospace).
 * - Standard 4-3-3 grouping (e.g. "0988 112 233").
 * - Proportional lining digits with nowrap.
 */
export function Phone({
  phone,
  clickable = false,
  className = "",
}: PhoneProps) {
  const formatted = formatPhoneVN(phone);
  const rawTel = phone.replace(/[^\d+]/g, "");

  if (clickable) {
    return (
      <a
        data-num="true"
        href={`tel:${rawTel}`}
        className={`num hover:underline select-text ${className}`}
        title={`Gọi ${formatted}`}
      >
        {formatted}
      </a>
    );
  }

  return (
    <span
      data-num="true"
      className={`num select-text ${className}`}
    >
      {formatted}
    </span>
  );
}
export default Phone;
