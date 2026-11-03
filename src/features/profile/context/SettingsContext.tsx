"use client";

import React, { createContext, useContext } from "react";
import { ExtendedUserProfile } from "../types";

export interface SettingsContextType {
  profile: ExtendedUserProfile;
  updateProfileState: (updates: Partial<ExtendedUserProfile>, sectionId?: string) => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  registerSaveHandler: (fn: () => Promise<boolean> | boolean) => void;
  registerDiscardHandler: (fn: () => void) => void;
  openAvatarModal: () => void;
  openMascotModal: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettingsContext must be used within SettingsLayout or SettingsProvider");
  }
  return ctx;
}
