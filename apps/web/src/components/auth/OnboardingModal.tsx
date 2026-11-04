"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  useAuth,
  LearningGoal,
  CurrentLevel,
  DailyCommitment,
} from "@/lib/context/AuthContext";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Award,
  Music,
  Plane,
  Clock,
} from "lucide-react";

export function OnboardingModal() {
  const { isOnboardingOpen, setOnboardingOpen, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal>("study_abroad");
  const [selectedLevel, setSelectedLevel] = useState<CurrentLevel>("zero");
  const [selectedCommitment, setSelectedCommitment] = useState<DailyCommitment>(20);

  if (!isOnboardingOpen) return null;

  const goalOptions = [
    {
      id: "study_abroad" as LearningGoal,
      title: "Du học Hàn Quốc",
      desc: "Cần bằng TOPIK 3-4, phỏng vấn Visa & giao tiếp học thuật",
      icon: GraduationCap,
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "employment" as LearningGoal,
      title: "Xuất khẩu lao động & Doanh nghiệp Hàn",
      desc: "Thi EPS-TOPIK, giao tiếp nhà xưởng, văn hóa công sở",
      icon: Briefcase,
      color: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      id: "topik" as LearningGoal,
      title: "Chinh phục chứng chỉ TOPIK 1 - 6",
      desc: "Học bài bản, luyện đề thi thử có chấm điểm chi tiết",
      icon: Award,
      color: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      id: "kpop_culture" as LearningGoal,
      title: "Xem phim K-Drama & Nghe nhạc K-Pop",
      desc: "Không cần phụ đề, đu idol, hiểu văn hoá đời sống",
      icon: Music,
      color: "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      id: "travel" as LearningGoal,
      title: "Du lịch & Giao tiếp cơ bản",
      desc: "Hỏi đường, gọi món, đi tàu điện ngầm, mua sắm",
      icon: Plane,
      color: "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
  ];

  const levelOptions = [
    {
      id: "zero" as CurrentLevel,
      title: "Người mới bắt đầu từ số 0",
      desc: "Chưa từng học tiếng Hàn, chưa biết bảng chữ cái Hangul",
      badge: "Mới tinh",
    },
    {
      id: "hangul" as CurrentLevel,
      title: "Đã thuộc bảng chữ Hangul",
      desc: "Đọc được chữ chậm rãi nhưng chưa biết ghép câu và từ vựng",
      badge: "Làm quen",
    },
    {
      id: "beginner" as CurrentLevel,
      title: "Đã học xong Sơ cấp (TOPIK 1 - 2)",
      desc: "Nắm được cấu trúc câu cơ bản -아요/어요, muốn học lên Trung cấp",
      badge: "Sơ cấp",
    },
    {
      id: "intermediate" as CurrentLevel,
      title: "Trung cấp trở lên (TOPIK 3 - 4)",
      desc: "Giao tiếp khá, muốn nâng cao kỹ năng viết văn & đọc hiểu nhanh",
      badge: "Trung cấp",
    },
  ];

  const commitmentOptions = [
    {
      minutes: 10 as DailyCommitment,
      title: "10 phút / ngày",
      desc: "Học nhẹ nhàng, tích tiểu thành đại. Rất phù hợp người bận rộn.",
      label: "Thong thả 🌱",
    },
    {
      minutes: 20 as DailyCommitment,
      title: "20 phút / ngày",
      desc: "Lộ trình chuẩn vàng được khuyên dùng để ghi nhớ sâu nhất.",
      label: "Khuyên dùng ⭐",
      recommended: true,
    },
    {
      minutes: 30 as DailyCommitment,
      title: "30+ phút / ngày",
      desc: "Tăng tốc bức phá. Chinh phục TOPIK nhanh gấp đôi thời gian thường.",
      label: "Cấp tốc 🔥",
    },
  ];

  const handleFinish = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3DBBA8", "#F5B93A", "#E8604C"],
    });

    completeOnboarding({
      goal: selectedGoal,
      level: selectedLevel,
      dailyGoalMinutes: selectedCommitment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>Thiết lập lộ trình học cá nhân hóa</span>
            <span className="text-junghyeon-teal">Bước {step} / 3</span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-junghyeon-teal to-emerald-400 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: LEARNING GOAL */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <MascotHoney mood="wave" size={38} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                  Mục tiêu học tiếng Hàn của bạn là gì?
                </h3>
                <p className="text-xs text-muted-foreground">
                  JungHyeon sẽ tối ưu bài học sát nhất với mong muốn của bạn.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {goalOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGoal(opt.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-junghyeon-teal bg-junghyeon-teal/10 shadow-soft ring-2 ring-junghyeon-teal/20"
                        : "border-border bg-background hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${opt.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-foreground">
                          {opt.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-junghyeon-teal shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: CURRENT LEVEL */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
                <MascotHoney mood="study" size={38} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                  Trình độ tiếng Hàn hiện tại của bạn?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Đừng lo nếu bạn chưa biết gì, 80% học viên bắt đầu từ số 0!
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {levelOptions.map((opt) => {
                const isSelected = selectedLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedLevel(opt.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-junghyeon-teal bg-junghyeon-teal/10 shadow-soft ring-2 ring-junghyeon-teal/20"
                        : "border-border bg-background hover:bg-secondary/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-foreground">
                          {opt.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-semibold text-muted-foreground">
                          {opt.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-junghyeon-teal shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: DAILY COMMITMENT */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <MascotHoney mood="celebrate" size={38} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                  Mỗi ngày bạn muốn dành bao nhiêu phút?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Học đều đặn mỗi ngày quan trọng hơn học dồn một bữa.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {commitmentOptions.map((opt) => {
                const isSelected = selectedCommitment === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    type="button"
                    onClick={() => setSelectedCommitment(opt.minutes)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? "border-junghyeon-coral bg-junghyeon-coral/10 shadow-soft ring-2 ring-junghyeon-coral/20"
                        : "border-border bg-background hover:bg-secondary/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-junghyeon-coral" />
                        <span className="text-sm font-bold text-foreground">
                          {opt.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-junghyeon-coral/15 text-junghyeon-coral font-bold">
                          {opt.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {opt.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-junghyeon-coral shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Welcome XP bonus banner */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Hoàn thành khảo sát để nhận ngay <strong>+30 XP</strong> vào Cây JungHyeon!
              </span>
            </div>
          </div>
        )}

        {/* Step buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border/80">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-secondary text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOnboardingOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Bỏ qua bước này
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-junghyeon-teal hover:bg-junghyeon-teal-hover text-white text-xs font-bold shadow-teal-glow transition-all active:scale-95 ml-auto"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white text-xs sm:text-sm font-bold shadow-coral-glow transition-all active:scale-95 ml-auto"
            >
              <span>Bắt đầu học ngay!</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
