"use client";

import React, { useState, useEffect } from "react";
import { AdminAuthProvider } from "@/features/auth-rbac/AdminAuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import { ThemeProvider } from "next-themes";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Restore sidebar state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jh_admin_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  const handleToggleCollapse = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    try {
      localStorage.setItem("jh_admin_sidebar_collapsed", String(nextState));
    } catch {}
  };

  // Listen to open palette events from anywhere
  useEffect(() => {
    const handleOpenEvent = () => setCommandPaletteOpen(true);
    window.addEventListener("open-admin-command-palette", handleOpenEvent);
    return () => window.removeEventListener("open-admin-command-palette", handleOpenEvent);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AdminAuthProvider>
        <div className="min-h-screen bg-admin-bg text-admin-text-primary flex antialiased selection:bg-blue-600 selection:text-white">
          {/* Desktop Collapsible Sidebar (256px -> 72px) */}
          <div className="hidden md:block shrink-0">
            <AdminSidebar
              collapsed={collapsed}
              onToggleCollapse={handleToggleCollapse}
              onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            />
          </div>

          {/* Mobile/Tablet Drawer Sidebar */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                className="fixed inset-0 bg-[#14201F]/40 dark:bg-black/70 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileOpen(false)}
              />
              <div className="relative w-64 bg-admin-sidebar h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
                <AdminSidebar
                  collapsed={false}
                  onToggleCollapse={() => setMobileOpen(false)}
                  onOpenCommandPalette={() => {
                    setMobileOpen(false);
                    setCommandPaletteOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
            <AdminHeader
              onOpenMobileMenu={() => setMobileOpen(true)}
              onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
              {children}
            </main>
          </div>

          {/* Global Command Palette */}
          <AdminCommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />
        </div>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
