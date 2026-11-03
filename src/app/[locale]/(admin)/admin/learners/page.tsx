"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Flame,
  Award,
  Eye,
  EyeOff,
  Lock,
  PlusCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Num } from "@/components/shared";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { maskEmail, maskName, maskPhone } from "@/lib/utils/masking";

interface LearnerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: "lifetime_vip" | "free" | "trial" | "expired";
  level: string;
  xp: number;
  streak: number;
  joinedAt: string;
  teacherAssigned?: string;
  className?: string;
}

const INITIAL_LEARNERS: LearnerItem[] = [
  {
    id: "usr-1",
    name: "Nguyễn Minh Anh",
    email: "minhanh.nguyen@gmail.com",
    phone: "0988 112 233",
    plan: "lifetime_vip",
    level: "TOPIK 3",
    xp: 1450,
    streak: 28,
    joinedAt: "1 tháng trước",
    teacherAssigned: "teacher@junghyeon.vn",
    className: "TOPIK 3 Cấp tốc",
  },
  {
    id: "usr-2",
    name: "Trần Tuấn Kiệt",
    email: "tuankiet.tran@gmail.com",
    phone: "0912 334 455",
    plan: "lifetime_vip",
    level: "TOPIK 5",
    xp: 4200,
    streak: 85,
    joinedAt: "3 tháng trước",
    teacherAssigned: "teacher@junghyeon.vn",
    className: "Luyện dịch Cabin TOPIK 5-6",
  },
  {
    id: "usr-3",
    name: "Lê Hoàng Yến",
    email: "hoangyen.le@company.vn",
    phone: "0934 889 001",
    plan: "trial",
    level: "TOPIK 4",
    xp: 2890,
    streak: 42,
    joinedAt: "2 tháng trước",
  },
  {
    id: "usr-4",
    name: "Phạm Gia Bảo",
    email: "giabao.pham@outlook.com",
    phone: "0977 665 544",
    plan: "free",
    level: "TOPIK 1",
    xp: 480,
    streak: 7,
    joinedAt: "2 tuần trước",
    teacherAssigned: "teacher@junghyeon.vn",
    className: "TOPIK 3 Cấp tốc",
  },
  {
    id: "usr-5",
    name: "Đỗ Thùy Trang",
    email: "thuytrang.do@gmail.com",
    phone: "0909 123 456",
    plan: "free",
    level: "Hangul",
    xp: 120,
    streak: 3,
    joinedAt: "3 ngày trước",
  },
  {
    id: "usr-6",
    name: "Vũ Đình Trọng",
    email: "trong.vu@fpt.com.vn",
    phone: "0945 678 901",
    plan: "expired",
    level: "TOPIK 2",
    xp: 950,
    streak: 0,
    joinedAt: "6 tháng trước",
  },
];

export default function AdminLearnersPage() {
  const { can, currentRole } = useAdminAuth();
  const [learners, setLearners] = useState<LearnerItem[]>(INITIAL_LEARNERS);
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [onlyMyClasses, setOnlyMyClasses] = useState(false);
  const [isUnmasked, setIsUnmasked] = useState(false);

  // Sync real learners from current session
  useEffect(() => {
    const syncLearners = () => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem("junghyeon_current_user");
        if (raw) {
          const u = JSON.parse(raw);
          if (u && u.email) {
            setLearners((prev) => {
              if (prev.some((item) => item.email.toLowerCase() === u.email.toLowerCase())) {
                return prev;
              }
              const realLearner: LearnerItem = {
                id: u.id || `real-${Date.now()}`,
                name: u.fullName || u.email.split("@")[0],
                email: u.email,
                phone: "0988 999 888",
                plan: u.isVip ? "lifetime_vip" : "free",
                level: (u.level || "TOPIK 1").toUpperCase(),
                xp: u.totalXp || 0,
                streak: u.streakDays || 1,
                joinedAt: "Vừa xong",
                teacherAssigned: "teacher@junghyeon.vn",
                className: "TOPIK 1 Sơ cấp",
              };
              return [realLearner, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn("Could not sync current user to admin learners:", err);
      }
    };

    syncLearners();
    window.addEventListener("storage", syncLearners);
    window.addEventListener("jh_user_updated", syncLearners);
    return () => {
      window.removeEventListener("storage", syncLearners);
      window.removeEventListener("jh_user_updated", syncLearners);
    };
  }, []);

  // Re-auth modal state for sensitive adjustments
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [targetLearner, setTargetLearner] = useState<LearnerItem | null>(null);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthError, setReauthError] = useState("");

  const canViewPii = can("learners.view_pii");
  const isTeacher = currentRole === "teacher";

  const toggleUnmask = () => {
    if (!canViewPii) return;
    setIsUnmasked(!isUnmasked);
  };

  const handleAdjustXpClick = (learner: LearnerItem) => {
    setTargetLearner(learner);
    setReauthPassword("");
    setReauthError("");
    setShowReauthModal(true);
  };

  const handleConfirmReauth = (e: React.FormEvent) => {
    e.preventDefault();
    if (reauthPassword.length < 4) {
      setReauthError("Vui lòng nhập mật khẩu xác thực (tối thiểu 4 ký tự)");
      return;
    }
    // Success simulated
    alert(`Xác thực thành công. Đã cộng +100 XP cho học viên ${targetLearner?.name}. Thao tác được ghi vào Audit Logs.`);
    setShowReauthModal(false);
  };

  const planFilters = [
    { id: "all", label: "Tất cả học viên (2.065)" },
    { id: "lifetime_vip", label: "Hội viên VIP (450)" },
    { id: "free", label: "Gói Free (1.450)" },
    { id: "trial", label: "Dùng thử VIP (120)" },
    { id: "expired", label: "Hết hạn (45)" },
  ];

  const filtered = learners.filter((l) => {
    if (onlyMyClasses && l.teacherAssigned !== "teacher@junghyeon.vn") {
      return false;
    }
    if (selectedPlan !== "all" && l.plan !== selectedPlan) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = l.name.toLowerCase().includes(q);
      const matchEmail = l.email.toLowerCase().includes(q);
      const matchPhone = l.phone.includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Student Directory"
        title="Learners & Classes"
        titleMuted="· 2,065 Active Accounts"
        description="Theo dõi toàn diện hồ sơ học viên, lộ trình đang theo học, điểm kinh nghiệm XP, chuỗi ngày liên tục (streak) và phân khúc gói hội viên."
        actions={
          canViewPii ? (
            <button
              type="button"
              onClick={toggleUnmask}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-admin-pill text-xs font-semibold border transition-all ${
                isUnmasked
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  : "bg-admin-surface hover:bg-admin-subtle text-admin-text-secondary border-admin-border"
              }`}
              title={isUnmasked ? "Che lại thông tin PII" : "Hiện thông tin đầy đủ (Ghi nhận Audit Log)"}
            >
              {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isUnmasked ? "PII: Đang hiện (Audited)" : "👁️ Xem PII đầy đủ"}</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-admin-pill text-xs font-medium text-admin-text-muted bg-admin-subtle/50 border border-admin-border">
              <Lock className="w-3 h-3 text-admin-text-muted" />
              <span>PII Masked (PoLP)</span>
            </div>
          )
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {planFilters.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedPlan(t.id)}
              className={`px-3 py-1.5 rounded-admin-control text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPlan === t.id
                  ? "bg-admin-brand-teal/15 text-admin-brand-teal font-bold"
                  : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}

          {/* Teacher Scoped Filter */}
          {isTeacher && (
            <button
              onClick={() => setOnlyMyClasses(!onlyMyClasses)}
              className={`ml-2 px-3 py-1.5 rounded-admin-control text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                onlyMyClasses
                  ? "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 font-bold"
                  : "text-admin-text-secondary border-admin-border hover:bg-admin-subtle"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Lớp của tôi ({INITIAL_LEARNERS.filter((x) => x.teacherAssigned).length})</span>
            </button>
          )}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 text-admin-text-placeholder absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên học viên hoặc email..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary placeholder:text-admin-text-placeholder focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 focus:border-admin-brand-teal"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                <th className="py-3 px-4 font-medium">Học viên</th>
                <th className="py-3 px-4 font-medium">Liên hệ</th>
                <th className="py-3 px-4 font-medium">Gói hội viên</th>
                <th className="py-3 px-4 font-medium">Trình độ</th>
                <th className="py-3 px-4 font-medium">XP Tích lũy</th>
                <th className="py-3 px-4 font-medium">Streak</th>
                <th className="py-3 px-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {filtered.map((u) => {
                const displayName = canViewPii && isUnmasked ? u.name : maskName(u.name);
                const displayEmail = canViewPii && isUnmasked ? u.email : maskEmail(u.email);
                const displayPhone = canViewPii && isUnmasked ? u.phone : maskPhone(u.phone);

                return (
                  <tr key={u.id} className="hover:bg-admin-subtle/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-admin-brand-teal/15 text-admin-brand-teal font-semibold text-xs flex items-center justify-center shrink-0">
                          {displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-admin-text-primary flex items-center gap-1.5">
                            <span>{displayName}</span>
                            {u.className && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                                {u.className}
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-admin-text-muted num-tabular">{displayPhone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-admin-text-secondary num-tabular">
                      {displayEmail}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.plan === "lifetime_vip" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-admin-pill bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Lifetime VIP
                        </span>
                      )}
                      {u.plan === "trial" && (
                        <span className="px-2 py-0.5 rounded-admin-pill bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-[10px] font-semibold">
                          Dùng thử VIP
                        </span>
                      )}
                      {u.plan === "free" && (
                        <span className="px-2 py-0.5 rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-secondary text-[10px] font-semibold">
                          Free Plan
                        </span>
                      )}
                      {u.plan === "expired" && (
                        <span className="px-2 py-0.5 rounded-admin-pill bg-red-500/10 text-red-600 border border-red-500/20 text-[10px] font-semibold">
                          Hết hạn
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-admin-text-primary">
                      {u.level}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-admin-brand-teal">
                      <Num value={u.xp} tabular suffix=" XP" />
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-admin-brand-coral font-semibold num-tabular">
                        <Flame className="w-3.5 h-3.5" />
                        {u.streak} ngày
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {can("learners.update") ? (
                        <button
                          type="button"
                          onClick={() => handleAdjustXpClick(u)}
                          className="px-2.5 py-1 rounded-admin-control bg-admin-subtle hover:bg-admin-subtle/80 text-admin-text-secondary hover:text-admin-text-primary font-medium text-[11px] transition-colors border border-admin-border"
                        >
                          Cộng XP
                        </button>
                      ) : (
                        <span className="text-admin-text-placeholder text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Re-Authentication Modal for Sensitive Actions */}
      {showReauthModal && targetLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-admin-surface border border-admin-border rounded-admin-card shadow-admin-card p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-admin-brand-teal">
              <Lock className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-admin-text-primary">
                Xác thực lại bảo mật (Re-Authentication)
              </h3>
            </div>
            <p className="text-xs text-admin-text-secondary leading-relaxed">
              Bạn đang thực hiện thao tác nhạy cảm: Điều chỉnh điểm XP cho học viên{" "}
              <strong className="text-admin-text-primary">{targetLearner.name}</strong>. Vui lòng xác nhận mật khẩu tài khoản quản trị để tiến hành.
            </p>

            <form onSubmit={handleConfirmReauth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
                  Mật khẩu Quản trị viên
                </label>
                <input
                  type="password"
                  value={reauthPassword}
                  onChange={(e) => setReauthPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn..."
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 focus:border-admin-brand-teal"
                  autoFocus
                />
                {reauthError && <p className="text-[11px] text-red-500 mt-1">{reauthError}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReauthModal(false)}
                  className="px-3.5 py-1.5 rounded-admin-pill text-xs font-semibold text-admin-text-secondary hover:bg-admin-subtle transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-admin-pill text-xs font-semibold bg-admin-brand-teal text-white hover:opacity-90 transition-opacity shadow-xs"
                >
                  Xác nhận & Ghi nhận Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
