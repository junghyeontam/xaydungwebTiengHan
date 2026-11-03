"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExtendedUserProfile } from "@/features/profile/types";
import { SettingsContext } from "@/features/profile/context/SettingsContext";
import {
  loadLearnerProfile,
  saveLearnerProfile,
} from "@/features/profile/profile-storage";
import { ProfileSummaryCard } from "@/features/profile/components/ProfileSummaryCard";
import { SettingsNav } from "@/features/profile/components/SettingsNav";
import { StickySaveBar } from "@/features/profile/components/StickySaveBar";
import { AvatarCropModal } from "@/features/profile/components/AvatarCropModal";
import { MascotGalleryModal } from "@/features/profile/components/MascotGalleryModal";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<ExtendedUserProfile>(loadLearnerProfile());
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modals state
  const [isAvatarCropOpen, setIsAvatarCropOpen] = useState(false);
  const [isMascotGalleryOpen, setIsMascotGalleryOpen] = useState(false);

  // Registered save/discard delegates for active card
  const [saveDelegate, setSaveDelegate] = useState<(() => Promise<boolean> | boolean) | null>(null);
  const [discardDelegate, setDiscardDelegate] = useState<(() => void) | null>(null);

  const refreshProfile = useCallback(() => {
    setProfile(loadLearnerProfile());
  }, []);

  useEffect(() => {
    refreshProfile();
    window.addEventListener("jh_profile_updated", refreshProfile);
    return () => {
      window.removeEventListener("jh_profile_updated", refreshProfile);
    };
  }, [refreshProfile]);

  const updateProfileState = (updates: Partial<ExtendedUserProfile>, sectionId?: string) => {
    const next = saveLearnerProfile(updates, sectionId);
    setProfile(next);
    setIsDirty(false);
  };

  const registerSaveHandler = useCallback((fn: () => Promise<boolean> | boolean) => {
    setSaveDelegate(() => fn);
  }, []);

  const registerDiscardHandler = useCallback((fn: () => void) => {
    setDiscardDelegate(() => fn);
  }, []);

  const handleGlobalSave = async () => {
    if (saveDelegate) {
      setIsSaving(true);
      try {
        await saveDelegate();
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleGlobalDiscard = () => {
    if (discardDelegate) {
      discardDelegate();
    }
    setIsDirty(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        profile,
        updateProfileState,
        isDirty,
        setIsDirty,
        registerSaveHandler,
        registerDiscardHandler,
        openAvatarModal: () => setIsAvatarCropOpen(true),
        openMascotModal: () => setIsMascotGalleryOpen(true),
      }}
    >
      <div className="min-h-screen bg-brand-bg py-8 sm:py-12 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 max-w-[1200px] space-y-6">
          {/* Breadcrumb / Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-secondary hover:text-brand-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang Tổng quan Hồ sơ</span>
            </Link>

            <span className="text-xs text-brand-muted hidden sm:inline">
              Mã học viên: <strong className="font-mono text-brand-navy dark:text-white">{profile.id}</strong>
            </span>
          </div>

          {/* Settings Page Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy dark:text-white tracking-tight">
              Cài đặt & Hồ sơ Học viên
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary">
              Quản lý thông tin cá nhân, định hướng lộ trình TOPIK, tùy chọn bảo mật và thông báo học tập.
            </p>
          </div>

          {/* Desktop 2-Column Grid (>=1280px: 280px Left Sticky + 820px Right Main) */}
          <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-8 items-start">
            {/* Left Column (Sticky Sidebar on Desktop) */}
            <aside className="space-y-6 xl:sticky xl:top-24">
              <ProfileSummaryCard
                profile={profile}
                onOpenAvatarModal={() => setIsAvatarCropOpen(true)}
              />
              <SettingsNav />
            </aside>

            {/* Right Main Column (Max 820px) */}
            <main className="w-full min-w-0 max-w-[820px] space-y-6">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <StickySaveBar
        show={isDirty}
        isSaving={isSaving}
        onSave={handleGlobalSave}
        onDiscard={handleGlobalDiscard}
      />

      {/* Avatar Modals */}
      <AvatarCropModal
        isOpen={isAvatarCropOpen}
        onClose={() => setIsAvatarCropOpen(false)}
        onSaveAvatar={(url) => {
          updateProfileState({ avatarUrl: url, avatarKind: "upload" }, "avatar");
        }}
        onOpenMascotGallery={() => setIsMascotGalleryOpen(true)}
        onRemoveAvatar={() => {
          updateProfileState({ avatarUrl: "", avatarKind: "preset" }, "avatar");
        }}
        currentAvatarUrl={profile.avatarUrl}
      />

      <MascotGalleryModal
        isOpen={isMascotGalleryOpen}
        onClose={() => setIsMascotGalleryOpen(false)}
        onSelectMascot={(mascot) => {
          // Use mascot Honey preset
          updateProfileState(
            {
              avatarUrl: "", // Clear custom upload, uses mascot
              avatarKind: "preset",
            },
            "avatar"
          );
        }}
      />
    </SettingsContext.Provider>
  );
}
