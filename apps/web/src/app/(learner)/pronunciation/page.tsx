"use client";

import React, { useState } from "react";
import { playKoreanSpeech } from "@/lib/utils/speech";
import {
  Volume2,
  Mic,
  Languages,
} from "lucide-react";

// Interactive Hangul vowels data
const HANGUL_VOWELS = [
  { char: "ㅏ", romaja: "a", name: "Nguyên âm A" },
  { char: "ㅑ", romaja: "ya", name: "Nguyên âm Ya" },
  { char: "ㅓ", romaja: "eo", name: "Nguyên âm Ơ" },
  { char: "ㅕ", romaja: "yeo", name: "Nguyên âm Yơ" },
  { char: "ㅗ", romaja: "o", name: "Nguyên âm Ô" },
  { char: "ㅛ", romaja: "yo", name: "Nguyên âm Yô" },
  { char: "ㅜ", romaja: "u", name: "Nguyên âm U" },
  { char: "ㅠ", romaja: "yu", name: "Nguyên âm Yu" },
  { char: "ㅡ", romaja: "eu", name: "Nguyên âm Ư" },
  { char: "ㅣ", romaja: "i", name: "Nguyên âm I" },
  { char: "ㅐ", romaja: "ae", name: "Nguyên âm E" },
  { char: "ㅔ", romaja: "e", name: "Nguyên âm Ê" },
];

// Interactive Hangul consonants data
const HANGUL_CONSONANTS = [
  { char: "ㄱ", romaja: "g/k", name: "Âm cờ/k" },
  { char: "ㄴ", romaja: "n", name: "Âm nờ" },
  { char: "ㄷ", romaja: "d/t", name: "Âm đờ/t" },
  { char: "ㄹ", romaja: "r/l", name: "Âm r/l" },
  { char: "ㅁ", romaja: "m", name: "Âm mờ" },
  { char: "ㅂ", romaja: "b/p", name: "Âm bờ/p" },
  { char: "ㅅ", romaja: "s", name: "Âm sờ" },
  { char: "ㅇ", romaja: "ng", name: "Âm câm/ngờ" },
  { char: "ㅈ", romaja: "j/ch", name: "Âm chờ" },
  { char: "ㅊ", romaja: "ch'", name: "Âm bật hơi ch" },
  { char: "ㅋ", romaja: "k'", name: "Âm bật hơi k" },
  { char: "ㅌ", romaja: "t'", name: "Âm bật hơi t" },
  { char: "ㅍ", romaja: "p'", name: "Âm bật hơi p" },
  { char: "ㅎ", romaja: "h", name: "Âm hờ" },
];

const PRACTICE_SENTENCES = [
  { korean: "안녕하세요", meaning: "Xin chào", vietnamese: "Xin chào", difficulty: "Dễ" },
  { korean: "감사합니다", meaning: "Cảm ơn", vietnamese: "Cảm ơn", difficulty: "Dễ" },
  { korean: "한국어를 공부해요", meaning: "Tôi học tiếng Hàn", vietnamese: "Tôi học tiếng Hàn", difficulty: "Trung bình" },
  { korean: "만나서 반갑습니다", meaning: "Rất vui được gặp bạn", vietnamese: "Rất vui được gặp bạn", difficulty: "Trung bình" },
  { korean: "맛있게 드세요", meaning: "Chúc bạn ngon miệng", vietnamese: "Chúc bạn ngon miệng", difficulty: "Khó" },
];

export default function PronunciationPage() {
  const [selectedPracticeSentence, setSelectedPracticeSentence] = useState(
    PRACTICE_SENTENCES[0]
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordedScore, setRecordedScore] = useState<number | null>(null);
  const [recordedFeedback, setRecordedFeedback] = useState<string>("");

  // Simulated recording and pitch waveform comparison
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedScore(null);
    setRecordedFeedback("");

    // Simulate 2.5 second audio capture
    setTimeout(() => {
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 14) + 85;
      setRecordedScore(randomScore);

      if (randomScore >= 92) {
        setRecordedFeedback("Phát âm xuất sắc! Ngữ điệu và độ bật hơi rất chuẩn giọng Seoul.");
      } else {
        setRecordedFeedback("Khá tốt! Bạn hãy chú ý kéo dài nguyên âm và bật hơi nhẹ nhàng hơn.");
      }
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* 1. Pronunciation Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-brand-primary dark:text-[#BFD9F7] text-xs font-semibold border border-[#D5E5FA] dark:border-white/10 shadow-2xs mb-2">
            <Languages className="w-4 h-4 text-brand-primary" />
            <span>Phát âm chuẩn giọng Seoul</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-navy">
            Bảng Hangul & Luyện phát âm thông minh
          </h1>
          <p className="text-sm text-brand-secondary mt-1 max-w-2xl">
            Bấm để nghe từng nguyên âm, phụ âm. Luyện khẩu hình miệng và so sánh giọng đọc của bạn qua Micro.
          </p>
        </div>
      </div>

      {/* 2. Waveform Microphone Practice Box */}
      <div className="p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] bg-[#EEF5FF] dark:bg-[#111F36] border border-[#D5E5FA] dark:border-[#1E3252] shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-[#D5E5FA] dark:border-white/10 text-xs font-semibold text-brand-primary shadow-2xs">
              <Mic className="w-3.5 h-3.5 text-brand-primary" />
              <span>Phân tích giọng nói bằng AI Speech</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-brand-secondary font-medium">Câu mẫu đang luyện:</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-korean tracking-wide">
                {selectedPracticeSentence.korean}
              </div>
              <p className="text-sm text-brand-primary font-semibold">
                Nghĩa: {selectedPracticeSentence.meaning || selectedPracticeSentence.vietnamese}
              </p>
            </div>

            {/* Simulated audio waveform visualizer */}
            <div className="h-16 rounded-2xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border flex items-center justify-center gap-1.5 px-4 overflow-hidden shadow-2xs">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-brand-primary transition-all duration-150 ${
                    isRecording
                      ? "animate-pulse h-10"
                      : recordedScore
                      ? "h-6 opacity-75"
                      : "h-2 opacity-30"
                  }`}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    height: isRecording ? `${Math.sin(i) * 20 + 25}px` : undefined,
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => playKoreanSpeech(selectedPracticeSentence.korean)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-brand-surface hover:bg-[#F7F9FC] text-brand-navy dark:text-white font-bold text-xs border border-[#D5E5FA] dark:border-brand-border shadow-2xs transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-amber-500" />
                <span>Nghe âm mẫu</span>
              </button>

              <button
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs text-white shadow-sm hover:shadow-md transition-all active:scale-95 ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-brand-primary hover:bg-brand-primary-hover"
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? "Đang lắng nghe..." : "Bấm để thu âm"}</span>
              </button>
            </div>

            {/* Scoring & Feedback */}
            {recordedScore !== null && (
              <div className="p-4 rounded-2xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border space-y-1 shadow-2xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-primary">
                    Độ tương đồng phát âm:
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 font-num">
                    {recordedScore}% chuẩn xác
                  </span>
                </div>
                <p className="text-xs text-brand-secondary">{recordedFeedback}</p>
              </div>
            )}
          </div>

          {/* Practice Sentence Selection List */}
          <div className="lg:col-span-5 bg-white dark:bg-brand-surface rounded-2xl sm:rounded-3xl p-5 border border-[#D5E5FA] dark:border-brand-border shadow-xs space-y-2.5">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Chọn câu luyện khẩu hình:
            </span>
            <div className="space-y-1.5">
              {PRACTICE_SENTENCES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPracticeSentence(s);
                    setRecordedScore(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs ${
                    selectedPracticeSentence.korean === s.korean
                      ? "bg-[#EEF5FF] dark:bg-brand-tint border border-brand-primary/40 text-brand-navy font-bold shadow-2xs"
                      : "hover:bg-[#F7F9FC] dark:hover:bg-white/5 border border-transparent text-brand-secondary"
                  }`}
                >
                  <div>
                    <div className="font-korean font-semibold">{s.korean}</div>
                    <div className="text-[10px] text-brand-muted">{s.meaning || s.vietnamese}</div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 border border-brand-border font-medium">
                    {s.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Hangul Vowels Chart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
            Bảng Nguyên âm Hangul (Bấm để nghe)
          </h2>
          <span className="text-xs text-brand-secondary">12 nguyên âm cơ bản</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {HANGUL_VOWELS.map((item) => (
            <button
              key={item.char}
              onClick={() => playKoreanSpeech(item.char, 0.8)}
              className="p-4 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 hover:border-brand-primary hover:shadow-card transition-all text-center space-y-1 group active:scale-95"
            >
              <div className="font-korean font-extrabold text-3xl text-brand-navy group-hover:text-brand-primary transition-colors">
                {item.char}
              </div>
              <div className="text-xs font-semibold text-brand-primary">
                {item.romaja}
              </div>
              <div className="text-[10px] text-brand-muted">{item.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Hangul Consonants Chart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
            Bảng Phụ âm Hangul (Bấm để nghe)
          </h2>
          <span className="text-xs text-brand-secondary">14 phụ âm cơ bản</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {HANGUL_CONSONANTS.map((item) => (
            <button
              key={item.char}
              onClick={() => playKoreanSpeech(item.char + "ㅏ", 0.8)}
              className="p-4 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 hover:border-brand-primary hover:shadow-card transition-all text-center space-y-1 group active:scale-95"
            >
              <div className="font-korean font-extrabold text-3xl text-brand-navy group-hover:text-brand-primary transition-colors">
                {item.char}
              </div>
              <div className="text-xs font-semibold text-brand-primary">
                {item.romaja}
              </div>
              <div className="text-[10px] text-brand-muted">{item.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Essential Pronunciation Rules */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-brand-navy">
          3 Quy tắc biến âm & Nối vần quan trọng nhất
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#EEF5FF] dark:bg-brand-tint border border-[#D5E5FA] dark:border-brand-border space-y-1.5">
            <span className="font-bold text-brand-primary">1. Quy tắc Nối âm (연음)</span>
            <p className="text-brand-secondary leading-relaxed">
              Khi từ trước có patchim gặp từ sau bắt đầu bằng phụ âm câm &apos;ㅇ&apos;, patchim sẽ được chuyển sang đọc nối vào âm tiết sau.
            </p>
            <div className="p-2 rounded-xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border font-korean text-[11px] font-bold text-brand-navy">
              한국어 [한구거] • 음악 [으막]
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
            <span className="font-bold text-amber-700 dark:text-amber-400">2. Quy tắc Mũi hoá (비음화)</span>
            <p className="text-brand-secondary leading-relaxed">
              Khi các patchim ㄱ, ㄷ, ㅂ gặp phụ âm ㄴ, ㅁ ở từ kế tiếp, chúng sẽ biến âm thành ㅇ, ㄴ, ㅁ tương ứng.
            </p>
            <div className="p-2 rounded-xl bg-white dark:bg-brand-surface border border-amber-200 dark:border-amber-900/40 font-korean text-[11px] font-bold text-brand-navy">
              감사합니다 [감사함니다]
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1.5">
            <span className="font-bold text-blue-700 dark:text-blue-400">3. Hiện tượng Căng âm (경음화)</span>
            <p className="text-brand-secondary leading-relaxed">
              Khi các patchim ㄱ, ㄷ, ㅂ đứng trước các phụ âm ㄱ, ㄷ, ㅂ, ㅅ, ㅈ, các phụ âm này sẽ đọc căng giọng (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ).
            </p>
            <div className="p-2 rounded-xl bg-white dark:bg-brand-surface border border-blue-200 dark:border-blue-900/40 font-korean text-[11px] font-bold text-brand-navy">
              식당 [식땅] • 학교 [학꾜]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
