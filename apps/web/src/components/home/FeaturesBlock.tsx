"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  SectionHeading,
  UnderlineTabs,
  FeaturePanel,
  MockupFrame,
  LevelBadge,
  ScoreDisplay,
  Badge,
  Button,
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/shared";
import { MascotHoney } from "@/components/shared/MascotHoney";
import { playKoreanSpeech } from "@/lib/utils/speech";
import {
  Mic,
  FileEdit,
  Bot,
  PlayCircle,
  Volume2,
  Sparkles,
  CheckCircle2,
  Layers,
  Radio,
} from "lucide-react";

export function FeaturesBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<string>("speaking");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const tabs = [
    {
      id: "speaking",
      label: isEn ? "Virtual Speaking Room" : "Phòng luyện nói chuẩn Seoul",
      isPro: true,
      icon: <Mic className="w-4 h-4 text-brand-primary" />,
    },
    {
      id: "writing",
      label: isEn ? "TOPIK Writing Room" : "Chữa bài viết TOPIK",
      icon: <FileEdit className="w-4 h-4 text-brand-primary" />,
    },
    {
      id: "honey",
      label: isEn ? "Honey AI Tutor" : "Trợ lý hổ Honey AI",
      badge: <Badge variant="tint" size="sm">24/7</Badge>,
      icon: <Bot className="w-4 h-4 text-brand-primary" />,
    },
    {
      id: "lessons",
      label: isEn ? "SRS Video Lessons" : "Bài học SRS thông minh",
      icon: <PlayCircle className="w-4 h-4 text-brand-primary" />,
    },
  ];

  const handleSpeakSample = () => {
    setIsPlayingAudio(true);
    playKoreanSpeech("만나서 반갑습니다", 0.85);
    setTimeout(() => setIsPlayingAudio(false), 1600);
  };

  return (
    <section id="features-section" className="py-20 sm:py-24 bg-brand-bg transition-colors overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Heading with word-by-word reveal */}
        <SectionHeading
          eyebrow={<Badge variant="tint">{isEn ? "Exclusive Capabilities" : "Tính năng độc quyền"}</Badge>}
          title={
            isEn
              ? "Experience <hl>Exclusive Tools</hl> for Accelerated Fluency"
              : "Trải nghiệm tính năng <hl>độc quyền</hl> giúp bứt phá tiếng Hàn"
          }
          subtitle={
            isEn
              ? "Cutting-edge language technology tailored specifically for Vietnamese learners: real-time phoneme feedback, automated TOPIK grading, and AI Tiger coaching."
              : "Hệ thống học tập ứng dụng công nghệ giáo dục hiện đại: phân tích ngữ âm tức thì, phòng chấm viết TOPIK và người bạn đồng hành Honey AI."
          }
        />

        {/* Underline Tabs with scroll-in animation */}
        <ScrollReveal animation="fade-up" delay={0.1} distance={20} className="flex justify-center">
          <UnderlineTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            layoutId="featuresTabUnderline"
            className="max-w-4xl w-full"
          />
        </ScrollReveal>

        {/* Tab Panel Content with Smooth Stagger Reveal */}
        <div className="relative min-h-[460px]">
          <AnimatePresence mode="wait">
            {activeTab === "speaking" && (
              <motion.div
                key="speaking"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                <div className="lg:col-span-6 flex">
                  <FeaturePanel
                    variant="tint"
                    isPro={true}
                    proLabel="PRO Speaking"
                    title={
                      isEn
                        ? "Seoul Accent Speech Analyzer"
                        : "Phòng luyện phát âm chuẩn ngữ điệu Seoul"
                    }
                    description={
                      isEn
                        ? "Practice Korean syllables with real-time waveform feedback. The AI compares your pitch, intonation, and vowel clarity directly against Seoul native speakers."
                        : "Luyện phát âm từng âm tiết và ngữ điệu với công nghệ AI độc quyền. Tự động nhận diện lỗi sai phát âm của người Việt và hướng dẫn đặt khẩu hình chuẩn xác."
                    }
                    bullets={[
                      {
                        title: isEn ? "Phoneme-level accuracy scoring" : "Chấm điểm chuẩn xác từng âm tiết trong 0.5s",
                        description: isEn ? "Identify tricky batchim and vowel differences" : "Chỉ ra lỗi nhầm lẫn phụ âm cuối (Batchim) và nguyên âm đôi",
                      },
                      {
                        title: isEn ? "Intonation waveform comparison" : "So sánh biểu đồ sóng âm ngữ điệu với người bản xứ",
                        description: isEn ? "Master natural sentence cadence and honorific endings" : "Luyện nói tự nhiên các đuôi câu kính ngữ -습니다/습니까",
                      },
                      {
                        title: isEn ? "Unlimited speech practice sessions" : "Không giới hạn số lượt thu âm luyện tập",
                        isPro: true,
                      },
                    ]}
                    ctaText={isEn ? "Open Speaking Room" : "Khám phá phòng luyện nói"}
                    ctaHref="/pronunciation"
                  />
                </div>

                <div className="lg:col-span-6 flex items-center justify-center">
                  <MockupFrame
                    title="Seoul Speech Analyzer • JungHyeon AI"
                    className="w-full"
                    badge={
                      <Badge variant="success" size="sm" className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Live AI</span>
                      </Badge>
                    }
                  >
                    <div className="space-y-6 text-center py-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-xs text-brand-secondary">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{isEn ? "Lesson 14: Daily Greetings" : "Bài 14: Giao tiếp hàng ngày"}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-3">
                          <div className="text-3xl sm:text-4xl font-extrabold font-korean text-brand-navy">
                            만나서 반갑습니다
                          </div>
                          <button
                            type="button"
                            onClick={handleSpeakSample}
                            title="Nghe phát âm mẫu"
                            className={`p-2 rounded-full border border-brand-border bg-brand-surface hover:bg-brand-tint text-brand-primary transition-all duration-200 active:scale-95 ${
                              isPlayingAudio ? "ring-2 ring-brand-primary scale-110" : ""
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-brand-muted">
                          Mannaseo bangapseumnida • Rất vui được gặp bạn
                        </p>
                      </div>

                      {/* Mockup Audio Waveform with dynamic wave animation */}
                      <div className="h-14 rounded-2xl bg-brand-tint/60 border border-brand-frame/60 flex items-center justify-center gap-1.5 px-6">
                        {[40, 65, 80, 50, 95, 75, 45, 90, 85, 60, 40, 70, 85, 55, 30].map(
                          (h, i) => (
                            <motion.span
                              key={i}
                              className="w-1.5 bg-brand-primary rounded-full"
                              animate={{
                                height: [
                                  `${Math.max(20, h * 0.4)}%`,
                                  `${h}%`,
                                  `${Math.max(25, h * 0.65)}%`,
                                ],
                              }}
                              transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 1.1 + (i % 4) * 0.25,
                                ease: "easeInOut",
                                delay: i * 0.06,
                              }}
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>

                      {/* Score display & Level badge */}
                      <div className="flex items-center justify-around pt-2 border-t border-brand-border">
                        <ScoreDisplay score={194} maxScore={200} label={isEn ? "Accent Accuracy" : "Độ chuẩn xác"} />
                        <LevelBadge level="6" label="Seoul" progressPercent={92} showRing size="md" />
                      </div>
                    </div>
                  </MockupFrame>
                </div>
              </motion.div>
            )}

            {activeTab === "writing" && (
              <motion.div
                key="writing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                <div className="lg:col-span-6 flex">
                  <FeaturePanel
                    variant="tint"
                    title={
                      isEn
                        ? "TOPIK II Essay Correction Engine"
                        : "Chấm chữa bài viết TOPIK II (Câu 51 - 54)"
                    }
                    description={
                      isEn
                        ? "Get comprehensive feedback on grammar accuracy, vocabulary sophistication, and paragraph coherence aligned with the official NIIED scoring rubric."
                        : "Hệ thống hỗ trợ sửa bài viết học thuật theo barem điểm chính thức của Viện Giáo dục Quốc tế Hàn Quốc (NIIED). Phát hiện lỗi ngữ pháp và gợi ý từ vựng cao cấp."
                    }
                    bullets={[
                      {
                        title: isEn ? "Grammar & spelling linting" : "Sửa lỗi chính tả, trợ từ và khoảng cách viết (띄어쓰기)",
                      },
                      {
                        title: isEn ? "High-level vocabulary suggestions" : "Gợi ý nâng cấp từ vựng trung - cao cấp (TOPIK 5-6)",
                      },
                      {
                        title: isEn ? "Model sample essay library" : "Kho bài viết mẫu đạt điểm tối đa kèm phân tích cấu trúc",
                      },
                    ]}
                    ctaText={isEn ? "Practice TOPIK Writing" : "Luyện thi thử TOPIK ngay"}
                    ctaHref="/topik"
                  />
                </div>

                <div className="lg:col-span-6 flex items-center justify-center">
                  <MockupFrame
                    title="TOPIK II Writing Assistant • Câu 54"
                    className="w-full"
                    badge={<Badge variant="warning" size="sm">Score: 48/50</Badge>}
                  >
                    <div className="space-y-4 text-left py-2 text-xs">
                      <div className="p-3 rounded-xl bg-brand-surface border border-brand-border space-y-1">
                        <span className="font-bold text-brand-navy">Chủ đề: 현대 사회와 스트레스 (Xã hội hiện đại và stress)</span>
                        <p className="text-brand-secondary text-[11px] leading-relaxed font-korean">
                          스트레스는 현대인에게 피할 수 없는 문제이다... <span className="bg-amber-100 dark:bg-amber-950/60 px-1 rounded text-amber-800 dark:text-amber-300 font-semibold underline decoration-wavy decoration-amber-500">따라서</span> 적절한 해소법이 요구된다.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-brand-navy">
                          <span>Tiêu chí đánh giá NIIED</span>
                          <span className="text-brand-primary font-bold">96%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-surface border border-brand-border overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "96%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-brand-primary rounded-full"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Mạch lập luận chặt chẽ, sử dụng đúng cấu trúc nguyên nhân - kết quả.</span>
                      </div>
                    </div>
                  </MockupFrame>
                </div>
              </motion.div>
            )}

            {activeTab === "honey" && (
              <motion.div
                key="honey"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                <div className="lg:col-span-6 flex">
                  <FeaturePanel
                    variant="tint"
                    title={
                      isEn
                        ? "Honey AI: Your 24/7 Tiger Study Companion"
                        : "Honey AI: Người bạn đồng hành học tập 24/7"
                    }
                    description={
                      isEn
                        ? "Never study alone! Honey helps you review flashcards, explains grammatical nuances in Vietnamese, and motivates your daily learning streak."
                        : "Giải đáp tức thì mọi thắc mắc ngữ pháp, nhắc nhở ôn bài mỗi ngày và cùng bạn duy trì chuỗi học tập (Streak) để tích lũy XP nuôi cây JungHyeon."
                    }
                    bullets={[
                      {
                        title: isEn ? "Native bilingual explanations" : "Giải thích ngữ pháp bằng tiếng Việt dễ hiểu, có ví dụ thực tế",
                      },
                      {
                        title: isEn ? "Daily spaced repetition reminders" : "Nhắc nhở ôn đúng từ vựng sắp quên theo chu kỳ SRS",
                      },
                      {
                        title: isEn ? "Streak rewards and gamified XP" : "Tặng huy hiệu và phần thưởng khi duy trì học đều đặn",
                      },
                    ]}
                    ctaText={isEn ? "Talk to Honey" : "Trò chuyện cùng Honey"}
                    ctaHref="/consultation"
                  />
                </div>

                <div className="lg:col-span-6 flex items-center justify-center">
                  <MockupFrame
                    title="Honey AI Chat • Trợ lý tiếng Hàn"
                    className="w-full"
                    badge={<Badge variant="free" size="sm">Active</Badge>}
                  >
                    <div className="space-y-3 py-2 text-xs">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2 items-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <MascotHoney size={32} mood="wave" />
                        </div>
                        <div className="p-3 rounded-2xl bg-brand-surface border border-brand-border text-brand-body leading-relaxed max-w-[85%] rounded-tl-xs">
                          Annyeong! Bạn có biết cấu trúc <strong>-(으)ㄹ 텐데</strong> dùng để thể hiện sự phỏng đoán kèm tiếc nuối không? Để Honey lấy ví dụ nhé!
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        className="flex justify-end"
                      >
                        <div className="p-2.5 rounded-2xl bg-brand-primary text-white max-w-[80%] rounded-tr-xs">
                          Cho mình thêm 2 câu ví dụ thực tế đi Honey!
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="flex gap-2 items-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <MascotHoney size={32} mood="study" />
                        </div>
                        <div className="p-3 rounded-2xl bg-brand-surface border border-brand-border text-brand-body leading-relaxed max-w-[85%] rounded-tl-xs">
                          1. 비가 올 텐데 우산을 가져가세요. (Trời chắc sẽ mưa đấy, bạn nhớ mang ô nhé!) ☔
                        </div>
                      </motion.div>
                    </div>
                  </MockupFrame>
                </div>
              </motion.div>
            )}

            {activeTab === "lessons" && (
              <motion.div
                key="lessons"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                <div className="lg:col-span-6 flex">
                  <FeaturePanel
                    variant="tint"
                    title={
                      isEn
                        ? "Spaced Repetition & Micro-Lesson Path"
                        : "Lộ trình bài học vi mô & Thuật toán SRS SM-2"
                    }
                    description={
                      isEn
                        ? "Learn in bite-sized 10-minute sessions. The SuperMemo SM-2 algorithm schedules flashcard reviews right when your brain is about to forget."
                        : "Mỗi bài học được chia nhỏ tinh gọn 10 - 15 phút. Thuật toán Spaced Repetition liên tục tính toán khoảng quên của bạn để đưa ra bài ôn đúng thời điểm vàng."
                    }
                    bullets={[
                      {
                        title: isEn ? "120+ structured grammar units" : "120+ bài học ngữ pháp chuẩn Viện Ngôn ngữ Seoul",
                      },
                      {
                        title: isEn ? "4,500+ curated vocabulary cards" : "4.500+ thẻ từ vựng minh hoạ kèm ngữ cảnh thực tế",
                      },
                      {
                        title: isEn ? "Offline study synchronization" : "Tự động đồng bộ tiến độ học trên mọi thiết bị",
                      },
                    ]}
                    ctaText={isEn ? "Start Free Lesson" : "Học thử bài học miễn phí"}
                    ctaHref="/roadmap"
                  />
                </div>

                <div className="lg:col-span-6 flex items-center justify-center">
                  <MockupFrame
                    title="Flashcard SRS Deck • Unit 3: Món Ăn Hàn Quốc"
                    className="w-full"
                    badge={<Badge variant="tint" size="sm">SRS SM-2</Badge>}
                  >
                    <div className="space-y-5 text-center py-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-card bg-brand-surface border border-brand-border shadow-xs space-y-2 max-w-xs mx-auto"
                      >
                        <span className="text-3xl">🍲</span>
                        <div className="text-2xl font-extrabold font-korean text-brand-navy">
                          김치찌개
                        </div>
                        <p className="text-xs font-semibold text-brand-muted">Gimchijjigae • Canh kim chi</p>
                      </motion.div>

                      <div className="flex justify-center gap-2 max-w-sm mx-auto">
                        <span className="px-3 py-1 rounded-control bg-rose-500/10 text-rose-700 text-xs font-bold border border-rose-500/20">
                          Quên (1 ngày)
                        </span>
                        <span className="px-3 py-1 rounded-control bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/20">
                          Khó (3 ngày)
                        </span>
                        <span className="px-3 py-1 rounded-control bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20">
                          Dễ (7 ngày)
                        </span>
                      </div>
                    </div>
                  </MockupFrame>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBlock;
