export type LessonKind = "grammar" | "topic_vocabulary" | "hangul" | "conversation";

export type ContentStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export interface TeacherContentScope {
  id?: string;
  teacherId: string;
  levelCode: string; // e.g. 'hangul', 'topik-1', 'topik-2'
  lessonKind: LessonKind;
  createdAt?: string;
}

export interface StarRules {
  stars_3: number; // default 90
  stars_2: number; // default 70
  stars_1: number; // default 50
}

export interface LessonTag {
  id: string;
  slug: string;
  labelVi: string;
  labelEn: string;
  koreanPattern?: string;
}

export interface GrammarExample {
  korean: string;
  romanization: string;
  meaningVi: string;
  meaningEn?: string;
  audioUrl?: string;
}

export interface AttachmentRule {
  condition: string; // e.g. "Danh từ có 받침"
  particle?: string; // e.g. "은"
  ending?: string; // e.g. "이에요"
  example: string;
}

export interface GrammarPoint {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  koreanPattern: string;
  formula: string;
  explanationVi: string;
  explanationEn: string;
  attachmentRules: AttachmentRule[];
  examples: GrammarExample[];
  commonMistakes?: string;
  cultureTip?: string;
  similarGrammarId?: string;
}

export interface VocabularyItem {
  id: string;
  korean: string;
  romanization: string;
  partOfSpeech: string;
  meaningVi: string;
  meaningEn?: string;
  exampleKo?: string;
  exampleVi?: string;
  exampleEn?: string;
  audioUrl?: string;
  imageUrl?: string;
  topikLevel?: string;
  autoAddToSrs?: boolean;
}

export type ExerciseType =
  | "multiple-choice"
  | "fill-blank"
  | "sentence-ordering"
  | "matching"
  | "listening"
  | "typing";

export interface ExerciseDraft {
  id: string;
  type: ExerciseType;
  instruction: string;
  question: string;
  passage?: string;
  audioPrompt?: string;
  options?: string[];
  correctAnswer: string;
  acceptedVariants?: string[]; // alternative correct spellings/spacings
  explanationVi: string;
  explanationEn?: string;
  points: number;
}

export interface LessonDraft {
  id: string;
  slug: string;
  kind: LessonKind;
  levelId: string;
  lessonNumber: number;
  titleVi: string;
  titleEn: string;
  koreanSubtitle: string; // e.g. "자기소개 · N은/는 N이에요/예요"
  summaryVi: string;
  summaryEn: string;
  durationMinutes: number;
  xpReward: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  starRules: StarRules;
  grammarTags: LessonTag[];
  proposedPosition?: number;
  roadmapPosition?: number;
  authorId: string;
  authorEmail?: string;
  status: ContentStatus;
  publishedVersionId?: string | null;

  // Step 2 Content Templates
  grammarTemplate?: {
    goalVi: string;
    goalEn?: string;
    points: GrammarPoint[];
    notesCallout?: string;
    cultureTip?: string;
  };

  vocabularyTemplate?: {
    introVi: string;
    introEn?: string;
    items: VocabularyItem[];
    pronunciationTip?: string;
    miniDialogue?: {
      speakerA: string;
      lineA: string;
      speakerB: string;
      lineB: string;
    };
  };

  // Step 3 Exercises
  exercises: ExerciseDraft[];

  // Review & Collaboration
  reviewerNote?: string;
  submissionNote?: string;
  rejectionReason?: string;
  versionNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonSubmission {
  id: string;
  lessonId: string;
  versionId: string;
  submittedBy: string;
  note?: string;
  submittedAt: string;
  reviewedBy?: string;
  decision?: "approved" | "changes_requested" | "rejected";
  decisionReason?: string;
  reviewedAt?: string;
}

export interface ReviewComment {
  id: string;
  lessonId: string;
  blockId?: string; // anchored to a block in Step 2 or exercise in Step 3
  authorId: string;
  authorRole: string;
  comment: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherLessonStats {
  lessonId: string;
  title: string;
  starts: number;
  completions: number;
  avgScore: number;
  completionRate: number;
  dropOffBlock?: string;
  hardestExerciseIds: string[];
}
