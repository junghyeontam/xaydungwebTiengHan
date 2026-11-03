"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Send,
  Eye,
  Plus,
  Trash2,
  BookOpen,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/shared/Button";

export default function NewLessonPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Basics
  const [titleVi, setTitleVi] = useState("");
  const [koreanSubtitle, setKoreanSubtitle] = useState("");
  const [lessonKind, setLessonKind] = useState<"grammar" | "topic_vocabulary">("grammar");
  const [levelId, setLevelId] = useState("topik-1");
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [xpReward, setXpReward] = useState(35);
  const [summaryVi, setSummaryVi] = useState("");

  // Step 2: Content
  const [grammarGoalVi, setGrammarGoalVi] = useState("");
  const [grammarPattern, setGrammarPattern] = useState("");
  const [grammarFormula, setGrammarFormula] = useState("");
  const [grammarExplanation, setGrammarExplanation] = useState("");
  const [exampleKo, setExampleKo] = useState("");
  const [exampleVi, setExampleVi] = useState("");

  // Step 3: Exercise
  const [exerciseQuestion, setExerciseQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");

  const handleFinishAndSubmit = (isSubmitForReview: boolean) => {
    alert(
      isSubmitForReview
        ? "Đã lưu và gửi bài học sang Ban kiểm duyệt (Publisher)! Chúng tôi sẽ thông báo khi có kết quả."
        : "Đã lưu bản nháp thành công! Bạn có thể tiếp tục chỉnh sửa bất cứ lúc nào."
    );
    router.push("/admin/teaching/lessons");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Breadcrumb & Step Tracker */}
      <div className="space-y-4">
        <Link
          href="/admin/teaching/lessons"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-secondary hover:text-brand-navy"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách bài học</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
              Biên Soạn Bài Học Mới (5 Bước)
            </h2>
            <p className="text-xs text-brand-secondary">
              Soạn thảo lý thuyết, ví dụ thực tế và bài tập tương tác cho học viên
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                onClick={() => setStep(s as any)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                  step === s
                    ? "bg-brand-primary text-white scale-110 shadow-xs"
                    : step > s
                    ? "bg-emerald-600 text-white"
                    : "bg-brand-surface text-brand-secondary border border-brand-border"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Container Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-brand-border shadow-xs space-y-6">
        {/* =========================================================================
            BƯỚC 1: THÔNG TIN CƠ BẢN
            ========================================================================= */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy">
                Bước 1: Thông tin cơ bản & Định vị bài học
              </h3>
              <p className="text-xs text-brand-secondary">
                Xác định loại bài học, cấp độ TOPIK và tóm tắt nội dung
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Loại bài học:</label>
                <select
                  value={lessonKind}
                  onChange={(e) => setLessonKind(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                >
                  <option value="grammar">Ngữ pháp trọng tâm (Grammar)</option>
                  <option value="topic_vocabulary">Từ vựng theo chủ đề (Topic Vocabulary)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Cấp độ:</label>
                <select
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                >
                  <option value="topik-1">TOPIK 1 (Sơ cấp 1)</option>
                  <option value="topik-2">TOPIK 2 (Sơ cấp 2)</option>
                  <option value="topik-3">TOPIK 3 (Trung cấp 1)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-navy">Tiêu đề bài học tiếng Việt *</label>
              <input
                type="text"
                required
                placeholder="vd: Bài 1: Giới thiệu bản thân (은/는 & 이에요/예요)"
                value={titleVi}
                onChange={(e) => setTitleVi(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-navy">Phụ đề tiếng Hàn:</label>
              <input
                type="text"
                placeholder="vd: 자기소개 · N은/는 N이에요/예요"
                value={koreanSubtitle}
                onChange={(e) => setKoreanSubtitle(e.target.value)}
                className="w-full px-3 py-2 text-xs font-korean rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Thời lượng ước tính (phút):</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Phần thưởng XP hoàn thành:</label>
                <input
                  type="number"
                  value={xpReward}
                  onChange={(e) => setXpReward(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-navy">Tóm tắt ngắn bài học:</label>
              <textarea
                rows={3}
                placeholder="Học cách nói 'Tôi là...' và tiểu từ chủ đề quan trọng nhất trong tiếng Hàn..."
                value={summaryVi}
                onChange={(e) => setSummaryVi(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            BƯỚC 2: NỘI DUNG LÝ THUYẾT
            ========================================================================= */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy">
                Bước 2: Nội dung lý thuyết & Công thức ngữ pháp
              </h3>
              <p className="text-xs text-brand-secondary">
                Soạn công thức, quy tắc kết hợp 받침 và các câu ví dụ thực tế
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-navy">Mục tiêu bài học:</label>
              <input
                type="text"
                placeholder="vd: Tự tin giới thiệu tên, quốc tịch và nghề nghiệp cơ bản..."
                value={grammarGoalVi}
                onChange={(e) => setGrammarGoalVi(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Mẫu cấu trúc (Pattern):</label>
                <input
                  type="text"
                  placeholder="vd: N은/는 N이에요/예요"
                  value={grammarPattern}
                  onChange={(e) => setGrammarPattern(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-korean font-bold rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Công thức (Formula):</label>
                <input
                  type="text"
                  placeholder="vd: Danh từ + 은/는 + Danh từ + 이에요/예요"
                  value={grammarFormula}
                  onChange={(e) => setGrammarFormula(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-navy">Giải thích chi tiết:</label>
              <textarea
                rows={4}
                placeholder="Đứng sau danh từ để biểu thị danh từ đó là chủ đề chính của câu..."
                value={grammarExplanation}
                onChange={(e) => setGrammarExplanation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-border/60">
              <label className="text-xs font-bold text-brand-navy">Ví dụ minh hoạ:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tiếng Hàn: 저는 베트남 사람이에요."
                  value={exampleKo}
                  onChange={(e) => setExampleKo(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-korean rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
                <input
                  type="text"
                  placeholder="Dịch nghĩa: Tôi là người Việt Nam."
                  value={exampleVi}
                  onChange={(e) => setExampleVi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            BƯỚC 3: BÀI TẬP VẬN DỤNG
            ========================================================================= */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy">
                Bước 3: Bài tập kiểm tra tương tác
              </h3>
              <p className="text-xs text-brand-secondary">
                Tạo câu hỏi trắc nghiệm hoặc điền từ để học viên củng cố kiến thức
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-navy">Câu hỏi trắc nghiệm *</label>
              <input
                type="text"
                placeholder="vd: Điền từ thích hợp: 저___ 베트남 사람이에요."
                value={exerciseQuestion}
                onChange={(e) => setExerciseQuestion(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Đáp án A:</label>
                <input
                  type="text"
                  placeholder="vd: 는"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Đáp án B:</label>
                <input
                  type="text"
                  placeholder="vd: 은"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Đáp án C:</label>
                <input
                  type="text"
                  placeholder="vd: 이"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Đáp án D:</label>
                <input
                  type="text"
                  placeholder="vd: 가"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-navy">Đáp án đúng:</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-36 px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="A">Đáp án A</option>
                <option value="B">Đáp án B</option>
                <option value="C">Đáp án C</option>
                <option value="D">Đáp án D</option>
              </select>
            </div>
          </div>
        )}

        {/* =========================================================================
            BƯỚC 4: XEM TRƯỚC GIAO DIỆN HỌC VIÊN
            ========================================================================= */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy">
                Bước 4: Xem trước giao diện hiển thị cho học viên
              </h3>
              <p className="text-xs text-brand-secondary">
                Đây là chính xác cách bài giảng của bạn sẽ hiển thị trên ứng dụng của người học
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-surface/40 border border-brand-border space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary text-white">
                  TOPIK 1
                </span>
                <span className="text-xs text-brand-secondary font-korean font-semibold">
                  {koreanSubtitle || "자기소개 · N은/는 N이에요/예요"}
                </span>
              </div>

              <h4 className="text-xl font-extrabold text-brand-navy">
                {titleVi || "Bài 1: Giới thiệu bản thân"}
              </h4>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs font-semibold text-blue-900">
                <span className="text-blue-700 font-bold mr-2">Công thức:</span>
                {grammarFormula || "Danh từ + 은/는 + Danh từ + 이에요/예요"}
              </div>

              <p className="text-xs text-brand-navy leading-relaxed">
                {grammarExplanation ||
                  "Đứng sau danh từ để biểu thị danh từ đó là chủ đề chính của câu trong ngữ cảnh thân mật lịch sự."}
              </p>

              {exampleKo && (
                <div className="p-3 rounded-xl bg-white border border-brand-border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-korean font-bold text-brand-navy">{exampleKo}</p>
                    <p className="text-brand-secondary text-[11px]">{exampleVi}</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-brand-primary" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            BƯỚC 5: CHECKLIST & GỬI DUYỆT
            ========================================================================= */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy">
                Bước 5: Thẩm định & Cơ chế kiểm soát kép (Dual Control)
              </h3>
              <p className="text-xs text-brand-secondary">
                Kiểm tra các tiêu chuẩn chất lượng trước khi gửi duyệt
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                "Tiêu đề và phụ đề tiếng Hàn chuẩn ngữ pháp Seoul.",
                "Có ít nhất 1 công thức rõ ràng và ví dụ minh hoạ thực tế.",
                "Bài tập kiểm tra có đáp án chính xác và lời giải thích.",
                "Tự động tích hợp vào lộ trình của cấp độ tương ứng.",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-brand-navy">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Lưu ý kiểm duyệt:</p>
              <p className="text-[11px] leading-relaxed">
                Theo quy định của Viện Ngôn ngữ JungHyeon, bài học bạn tạo sẽ chuyển sang trạng thái <strong>Chờ duyệt (Submitted)</strong>. Ban kiểm duyệt (Publisher/Admin) sẽ kiểm tra và xuất bản trong vòng 24h.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-border">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={() => setStep((s) => (s - 1) as any)}
            >
              Quay lại
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleFinishAndSubmit(false)}
            >
              Lưu bản nháp
            </Button>

            {step < 5 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => setStep((s) => (s + 1) as any)}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
                onClick={() => handleFinishAndSubmit(true)}
              >
                Gửi sang Ban kiểm duyệt
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
