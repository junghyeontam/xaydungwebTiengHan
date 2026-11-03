"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type LearningGoal =
  | "du-hoc"
  | "xkld"
  | "topik"
  | "kpop"
  | "du-lich"
  | "study_abroad"
  | "employment"
  | "culture"
  | "kpop_culture"
  | "travel";

export type CurrentLevel =
  | "so-0"
  | "hangul"
  | "topik-1-2"
  | "topik-3-4"
  | "topik-5-6"
  | "zero"
  | "beginner"
  | "intermediate"
  | "advanced";
export type DailyCommitment = 10 | 20 | 30;

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  goal: LearningGoal;
  level: CurrentLevel;
  dailyGoalMinutes: DailyCommitment;
  totalXp: number;
  streakDays: number;
  isVip: boolean;
  isOnboarded: boolean;
  createdAt: string;
}

export type AuthModalTab = "login" | "register" | "magic-link" | "forgot";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  setAuthModalOpen: (open: boolean, tab?: AuthModalTab) => void;
  isOnboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  registerWithEmail: (email: string, pass: string, fullName: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  loginWithMagicLink: (email: string) => Promise<{ error?: string; message?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: {
    goal: LearningGoal;
    level: CurrentLevel;
    dailyGoalMinutes: DailyCommitment;
  }) => void;
  syncGuestProgress: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hồ sơ mẫu mặc định khi đăng nhập chế độ Demo hoặc người dùng mới
const DEFAULT_USER_PROFILE: UserProfile = {
  id: "user-demo-123",
  email: "banhoc@junghyeon.vn",
  fullName: "Bạn học JungHyeon",
  avatarUrl: "",
  goal: "du-hoc",
  level: "so-0",
  dailyGoalMinutes: 20,
  totalXp: 485,
  streakDays: 7,
  isVip: false,
  isOnboarded: true,
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>("login");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Khởi tạo trạng thái phiên đăng nhập
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const authUser = data.session.user;
            // Lấy profile từ local hoặc bảng profiles
            const savedProfile = localStorage.getItem(`junghyeon_profile_${authUser.id}`);
            if (savedProfile) {
              setUser(JSON.parse(savedProfile));
            } else {
              const newProfile: UserProfile = {
                id: authUser.id,
                email: authUser.email || "hocvien@junghyeon.vn",
                fullName: authUser.user_metadata?.full_name || "Bạn học mới",
                avatarUrl: authUser.user_metadata?.avatar_url,
                goal: "du-hoc",
                level: "so-0",
                dailyGoalMinutes: 20,
                totalXp: 50,
                streakDays: 1,
                isVip: false,
                isOnboarded: false,
                createdAt: authUser.created_at || new Date().toISOString(),
              };
              setUser(newProfile);
              localStorage.setItem(`junghyeon_profile_${authUser.id}`, JSON.stringify(newProfile));
            }
          }
        } else {
          // Chế độ mô phỏng / kiểm tra nếu đã có tài khoản lưu trong localStorage
          const localUser = localStorage.getItem("junghyeon_current_user");
          if (localUser) {
            setUser(JSON.parse(localUser));
          }
        }
      } catch (err) {
        console.error("Lỗi khởi tạo Auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setAuthModalOpen = (open: boolean, tab: AuthModalTab = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(open);
  };

  // Đồng bộ tiến độ khách (Guest) sang tài khoản sau khi đăng nhập
  const syncGuestProgress = () => {
    try {
      const guestProgressStr = localStorage.getItem("junghyeon_guest_progress");
      if (guestProgressStr && user) {
        const guestProgress = JSON.parse(guestProgressStr);
        const bonusXp = guestProgress.xp || 0;
        const bonusStreak = guestProgress.streak || 0;

        if (bonusXp > 0 || bonusStreak > 0) {
          const updated: UserProfile = {
            ...user,
            totalXp: user.totalXp + bonusXp,
            streakDays: Math.max(user.streakDays, bonusStreak),
          };
          setUser(updated);
          localStorage.setItem(`junghyeon_profile_${user.id}`, JSON.stringify(updated));
          localStorage.setItem("junghyeon_current_user", JSON.stringify(updated));
          localStorage.removeItem("junghyeon_guest_progress");
        }
      }
    } catch (err) {
      console.warn("Không thể đồng bộ tiến độ khách:", err);
    }
  };

  // 1. Đăng nhập bằng Email & Mật khẩu
  const loginWithEmail = async (email: string, pass: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return { error: error.message };

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          goal: "du-hoc",
          level: "so-0",
          dailyGoalMinutes: 20,
          totalXp: 120,
          streakDays: 3,
          isVip: false,
          isOnboarded: true,
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem("junghyeon_current_user", JSON.stringify(profile));
        syncGuestProgress();
      }
      setIsAuthModalOpen(false);
      return {};
    }

    // Demo Mode (khi chưa cấu hình Supabase Key)
    const demoProfile: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      email,
      fullName: email.split("@")[0] || "Bạn học JungHyeon",
    };
    setUser(demoProfile);
    localStorage.setItem("junghyeon_current_user", JSON.stringify(demoProfile));
    syncGuestProgress();
    setIsAuthModalOpen(false);
    return {};
  };

  // 2. Đăng ký tài khoản mới bằng Email & Mật khẩu
  const registerWithEmail = async (email: string, pass: string, fullName: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) return { error: error.message };

      const newProfile: UserProfile = {
        id: data.user?.id || `user-${Date.now()}`,
        email,
        fullName: fullName || email.split("@")[0],
        goal: "du-hoc",
        level: "so-0",
        dailyGoalMinutes: 20,
        totalXp: 50, // Thưởng 50 XP tạo tài khoản
        streakDays: 1,
        isVip: false,
        isOnboarded: false,
        createdAt: new Date().toISOString(),
      };
      setUser(newProfile);
      localStorage.setItem("junghyeon_current_user", JSON.stringify(newProfile));
      syncGuestProgress();
      setIsAuthModalOpen(false);
      setIsOnboardingOpen(true); // Tự động mở Onboarding cho học viên mới
      return {};
    }

    // Demo Mode
    const newDemoProfile: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      id: `demo-${Date.now()}`,
      email,
      fullName: fullName || "Bạn học mới",
      totalXp: 50,
      streakDays: 1,
      isOnboarded: false,
    };
    setUser(newDemoProfile);
    localStorage.setItem("junghyeon_current_user", JSON.stringify(newDemoProfile));
    syncGuestProgress();
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(true);
    return {};
  };

  // 3. Đăng nhập Google OAuth
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        console.warn("Supabase OAuth unavailable, falling back to demo login:", err);
      }
    }

    // Demo Google login (hoạt động tức thì cho môi trường test/local)
    const googleDemoProfile: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      id: "google-demo-user",
      email: "google.user@junghyeon.vn",
      fullName: "Học viên Google",
    };
    setUser(googleDemoProfile);
    localStorage.setItem("junghyeon_current_user", JSON.stringify(googleDemoProfile));
    syncGuestProgress();
    setIsAuthModalOpen(false);
    return {};
  };

  // 4. Đăng nhập Magic Link
  const loginWithMagicLink = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) return { error: error.message };
      return { message: "Link đăng nhập an toàn đã được gửi tới email của bạn!" };
    }

    return {
      message:
        "Chế độ thử nghiệm: Đã giả lập gửi Magic Link tới email " +
        email +
        ". Bạn có thể đăng nhập ngay!",
    };
  };

  // 5. Quên mật khẩu / Khôi phục mật khẩu
  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/ho-so#doi-mat-khau`,
      });
      if (error) return { error: error.message };
      return { message: "Hướng dẫn đặt lại mật khẩu đã được gửi tới email của bạn." };
    }

    return {
      message:
        "Chế độ thử nghiệm: Đã gửi email hướng dẫn khôi phục mật khẩu tới " + email + ".",
    };
  };

  // 6. Đăng xuất
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("junghyeon_current_user");
  };

  // 7. Cập nhật hồ sơ
  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(`junghyeon_profile_${user.id}`, JSON.stringify(updated));
    localStorage.setItem("junghyeon_current_user", JSON.stringify(updated));
  };

  // 8. Hoàn thành Onboarding 3 bước
  const completeOnboarding = (data: {
    goal: LearningGoal;
    level: CurrentLevel;
    dailyGoalMinutes: DailyCommitment;
  }) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      goal: data.goal,
      level: data.level,
      dailyGoalMinutes: data.dailyGoalMinutes,
      isOnboarded: true,
      totalXp: user.totalXp + 30, // Thưởng 30 XP khi hoàn thành khảo sát
    };
    setUser(updated);
    localStorage.setItem(`junghyeon_profile_${user.id}`, JSON.stringify(updated));
    localStorage.setItem("junghyeon_current_user", JSON.stringify(updated));
    setIsOnboardingOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        setAuthModalOpen,
        isOnboardingOpen,
        setOnboardingOpen: setIsOnboardingOpen,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithMagicLink,
        resetPassword,
        logout,
        updateProfile,
        completeOnboarding,
        syncGuestProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
