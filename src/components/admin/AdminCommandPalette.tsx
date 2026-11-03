"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  BookOpen,
  Languages,
  Milestone,
  Send,
  Users,
  PhoneCall,
  ShoppingBag,
  Megaphone,
  Tag,
  ShieldCheck,
  History,
  Sliders,
  Palette,
  ArrowRight,
  Plus,
  X,
  CornerDownLeft,
} from "lucide-react";

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Quick Actions" | "Segments";
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  badge?: string;
  badgeColor?: string;
}

export function AdminCommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: PaletteItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-overview",
        title: "Overview Dashboard",
        subtitle: "Key metrics, revenue curves, and operations",
        category: "Navigation",
        icon: LayoutDashboard,
        href: "/admin",
      },
      {
        id: "nav-lessons",
        title: "Lessons Library",
        subtitle: "Curriculum content, theory blocks, and exercises",
        category: "Navigation",
        icon: BookOpen,
        href: "/admin/content/lessons",
      },
      {
        id: "nav-vocab",
        title: "Vocabulary Bank",
        subtitle: "Manage flashcards, audio clips, and Korean terms",
        category: "Navigation",
        icon: Languages,
        href: "/admin/content/vocabulary",
      },
      {
        id: "nav-roadmap",
        title: "TOPIK Roadmap Nodes",
        subtitle: "Organize nodes from Hangul to TOPIK 6",
        category: "Navigation",
        icon: Milestone,
        href: "/admin/content/roadmap",
      },
      {
        id: "nav-publishing",
        title: "Publishing & Review Inbox",
        subtitle: "Review drafts, schedule release, and rollbacks",
        category: "Navigation",
        icon: Send,
        href: "/admin/publishing",
        badge: "Workflow",
      },
      {
        id: "nav-learners",
        title: "Learners & Profiles",
        subtitle: "Track learner progress, XP, and study streaks",
        category: "Navigation",
        icon: Users,
        href: "/admin/learners",
      },
      {
        id: "nav-leads",
        title: "Consultation Leads",
        subtitle: "Review booking requests and contact status",
        category: "Navigation",
        icon: PhoneCall,
        href: "/admin/sales/leads",
        badge: "CRM",
      },
      {
        id: "nav-orders",
        title: "Orders & VIP Packages",
        subtitle: "Track payments, subscriptions, and revenue",
        category: "Navigation",
        icon: ShoppingBag,
        href: "/admin/sales/orders",
      },
      {
        id: "nav-banners",
        title: "Announcement Banners",
        subtitle: "Configure top bar promos and notifications",
        category: "Navigation",
        icon: Megaphone,
        href: "/admin/marketing/banners",
      },
      {
        id: "nav-coupons",
        title: "Discount Coupons",
        subtitle: "Create promo codes and track redemptions",
        category: "Navigation",
        icon: Tag,
        href: "/admin/marketing/coupons",
      },
      {
        id: "nav-staff",
        title: "Staff & RBAC Roles",
        subtitle: "Manage team permissions and access levels",
        category: "Navigation",
        icon: ShieldCheck,
        href: "/admin/settings/staff",
      },
      {
        id: "nav-audit",
        title: "System Audit Logs",
        subtitle: "Immutable audit trail of admin actions",
        category: "Navigation",
        icon: History,
        href: "/admin/audit-logs",
      },
      {
        id: "nav-settings",
        title: "System Settings",
        subtitle: "Maintenance mode, API credentials, and brand info",
        category: "Navigation",
        icon: Sliders,
        href: "/admin/settings",
      },
      {
        id: "nav-design",
        title: "Living UI Style Guide",
        subtitle: "Preview all design tokens, components, and charts",
        category: "Navigation",
        icon: Palette,
        href: "/admin/_design",
        badge: "Dev",
      },
      // Quick Actions
      {
        id: "action-new-lesson",
        title: "Create new lesson draft",
        subtitle: "Open lesson editor canvas",
        category: "Quick Actions",
        icon: Plus,
        href: "/admin/content/lessons/new",
      },
      {
        id: "action-new-coupon",
        title: "Create discount coupon",
        subtitle: "Issue a new promo code with percentage discount",
        category: "Quick Actions",
        icon: Tag,
        href: "/admin/marketing/coupons?action=new",
      },
      {
        id: "action-new-banner",
        title: "Update announcement banner",
        subtitle: "Broadcast alert to all student screens",
        category: "Quick Actions",
        icon: Megaphone,
        href: "/admin/marketing/banners?action=edit",
      },
      // Segments
      {
        id: "seg-enterprise",
        title: "Enterprise Learners (18)",
        subtitle: "High-value business accounts & intensive coaching",
        category: "Segments",
        icon: Users,
        href: "/admin/learners?tier=enterprise",
        badge: "#6C5CE7",
        badgeColor: "bg-[#6C5CE7]",
      },
      {
        id: "seg-business",
        title: "Business / Cohort (64)",
        subtitle: "Company cohorts and university prep programs",
        category: "Segments",
        icon: Users,
        href: "/admin/learners?tier=business",
        badge: "#2F5D9E",
        badgeColor: "bg-[#2F5D9E]",
      },
      {
        id: "seg-pro",
        title: "Pro Learners (210)",
        subtitle: "Active VIP subscribers with audio SRS",
        category: "Segments",
        icon: Users,
        href: "/admin/learners?tier=pro",
        badge: "#3DBBA8",
        badgeColor: "bg-[#3DBBA8]",
      },
      {
        id: "seg-starter",
        title: "Starter Plan (480)",
        subtitle: "Learners beginning TOPIK 1 and Hangul",
        category: "Segments",
        icon: Users,
        href: "/admin/learners?tier=starter",
        badge: "#F5B93A",
        badgeColor: "bg-[#F5B93A]",
      },
      {
        id: "seg-free",
        title: "Free Tier (1.200)",
        subtitle: "Registered learners on foundational free tier",
        category: "Segments",
        icon: Users,
        href: "/admin/learners?tier=free",
        badge: "#B3BAB9",
        badgeColor: "bg-[#B3BAB9]",
      },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.subtitle?.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [items, query]);

  // Global keydown listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via custom event or direct state
          const event = new CustomEvent("open-admin-command-palette");
          window.dispatchEvent(event);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Key navigation inside palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        handleSelectItem(current);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectItem = (item: PaletteItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-[#14201F]/30 dark:bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Palette Card */}
      <div className="relative w-full max-w-2xl bg-admin-surface rounded-admin-card border border-admin-border shadow-admin-card overflow-hidden z-10 flex flex-col max-h-[75vh] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-admin-border bg-admin-surface">
          <Search className="w-5 h-5 text-admin-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command, page, or learner segment..."
            className="flex-1 bg-transparent text-sm text-admin-text-primary placeholder:text-admin-text-placeholder focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-admin-text-muted hover:text-admin-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-admin-text-muted bg-admin-subtle border border-admin-border rounded-md">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-admin-border/50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-admin-text-muted text-sm">
              No matching commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-admin-control text-left transition-colors duration-100 ${
                      isSelected
                        ? "bg-admin-subtle text-admin-text-primary"
                        : "text-admin-text-secondary hover:bg-admin-subtle/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-admin-surface border border-admin-border text-admin-brand-teal shadow-xs"
                            : "bg-admin-subtle/80 text-admin-text-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-admin-text-primary truncate">
                            {item.title}
                          </span>
                          {item.badgeColor && (
                            <span
                              className={`w-2 h-2 rounded-full ${item.badgeColor} shrink-0`}
                            />
                          )}
                          {item.badge && !item.badgeColor && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-admin-brand-teal/10 text-admin-brand-teal">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-admin-text-muted truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      <span className="text-[10px] text-admin-text-muted font-medium">
                        {item.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-admin-brand-teal" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 border-t border-admin-border bg-admin-subtle/50 flex items-center justify-between text-[11px] text-admin-text-muted">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="font-semibold text-admin-text-secondary">↑</kbd>{" "}
              <kbd className="font-semibold text-admin-text-secondary">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-semibold text-admin-text-secondary">↵</kbd> to select
            </span>
          </div>
          <span>JungHyeon Admin v2.0</span>
        </div>
      </div>
    </div>
  );
}
