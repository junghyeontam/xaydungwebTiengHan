"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { LESSONS_DATABASE, LessonDetail } from "@/lib/data/lessons-data";
import { getPublishedLesson } from "@/features/content-publishing/content-service";
import { trackAnalyticsEvent } from "@/features/analytics/tracker";
import { useAuth } from "@/lib/context/AuthContext";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonTheory } from "@/components/lesson/LessonTheory";
import { LessonExercises } from "@/components/lesson/LessonExercises";
import { LessonCompletionModal } from "@/components/lesson/LessonCompletionModal";

export default function LessonDetailPage({ params }: { params?: { slug?: string } }) {
  const clientParams = useParams();
  const slug = params?.slug || (clientParams?.slug as string);

  // Retrieve published lesson from single source of truth or fallback
  const publishedData = getPublishedLesson(slug);
  const lesson: LessonDetail =
    publishedData ||
    (slug === "beginner-1-lesson-3-ayo-eoyo-endings" || slug === "so-cap-1-bai-3-duoi-cau-ayo-eoyo"
      ? LESSONS_DATABASE["beginner-1-lesson-3-ayo-eoyo-endings"]
      : null as any);

  // If lesson does not exist or is not published, return 404
  if (!lesson) {
    notFound();
  }

  const { user, updateProfile } = useAuth();

  const [showRomaja, setShowRomaja] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [completedExercisesCount, setCompletedExercisesCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  useEffect(() => {
    trackAnalyticsEvent("lesson_started", {
      metadata: { lessonSlug: slug, title: lesson.title },
    });
  }, [slug, lesson.title]);

  // Compute lesson completion percentage
  const totalSteps = 1 + lesson.exercises.length; // 1 theory block + exercise tasks
  const currentStep = 1 + completedExercisesCount;
  const progressPercent = Math.min(
    100,
    Math.round((currentStep / totalSteps) * 100)
  );

  // Add vocabulary to SRS queue
  const handleAddToReview = (item: { korean: string; meaning?: string; vietnamese?: string }) => {
    try {
      const currentCards = JSON.parse(
        localStorage.getItem("junghyeon_srs_queue") || "[]"
      );
      const textMeaning = item.meaning || item.vietnamese || "";
      if (!currentCards.some((c: any) => c.korean === item.korean)) {
        currentCards.push({
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          korean: item.korean,
          meaning: textMeaning,
          vietnamese: textMeaning,
          level: 0,
          nextReviewDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("junghyeon_srs_queue", JSON.stringify(currentCards));
      }
    } catch (err) {
      console.warn("SRS queue save error:", err);
    }
  };

  // Callback on individual exercise completion
  const handleExerciseComplete = (xp: number) => {
    setTotalXpEarned((prev) => prev + xp);
    setCompletedExercisesCount((prev) => prev + 1);

    // Credit XP to account and JungHyeon Tree
    if (user) {
      updateProfile({
        totalXp: user.totalXp + xp,
      });
    } else {
      // Save guest progress
      const guest = JSON.parse(
        localStorage.getItem("junghyeon_guest_progress") || '{"xp":0,"streak":1}'
      );
      guest.xp = (guest.xp || 0) + xp;
      localStorage.setItem("junghyeon_guest_progress", JSON.stringify(guest));
    }
  };

  // Callback on all exercises completed
  const handleAllCompleted = () => {
    const bonusXp = 20;
    const finalXp = totalXpEarned + bonusXp;
    setTotalXpEarned(finalXp);
    if (user) {
      updateProfile({ totalXp: user.totalXp + bonusXp });
    }
    trackAnalyticsEvent("lesson_completed", {
      metadata: {
        lessonSlug: slug,
        title: lesson.title,
        xpEarned: finalXp,
      },
    });
    setIsCompletedModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. Lesson Header: Progress, Romaja/Meaning toggles, XP */}
      <LessonHeader
        title={lesson.title}
        levelBadge={lesson.levelBadge}
        progressPercent={progressPercent}
        currentXp={totalXpEarned}
        showRomaja={showRomaja}
        onToggleRomaja={() => setShowRomaja(!showRomaja)}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation(!showTranslation)}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-8 space-y-12">
        {/* 2. Lesson Title Header */}
        <div className="space-y-1.5 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal text-xs font-bold">
              {lesson.levelName}
            </span>
            <span className="font-korean font-semibold text-xs text-muted-foreground">
              {lesson.koreanTitle}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {lesson.title}
          </h1>
        </div>

        {/* 3. Theory, Vocabulary, Grammar rules */}
        <section>
          <LessonTheory
            introduction={lesson.introduction}
            vocabulary={lesson.vocabulary}
            grammarRules={lesson.grammarRules}
            showRomaja={showRomaja}
            showTranslation={showTranslation}
            onAddToReview={handleAddToReview}
          />
        </section>

        {/* 4. Interactive Exercises Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t-2 border-dashed border-border w-full" />
          <span className="bg-background px-4 text-xs font-bold uppercase tracking-wider text-junghyeon-coral">
            ✍️ Bài tập tương tác củng cố kiến thức
          </span>
        </div>

        {/* 5. Interactive Practice Exercises */}
        <section>
          <LessonExercises
            exercises={lesson.exercises}
            onExerciseComplete={handleExerciseComplete}
            onAllCompleted={handleAllCompleted}
          />
        </section>
      </div>

      {/* 6. Lesson Completion Celebration Modal */}
      <LessonCompletionModal
        isOpen={isCompletedModalOpen}
        lessonTitle={lesson.title}
        totalXpEarned={totalXpEarned}
        onClose={() => setIsCompletedModalOpen(false)}
      />
    </div>
  );
}
