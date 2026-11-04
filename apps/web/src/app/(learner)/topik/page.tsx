"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { playKoreanSpeech } from "@/lib/utils/speech";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  Award,
  Clock,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface TopikQuestion {
  id: number;
  section: "Nghe" | "Đọc";
  typeCategory: "Từ vựng" | "Ngữ pháp" | "Ý chính" | "Hội thoại";
  question: string;
  audioPrompt?: string;
  passage?: string; // Đoạn văn đọc
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

const TOPIK_1_QUESTIONS: TopikQuestion[] = [
  {
    id: 1,
    section: "Nghe",
    typeCategory: "Hội thoại",
    question: "Nghe đoạn hội thoại và chọn câu trả lời phù hợp nhất:",
    audioPrompt: "가: 어디에 가요? 나: 도서관에 가요.",
    options: [
      "도서관에 가요 (Tôi đi thư viện)",
      "책을 읽어요 (Tôi đọc sách)",
      "친구가 와요 (Bạn đến)",
      "학교가 커요 (Trường học to)",
    ],
    correctAnswer: "도서관에 가요 (Tôi đi thư viện)",
    explanation: "Người hỏi '어디에 가요?' (Bạn đi đâu thế?), câu trả lời đúng là chỉ địa điểm: '도서관에 가요.'",
    points: 4,
  },
  {
    id: 2,
    section: "Nghe",
    typeCategory: "Từ vựng",
    question: "Nghe và chọn đồ vật được nhắc đến trong đoạn băng:",
    audioPrompt: "이것은 사과입니다.",
    options: ["Quả táo (사과)", "Quả chuối (바나나)", "Bánh mì (빵)", "Sữa tươi (우유)"],
    correctAnswer: "Quả táo (사과)",
    explanation: "Người nói phát âm: '이것은 사과입니다' (Đây là quả táo).",
    points: 4,
  },
  {
    id: 3,
    section: "Đọc",
    typeCategory: "Ngữ pháp",
    question: "Chọn từ thích hợp điền vào chỗ trống: 저는 주말에 영화를 _____.",
    options: ["봤어요", "봤어요가", "보는", "봐서"],
    correctAnswer: "봤어요",
    explanation: "Đuôi câu kết thúc thì quá khứ thân mật là '봤어요' (Tôi đã xem phim).",
    points: 4,
  },
  {
    id: 4,
    section: "Đọc",
    typeCategory: "Từ vựng",
    question: "Đọc biển báo sau và cho biết đây là địa điểm nào: [진료 시간: 09:00 - 18:00 • 약국 옆]",
    options: ["Bệnh viện (병원)", "Ngân hàng (은행)", "Rạp phim (극장)", "Sân bay (공항)"],
    correctAnswer: "Bệnh viện (병원)",
    explanation: "'진료 시간' là giờ khám bệnh, '약국 옆' là bên cạnh hiệu thuốc -> Bệnh viện (병원).",
    points: 4,
  },
  {
    id: 5,
    section: "Đọc",
    typeCategory: "Ý chính",
    passage: "저는 한국 노래를 아주 좋아합니다. 그래서 매일 한국 노래를 듣고 한국어를 열심히 배웁니다.",
    question: "Nội dung chính của đoạn văn trên nói về điều gì?",
    options: [
      "Sở thích nghe nhạc Hàn và học tiếng Hàn",
      "Kế hoạch đi du lịch Hàn Quốc",
      "Công việc tại một công ty âm nhạc",
      "Gặp gỡ những người bạn Hàn Quốc",
    ],
    correctAnswer: "Sở thích nghe nhạc Hàn và học tiếng Hàn",
    explanation: "Đoạn văn nói thích bài hát Hàn (한국 노래) nên mỗi ngày đều nghe và chăm chỉ học tiếng Hàn.",
    points: 4,
  },
];

export default function TopikPage() {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 phút
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Đếm ngược thời gian thi thực tế
  useEffect(() => {
    if (!isExamStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamStarted, isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (qid: number, opt: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const handleSubmitExam = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3DBBA8", "#F5B93A", "#E8604C"],
    });
    setIsSubmitted(true);
  };

  // Tính điểm
  let totalScore = 0;
  const categoryStats: Record<string, { total: number; correct: number }> = {
    "Từ vựng": { total: 0, correct: 0 },
    "Ngữ pháp": { total: 0, correct: 0 },
    "Hội thoại": { total: 0, correct: 0 },
    "Ý chính": { total: 0, correct: 0 },
  };

  TOPIK_1_QUESTIONS.forEach((q) => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) totalScore += q.points;
    if (categoryStats[q.typeCategory]) {
      categoryStats[q.typeCategory].total += 1;
      if (isCorrect) categoryStats[q.typeCategory].correct += 1;
    }
  });

  const maxScore = TOPIK_1_QUESTIONS.reduce((acc, q) => acc + q.points, 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Header Phòng thi TOPIK */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-brand-primary dark:text-[#BFD9F7] text-xs font-semibold border border-[#D5E5FA] dark:border-white/10 shadow-2xs mb-2">
            <Award className="w-4 h-4 text-brand-primary" />
            <span>Đề thi mô phỏng Viện Giáo dục Quốc tế Hàn Quốc (NIIED)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-navy">
            Phòng thi thử TOPIK Online
          </h1>
          <p className="text-sm text-brand-secondary mt-1 max-w-2xl">
            Bấm giờ thực tế, cấu trúc đề thi chuẩn 100%, chấm điểm tự động và phân tích điểm yếu để bứt phá điểm số.
          </p>
        </div>
      </div>

      {!isExamStarted ? (
        // MÀN HÌNH CHỌN ĐỀ THI
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#EEF5FF]/40 dark:bg-brand-surface border-2 border-brand-primary shadow-xs space-y-4 relative flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold inline-block">
                TOPIK I (Cấp 1 - 2)
              </span>
              <h3 className="text-xl font-extrabold text-brand-navy">
                Đề thi thử TOPIK I - Kỳ 90
              </h3>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Bao gồm 2 phần thi Nghe (듣기) và Đọc (읽기). Đánh giá phản xạ giao tiếp đời sống cơ bản.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-brand-secondary font-num border-t border-brand-border/60">
                <span>⏱️ 40 phút</span>
                <span>📝 {TOPIK_1_QUESTIONS.length} câu mẫu</span>
                <span className="font-bold text-amber-600">💯 {maxScore} điểm</span>
              </div>
            </div>
            <button
              onClick={() => setIsExamStarted(true)}
              className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu làm bài thi</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-brand-secondary text-xs font-bold inline-block">
                TOPIK I
              </span>
              <h3 className="text-xl font-extrabold text-brand-navy">
                Đề thi thử TOPIK I - Kỳ 84
              </h3>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Đề thi chính thức đợt thi mùa thu với các dạng bài về số đếm, thời gian và địa điểm.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-brand-secondary font-num border-t border-brand-border/60">
                <span>⏱️ 40 phút</span>
                <span>⭐ Đạt chuẩn NIIED</span>
              </div>
            </div>
            <button
              onClick={() => setIsExamStarted(true)}
              className="w-full py-3 rounded-full bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border text-brand-navy dark:text-white text-xs font-bold hover:bg-[#F7F9FC] transition-all shadow-2xs mt-4"
            >
              Làm đề này
            </button>
          </div>

          <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#EEF5FF] dark:bg-brand-tint text-brand-primary text-xs font-bold inline-block">
                TOPIK II (Cấp 3 - 6)
              </span>
              <h3 className="text-xl font-extrabold text-brand-navy">
                Đề thi thử TOPIK II Trung cấp
              </h3>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Bao gồm cả phần thi Viết (쓰기). Dành cho học viên đang chuẩn bị hồ sơ du học D2.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-brand-secondary font-num border-t border-brand-border/60">
                <span>⏱️ 110 phút</span>
                <span>📚 Trung - Cao cấp</span>
              </div>
            </div>
            <button
              onClick={() => alert("Đề TOPIK II yêu cầu hoàn thành Sơ cấp 2 để mở khoá!")}
              className="w-full py-3 rounded-full bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border text-brand-secondary text-xs font-bold hover:bg-[#F7F9FC] transition-all shadow-2xs mt-4"
            >
              Yêu cầu hoàn thành Sơ cấp
            </button>
          </div>
        </div>
      ) : !isSubmitted ? (
        // GIAO DIỆN PHÒNG THI ĐANG LÀM BÀI
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột chính: Đề thi (8/12 cột) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-6">
            {/* Header câu hỏi đang hiển thị */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <span className="px-3.5 py-1 rounded-full bg-[#EEF5FF] dark:bg-brand-tint text-brand-primary text-xs font-bold">
                Phần thi: {TOPIK_1_QUESTIONS[currentQIndex].section} • {TOPIK_1_QUESTIONS[currentQIndex].typeCategory}
              </span>
              <span className="text-xs font-num font-bold text-brand-secondary">
                Câu {currentQIndex + 1} / {TOPIK_1_QUESTIONS.length}
              </span>
            </div>

            {/* Trình phát âm thanh cho phần Nghe */}
            {TOPIK_1_QUESTIONS[currentQIndex].audioPrompt && (
              <div className="p-4 rounded-2xl bg-[#EEF5FF]/60 dark:bg-brand-tint/40 border border-[#D5E5FA] dark:border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      playKoreanSpeech(
                        TOPIK_1_QUESTIONS[currentQIndex].audioPrompt || "",
                        0.9
                      )
                    }
                    className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                    title="Phát đoạn băng nghe"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                  <div className="text-xs">
                    <div className="font-bold text-brand-navy">Bấm để nghe đoạn băng phát âm</div>
                    <div className="text-brand-secondary">Nghe tối đa 2 lần như kỳ thi thật</div>
                  </div>
                </div>
              </div>
            )}

            {/* Đoạn văn đọc nếu có */}
            {TOPIK_1_QUESTIONS[currentQIndex].passage && (
              <div className="p-4 rounded-2xl bg-[#F7F9FC] dark:bg-white/5 border border-brand-border/70 text-sm font-korean font-semibold leading-relaxed text-brand-navy">
                {TOPIK_1_QUESTIONS[currentQIndex].passage}
              </div>
            )}

            {/* Đề câu hỏi */}
            <div className="text-base font-bold text-brand-navy">
              {TOPIK_1_QUESTIONS[currentQIndex].question}
            </div>

            {/* Danh sách 4 đáp án */}
            <div className="space-y-2.5">
              {TOPIK_1_QUESTIONS[currentQIndex].options.map((opt, i) => {
                const isSelected =
                  answers[TOPIK_1_QUESTIONS[currentQIndex].id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() =>
                      handleSelectOption(TOPIK_1_QUESTIONS[currentQIndex].id, opt)
                    }
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-[#EEF5FF] dark:bg-brand-tint border-brand-primary text-brand-navy shadow-2xs ring-2 ring-brand-primary/20"
                        : "bg-white dark:bg-brand-surface hover:bg-[#F7F9FC] dark:hover:bg-white/5 border-brand-border text-brand-secondary hover:text-brand-navy"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 text-brand-navy dark:text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Nút chuyển câu */}
            <div className="pt-4 flex items-center justify-between border-t border-brand-border">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(currentQIndex - 1)}
                className="px-5 py-2.5 rounded-full border border-brand-border text-xs font-bold text-brand-secondary hover:text-brand-navy disabled:opacity-40"
              >
                Câu trước
              </button>

              {currentQIndex < TOPIK_1_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(currentQIndex + 1)}
                  className="px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-sm"
                >
                  Câu kế tiếp
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  Nộp bài thi
                </button>
              )}
            </div>
          </div>

          {/* Cột phải: Đồng hồ đếm ngược & Bảng câu hỏi (4/12 cột) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-4 text-center">
              <span className="text-xs text-brand-secondary uppercase tracking-wider font-bold">
                Thời gian làm bài còn lại
              </span>
              <div className="text-3xl font-extrabold text-brand-primary num-tabular flex items-center justify-center gap-2">
                <Clock className="w-7 h-7" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Bảng điều hướng câu hỏi (Question Navigator) */}
              <div className="pt-2 border-t border-brand-border space-y-2">
                <span className="text-xs font-bold text-brand-navy text-left block">
                  Bảng danh sách câu:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {TOPIK_1_QUESTIONS.map((q, idx) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isCurrent = currentQIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`h-9 rounded-xl text-xs font-bold num-tabular transition-all ${
                          isCurrent
                            ? "bg-brand-primary text-white shadow-2xs ring-2 ring-brand-primary/40"
                            : isAnswered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                            : "bg-slate-100 dark:bg-white/10 text-brand-secondary hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleSubmitExam}
                className="w-full py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                Nộp bài thi sớm
              </button>
            </div>
          </div>
        </div>
      ) : (
        // MÀN HÌNH KẾT QUẢ & PHÂN TÍCH ĐIỂM YẾU
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
          {/* Bảng điểm tổng quan */}
          <div className="p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-card text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center mx-auto shadow-2xs">
              <MascotHoney mood="celebrate" size={76} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Kết quả bài thi thử
              </span>
              <h2 className="text-3xl font-extrabold text-brand-navy">
                {totalScore >= 16 ? "Đạt chuẩn TOPIK 1 Cấp 2 🎉" : "Đạt chuẩn TOPIK 1 Cấp 1 👍"}
              </h2>
              <div className="text-3xl font-extrabold text-amber-600 dark:text-yellow-400 font-num mt-1">
                {totalScore} / {maxScore} điểm
              </div>
            </div>

            {/* Phân tích điểm yếu theo từng dạng câu hỏi */}
            <div className="pt-4 border-t border-brand-border space-y-3 text-left">
              <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-brand-primary" />
                <span>Phân tích năng lực chi tiết (Thống kê điểm yếu):</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(categoryStats).map(([cat, stat]) => {
                  const percent = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  return (
                    <div key={cat} className="p-3.5 rounded-2xl bg-[#EEF5FF] dark:bg-brand-tint border border-[#D5E5FA] dark:border-brand-border space-y-1">
                      <span className="text-xs font-bold text-brand-navy block">{cat}</span>
                      <div className="text-lg font-extrabold font-num text-brand-primary">
                        {percent}%
                      </div>
                      <span className="text-[10px] text-brand-secondary">
                        {stat.correct} / {stat.total} câu
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsExamStarted(false);
                  setIsSubmitted(false);
                  setAnswers({});
                  setTimeLeft(40 * 60);
                }}
                className="px-6 py-2.5 rounded-full border border-brand-border text-xs font-bold text-brand-navy hover:bg-[#F7F9FC] flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-primary" />
                <span>Thi lại đề khác</span>
              </button>
            </div>
          </div>

          {/* Xem lại toàn bộ câu hỏi và đáp án chi tiết */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-brand-navy">
              Xem lại chi tiết đáp án và lời giải:
            </h3>

            <div className="space-y-3">
              {TOPIK_1_QUESTIONS.map((q, idx) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                      isCorrect
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                        : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-brand-navy">
                      <span className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <span>Câu {idx + 1}: {q.question}</span>
                      </span>
                      <span className="num text-xs font-semibold">{q.points} điểm</span>
                    </div>

                    <div className="text-xs space-y-1 pl-6">
                      <p className="text-brand-secondary">
                        Đáp án của bạn: <strong className={isCorrect ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>{userAns || "(Chưa chọn)"}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                          Đáp án đúng: <strong>{q.correctAnswer}</strong>
                        </p>
                      )}
                      <p className="text-brand-secondary italic pt-1">
                        💡 Giải thích: {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
