"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export function AdminThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-admin-control border border-admin-border bg-admin-surface/50 ${className}`} />
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={cycleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title={`Current: ${theme}. Click to toggle, right-click for menu`}
        className="w-9 h-9 flex items-center justify-center rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-admin-text-secondary hover:text-admin-text-primary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/40"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-admin-brand-yellow transition-transform duration-200" />
        ) : theme === "light" ? (
          <Sun className="w-4 h-4 text-admin-brand-yellow transition-transform duration-200" />
        ) : (
          <Laptop className="w-4 h-4 text-admin-brand-teal transition-transform duration-200" />
        )}
      </button>

      {/* Popover on right-click or long press */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
            <button
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-admin-control font-medium transition-colors ${
                theme === "light"
                  ? "bg-admin-brand-teal/10 text-admin-brand-teal font-semibold"
                  : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-admin-control font-medium transition-colors ${
                theme === "dark"
                  ? "bg-admin-brand-teal/10 text-admin-brand-teal font-semibold"
                  : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-admin-control font-medium transition-colors ${
                theme === "system"
                  ? "bg-admin-brand-teal/10 text-admin-brand-teal font-semibold"
                  : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>System</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
