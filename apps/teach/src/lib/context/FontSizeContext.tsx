"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FontSizeOption = "s" | "m" | "l";

interface FontSizeContextType {
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>("m");

  useEffect(() => {
    const saved = localStorage.getItem("junghyeon_fontsize") as FontSizeOption;
    if (saved === "s" || saved === "m" || saved === "l") {
      setFontSizeState(saved);
      document.documentElement.setAttribute("data-font-size", saved);
    } else {
      document.documentElement.setAttribute("data-font-size", "m");
    }
  }, []);

  const setFontSize = (size: FontSizeOption) => {
    setFontSizeState(size);
    localStorage.setItem("junghyeon_fontsize", size);
    document.documentElement.setAttribute("data-font-size", size);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
}
