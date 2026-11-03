"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth, LearningGoal, DailyCommitment } from "@/lib/context/AuthContext";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  User,
  Mail,
  Flame,
  Sparkles,
  Trophy,
  Award,
  Calendar,
  Clock,
  Target,
  Edit3,
  CheckCircle2,
  Lock,
  TrendingUp,
  BookOpen,
  Layers,
  Crown,
  Settings,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const { user, setAuthModalOpen, setOnboardingOpen, updateProfile } = useAuth();

  // Weekly XP simulated chart data
  const weeklyXpData = [
    { day: "T2", xp: 45 },
    { day: "T3", xp: 60 },
    { day: "T4", xp: 35 },
    { day: "T5", xp: 70 },
    { day: "T6", xp: 50 },
    { day: "T7", xp: 85 },
    { day: "CN", xp: 40 },
  ];
  const maxWeeklyXp = Math.max(...weeklyXpData.map((d) => d.xp));

  // GitHub-style streak matrix (12 weeks: 12 columns x 7 days)
  const heatmapDays = Array.from({ length: 84 }, (_, i) => {
    const randomLevel = (i * 7 + 3) % 5 === 0 ? 0 : (i % 4);
    return {
      dayIndex: i,
      level: i > 76 ? 3 : randomLevel,
    };
  });

  // Learner badges collection
  const badges = [
    {
      id: "badge-1",
      icon: "🌱",
      title: "Hạt giống đầu tiên",
      desc: "Gia nhập Tiếng Hàn JungHyeon và hoàn thành bài đầu tiên",
      unlocked: true,
      date: "01/10/2026",
    },
    {
      id: "badge-2",
      icon: "🔥",
      title: "Chiến thần 7 ngày",
      desc: "Duy trì chuỗi học liên tục không gián đoạn trong 7 ngày",
      unlocked: true,
      date: "08/10/2026",
    },
    {
      id: "badge-3",
      icon: "🇰🇷",
      title: "Chinh phục Hangul",
      desc: "Học thuộc trọn vẹn 40 nguyên âm & phụ âm tiếng Hàn",
      unlocked: true,
      date: "14/10/2026",
    },
    {
      id: "badge-4",
      icon: "🧠",
      title: "Bộ não SRS",
      desc: "Ghi nhớ 100 từ vựng vào trí nhớ dài hạn bằng Spaced Repetition",
      unlocked: false,
      progress: "74 / 100 từ",
    },
    {
      id: "badge-5",
      icon: "🏆",
      title: "Thủ khoa TOPIK 1",
      desc: "Đạt trên 90% số điểm bài thi thử Sơ cấp TOPIK 1",
      unlocked: false,
      progress: "Chưa thử sức",
    },
    {
      id: "badge-6",
      icon: "🌺",
      title: "Mugunghwa nở rộ",
      desc: "Cây JungHyeon đạt cấp độ 5 hoa nở rực rỡ (1.500+ XP)",
      unlocked: false,
      progress: "485 / 1500 XP",
    },
  ];

  // Weekly leaderboard
  const leaderboard = [
    { rank: 1, name: "Minh Anh", xp: 1240, avatar: "MA", medal: "🥇" },
    { rank: 2, name: "Khánh Linh", xp: 980, avatar: "KL", medal: "🥈" },
    { rank: 3, name: "Hoàng Nam", xp: 850, avatar: "HN", medal: "🥉" },
    { rank: 4, name: "Thu Trang", xp: 620, avatar: "TT" },
    { rank: 8, name: user?.fullName || "Bạn", xp: user?.totalXp || 485, avatar: "YOU", isMe: true },
  ];

  const [editSuccess, setEditSuccess] = useState(false);
  const [goal, setGoal] = useState<LearningGoal>(user?.goal || "study_abroad");
  const [commitment, setCommitment] = useState<DailyCommitment>(user?.dailyGoalMinutes || 20);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      goal,
      dailyGoalMinutes: commitment,
    });
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2500);
  };

  // If user is not logged in, prompt sign in
  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 text-center max-w-lg space-y-6">
        <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
          <MascotHoney mood="wave" size={80} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Đăng nhập để xem hồ sơ
          </h1>
          <p className="text-sm text-muted-foreground">
            Tiến độ học tập, chuỗi streak, cây JungHyeon và các huy hiệu danh giá đang chờ bạn!
          </p>
        </div>
        <button
          onClick={() => setAuthModalOpen(true, "login")}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white font-bold text-sm shadow-coral-glow transition-all active:scale-95"
        >
          <User className="w-4 h-4" />
          <span>Đăng nhập hoặc Đăng ký ngay</span>
        </button>
      </div>
    );
  }

  const goalTitles: Record<string, string> = {
    study_abroad: "Du học Hàn Quốc",
    "du-hoc": "Du học Hàn Quốc",
    employment: "Xuất khẩu lao động / Làm việc cty Hàn",
    xkld: "Xuất khẩu lao động / Làm việc cty Hàn",
    topik: "Luyện thi TOPIK 1 - 6",
    kpop_culture: "K-Drama, K-Pop & Idol",
    kpop: "K-Drama, K-Pop & Idol",
    culture: "K-Drama, K-Pop & Idol",
    travel: "Du lịch & Giao tiếp cơ bản",
    "du-lich": "Du lịch & Giao tiếp cơ bản",
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* 1. Header Profile Card */}
      <div className="rounded-3xl bg-card border border-border shadow-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-junghyeon-teal/10 via-amber-100/10 to-transparent dark:from-junghyeon-teal/5 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar with Edit shortcut */}
            <div className="relative group">
              <Link
                href="/profile/settings/personal"
                title="Bấm để đổi ảnh đại diện hoặc linh vật Honey"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-junghyeon-dark to-junghyeon-teal text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-md uppercase transition-transform group-hover:scale-102 overflow-hidden"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : user.fullName ? (
                  user.fullName.substring(0, 2)
                ) : (
                  "JH"
                )}
              </Link>
              <Link
                href="/profile/settings/personal"
                title="Chỉnh sửa thông tin & ảnh đại diện"
                className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-white dark:bg-card border border-border shadow-xs flex items-center justify-center text-muted-foreground hover:text-junghyeon-teal hover:border-junghyeon-teal transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </Link>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold border-2 border-white">
                Online
              </span>
            </div>

            {/* Profile info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {user.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal text-xs font-bold">
                  Level 3 • Cây con 🪴
                </span>
                {user.isVip ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-yellow-400 text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-500" />
                    Hội viên VIP
                  </span>
                ) : (
                  <Link
                    href="/products"
                    className="px-2.5 py-0.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground text-xs font-semibold"
                  >
                    Gói miễn phí • Nâng cấp VIP ✨
                  </Link>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </p>
              <p className="text-xs text-muted-foreground pt-1">
                🎯 Mục tiêu: <strong className="text-foreground">{goalTitles[user.goal]}</strong> • Cam kết: <strong className="text-foreground">{user.dailyGoalMinutes} phút/ngày</strong>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto justify-end">
            <Link
              href="/profile/settings"
              className="px-4 py-2.5 rounded-xl border border-junghyeon-teal/40 bg-junghyeon-teal/10 hover:bg-junghyeon-teal/20 text-junghyeon-teal text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:scale-102"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Chỉnh sửa thông tin</span>
            </Link>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Khảo sát lại</span>
            </button>
            <Link
              href="/roadmap"
              className="px-5 py-2.5 rounded-xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white text-xs font-bold shadow-coral-glow transition-all active:scale-95"
            >
              Vào học ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Settings Shortcut Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-junghyeon-teal/10 via-amber-500/10 to-transparent border border-junghyeon-teal/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-junghyeon-teal text-white flex items-center justify-center shrink-0 shadow-xs">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-foreground">
              Trung tâm Cài đặt hồ sơ & Tài khoản học viên
            </div>
            <div className="text-[11px] sm:text-xs text-muted-foreground">
              Cập nhật thông tin cá nhân, ảnh đại diện, linh vật Honey, mục tiêu TOPIK, đổi mật khẩu và quyền riêng tư
            </div>
          </div>
        </div>
        <Link
          href="/profile/settings"
          className="px-4 py-2 rounded-xl bg-junghyeon-teal hover:bg-junghyeon-teal-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <span>Mở Cài đặt hồ sơ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Four Progress Stat Cards */}
      <div id="tien-do" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Tổng kinh nghiệm</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground font-num">
              {user.totalXp} <span className="text-xs text-junghyeon-teal">XP</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-orange-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Chuỗi học liên tục</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground font-num">
              {user.streakDays} <span className="text-xs text-orange-500">ngày 🔥</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-junghyeon-teal/15 text-junghyeon-teal flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Bài học hoàn thành</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground font-num">
              18 <span className="text-xs text-muted-foreground">/ 120 bài</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-junghyeon-hanbok/15 text-junghyeon-hanbok flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Thẻ SRS đã thuộc</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground font-num">
              74 <span className="text-xs text-muted-foreground">thẻ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Weekly XP Chart & GitHub-style Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day XP bar visualizer */}
        <div className="lg:col-span-5 rounded-3xl bg-card border border-border shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-junghyeon-teal" />
              <span>Điểm kinh nghiệm tuần này</span>
            </h3>
            <span className="text-xs font-num font-bold text-junghyeon-teal">
              +385 XP
            </span>
          </div>

          <div className="flex items-end justify-between h-44 pt-6 px-2 gap-2">
            {weeklyXpData.map((item, idx) => {
              const heightPercent = Math.round((item.xp / maxWeeklyXp) * 100);
              const isToday = idx === 5;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-num font-semibold text-muted-foreground">
                    {item.xp}
                  </span>
                  <div className="w-full bg-secondary/80 rounded-t-xl h-28 flex items-end p-0.5">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday
                          ? "bg-gradient-to-t from-junghyeon-coral to-rose-400 shadow-coral-glow"
                          : "bg-gradient-to-t from-junghyeon-teal to-emerald-400"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isToday ? "text-junghyeon-coral" : "text-muted-foreground"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Heatmap matrix */}
        <div className="lg:col-span-7 rounded-3xl bg-card border border-border shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Nhật ký học tập (Streak Heatmap)</span>
            </h3>
            <span className="text-xs text-muted-foreground font-medium">12 tuần qua</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Mỗi ô vuông xanh thể hiện một ngày bạn chuyên cần học tập cùng chú hổ Honey.
          </p>

          <div className="overflow-x-auto py-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
              {heatmapDays.map((d) => {
                const colorClasses = [
                  "bg-secondary/70 border-border/40",
                  "bg-emerald-500/25 border-emerald-500/30",
                  "bg-emerald-500/60 border-emerald-500/70",
                  "bg-emerald-500 border-emerald-600 shadow-xs",
                ];
                return (
                  <div
                    key={d.dayIndex}
                    className={`w-4 h-4 rounded-md border transition-transform hover:scale-125 cursor-pointer ${colorClasses[d.level]}`}
                    title={`Ngày ${d.dayIndex + 1}: ${
                      d.level === 0 ? "Nghỉ ngơi" : `${d.level * 25} XP`
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground pt-1">
            <span>Ít</span>
            <span className="w-3 h-3 rounded bg-secondary/80 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-500/30 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-500/70 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>Nhiều</span>
          </div>
        </div>
      </div>

      {/* 4. Badges Collection & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badges */}
        <div className="lg:col-span-7 rounded-3xl bg-card border border-border shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Bộ sưu tập Huy hiệu danh dự</span>
            </h3>
            <span className="text-xs font-bold text-junghyeon-teal">3 / 6 đã mở khoá</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  b.unlocked
                    ? "bg-amber-500/5 border-amber-500/30 shadow-xs"
                    : "bg-secondary/30 border-border/60 opacity-60"
                }`}
              >
                <div className="text-3xl shrink-0 p-1.5 rounded-xl bg-card border border-border shadow-xs">
                  {b.icon}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {b.title}
                    </h4>
                    {b.unlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {b.desc}
                  </p>
                  <p className="text-[10px] num font-semibold text-junghyeon-teal pt-1">
                    {b.unlocked ? `Đạt ngày ${b.date}` : b.progress}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Leaderboard */}
        <div className="lg:col-span-5 rounded-3xl bg-card border border-border shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-junghyeon-yellow" />
              <span>Bảng vàng JungHyeon tuần này</span>
            </h3>
            <span className="text-xs text-muted-foreground">Top tuần</span>
          </div>

          <div className="space-y-2 pt-1">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  item.isMe
                    ? "bg-junghyeon-teal/15 border-junghyeon-teal shadow-soft ring-1 ring-junghyeon-teal"
                    : "bg-background border-border/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-extrabold text-sm text-muted-foreground font-num">
                    {item.medal || `#${item.rank}`}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-junghyeon-dark to-junghyeon-teal text-white flex items-center justify-center text-xs font-bold">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isMe && (
                        <span className="px-1.5 py-0.2 rounded-full bg-junghyeon-teal text-white text-[9px] font-bold">
                          BẠN
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-foreground font-num">
                  {item.xp} <span className="text-[10px] text-junghyeon-teal">XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Learning Goal & Commitment Settings */}
      <div id="cai-dat" className="rounded-3xl bg-card border border-border shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-junghyeon-coral" />
              <span>Tùy chỉnh mục tiêu & Thời lượng học</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Bạn có thể thay đổi bất cứ lúc nào để hệ thống sắp xếp nhắc nhở phù hợp nhất.
            </p>
          </div>
          <Link
            href="/profile/settings/learning"
            className="px-4 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Settings className="w-3.5 h-3.5 text-junghyeon-teal" />
            <span>Mở Cài đặt mục tiêu chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {editSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Đã cập nhật mục tiêu học tập thành công!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">Mục tiêu học chính</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as LearningGoal)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none transition-all"
            >
              <option value="study_abroad">Du học Hàn Quốc</option>
              <option value="employment">Xuất khẩu lao động / Công ty Hàn</option>
              <option value="topik">Chinh phục chứng chỉ TOPIK 1 - 6</option>
              <option value="kpop_culture">Xem phim K-Drama, K-Pop, Đu Idol</option>
              <option value="travel">Du lịch & Giao tiếp cơ bản</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">Cam kết thời gian mỗi ngày</label>
            <select
              value={commitment}
              onChange={(e) => setCommitment(Number(e.target.value) as DailyCommitment)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none transition-all"
            >
              <option value={10}>10 phút / ngày (Thong thả nhẹ nhàng 🌱)</option>
              <option value={20}>20 phút / ngày (Tiêu chuẩn vàng ⭐)</option>
              <option value={30}>30+ phút / ngày (Cấp tốc bức phá 🔥)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-junghyeon-teal hover:bg-junghyeon-teal-hover text-white text-xs sm:text-sm font-bold shadow-teal-glow transition-all active:scale-95"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
