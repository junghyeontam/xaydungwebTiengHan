"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ProBadge } from "./ProBadge";
import { Button } from "./Button";

export interface FeatureBullet {
  title: string;
  description?: string;
  isPro?: boolean;
}

export interface FeaturePanelProps {
  eyebrow?: React.ReactNode;
  isPro?: boolean;
  proLabel?: string;
  title: string;
  description?: string;
  bullets?: (string | FeatureBullet)[];
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  variant?: "tint" | "subtle" | "white";
  className?: string;
}

/**
 * Universal FeaturePanel / FeatureCard component:
 * - Tint panel background (#E8F1FC) or subtle surface (#F7F9FC)
 * - Radius 24px, padding 32px (p-6 sm:p-8)
 * - Gold "PRO" eyebrow with crown icon
 * - Bullet list with clean check icons
 * - Optional CTA button
 */
export function FeaturePanel({
  eyebrow,
  isPro = false,
  proLabel = "PRO Feature",
  title,
  description,
  bullets = [],
  ctaText,
  ctaHref,
  onCtaClick,
  variant = "tint",
  className = "",
}: FeaturePanelProps) {
  const bgClasses = {
    tint: "bg-brand-tint border-brand-frame/70",
    subtle: "bg-brand-surface border-brand-border",
    white: "bg-brand-bg border-brand-border shadow-xs",
  }[variant];

  return (
    <div
      className={`rounded-card border p-6 sm:p-8 flex flex-col justify-between space-y-6 ${bgClasses} ${className}`}
    >
      <div className="space-y-4">
        {/* Eyebrow or Pro Badge */}
        {(eyebrow || isPro) && (
          <div className="flex items-center gap-2">
            {isPro && <ProBadge size="sm" variant="pill" label={proLabel} />}
            {eyebrow && <span className="text-xs font-semibold text-brand-secondary">{eyebrow}</span>}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-brand-navy tracking-tight leading-snug">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-brand-secondary leading-relaxed">
            {description}
          </p>
        )}

        {/* Bullet List */}
        {bullets.length > 0 && (
          <ul className="space-y-3 pt-2">
            {bullets.map((bullet, idx) => {
              const isString = typeof bullet === "string";
              const itemTitle = isString ? bullet : bullet.title;
              const itemDesc = isString ? null : bullet.description;
              const itemIsPro = isString ? false : bullet.isPro;

              return (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-medium text-brand-body">
                      <span>{itemTitle}</span>
                      {itemIsPro && <ProBadge size="sm" variant="pill" />}
                    </div>
                    {itemDesc && (
                      <p className="text-xs text-brand-muted leading-relaxed">
                        {itemDesc}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* CTA Button */}
      {ctaText && (
        <div className="pt-2">
          {ctaHref ? (
            <Button
              href={ctaHref}
              variant="primary"
              size="md"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              {ctaText}
            </Button>
          ) : (
            <Button
              onClick={onCtaClick}
              variant="primary"
              size="md"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              {ctaText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default FeaturePanel;

