"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Locale, translations, TranslationSchema } from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
  translations: TranslationSchema;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi");

  useEffect(() => {
    const saved = localStorage.getItem("junghyeon_locale") as Locale;
    if (saved === "vi" || saved === "en") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("junghyeon_locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = translations[locale];
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to Vietnamese dictionary
        let fallback: any = translations.vi;
        for (const k of keys) {
          if (fallback && typeof fallback === "object" && k in fallback) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return typeof fallback === "string" ? fallback : path;
      }
    }
    return typeof current === "string" ? current : path;
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        translations: translations[locale] as TranslationSchema,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      locale: "vi" as Locale,
      setLocale: () => {},
      t: (path: string): string => {
        const keys = path.split(".");
        let current: any = translations.vi;
        for (const k of keys) {
          if (current && typeof current === "object" && k in current) {
            current = current[k];
          } else {
            return path;
          }
        }
        return typeof current === "string" ? current : path;
      },
      translations: translations.vi as TranslationSchema,
    };
  }
  return context;
}
