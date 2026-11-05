"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { FontSizeProvider } from "@/lib/context/FontSizeContext";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { SrsProvider } from "@/lib/context/SrsContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { OnboardingModal } from "@/components/auth/OnboardingModal";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FontSizeProvider>
        <I18nProvider>
          <AuthProvider>
            <SrsProvider>
              {children}
              {/* Modal đăng nhập / đăng ký toàn cục */}
              <AuthModal />
              {/* Modal khảo sát thiết lập lộ trình 3 bước */}
              <OnboardingModal />
            </SrsProvider>
          </AuthProvider>
        </I18nProvider>
      </FontSizeProvider>
    </ThemeProvider>
  );
}
