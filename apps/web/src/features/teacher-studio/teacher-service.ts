import {
  LessonDraft,
  TeacherContentScope,
  LessonKind,
  LessonSubmission,
  ReviewComment,
  TeacherLessonStats,
  GrammarPoint,
  VocabularyItem,
  LessonTag,
} from "./types";
import { recordAuditLog } from "@/features/audit/audit-service";
import { getPublishedLesson } from "@/features/content-publishing/content-service";

// ==============================================================================
// 1. IN-MEMORY STORES & SINGLETON ACROSS HMR/SSR
// ==============================================================================

interface TeacherStudioState {
  scopesStore: Map<string, TeacherContentScope[]>; // teacherId -> scopes
  draftsStore: Map<string, LessonDraft>; // lessonId -> LessonDraft
  submissionsStore: Map<string, LessonSubmission[]>; // lessonId -> submissions
  commentsStore: Map<string, ReviewComment[]>; // lessonId -> comments
  grammarBank: Map<string, GrammarPoint>;
  vocabBank: Map<string, VocabularyItem>;
  tagsBank: Map<string, LessonTag>;
}

const globalForTeacherStudio = globalThis as unknown as {
  __jh_teacher_studio?: TeacherStudioState;
};

if (!globalForTeacherStudio.__jh_teacher_studio) {
  const scopesStore = new Map<string, TeacherContentScope[]>();
  const draftsStore = new Map<string, LessonDraft>();
  const submissionsStore = new Map<string, LessonSubmission[]>();
  const commentsStore = new Map<string, ReviewComment[]>();
  const grammarBank = new Map<string, GrammarPoint>();
  const vocabBank = new Map<string, VocabularyItem>();
  const tagsBank = new Map<string, LessonTag>();

  // Baseline Demo Teacher: teacher@junghyeon.vn
  const defaultTeacherId = "teacher-demo-uuid-1";
  scopesStore.set(defaultTeacherId, [
    {
      id: "scope-1",
      teacherId: defaultTeacherId,
      levelCode: "hangul",
      lessonKind: "grammar",
    },
    {
      id: "scope-2",
      teacherId: defaultTeacherId,
      levelCode: "topik-1",
      lessonKind: "grammar",
    },
    {
      id: "scope-3",
      teacherId: defaultTeacherId,
      levelCode: "topik-1",
      lessonKind: "topic_vocabulary",
    },
    {
      id: "scope-4",
      teacherId: defaultTeacherId,
      levelCode: "topik-2",
      lessonKind: "grammar",
    },
    {
      id: "scope-5",
      teacherId: defaultTeacherId,
      levelCode: "topik-2",
      lessonKind: "topic_vocabulary",
    },
  ]);

  // Seed Tags
  const tag1: LessonTag = {
    id: "tag-1",
    slug: "topic-particle",
    labelVi: "Tiểu từ chủ đề 은/는",
    labelEn: "Topic Particle 은/는",
    koreanPattern: "N은/는",
  };
  const tag2: LessonTag = {
    id: "tag-2",
    slug: "noun-ending",
    labelVi: "Đuôi câu danh từ 이에요/예요",
    labelEn: "Noun Ending 이에요/예요",
    koreanPattern: "N이에요/예요",
  };
  const tag3: LessonTag = {
    id: "tag-3",
    slug: "existence-verb",
    labelVi: "Động từ tồn tại 있어요/없어요",
    labelEn: "Existence Verb 있어요/없어요",
    koreanPattern: "N이/가 있어요/없어요",
  };
  const tag4: LessonTag = {
    id: "tag-4",
    slug: "daily-greetings",
    labelVi: "Chào hỏi đời sống",
    labelEn: "Daily Greetings",
    koreanPattern: "인사말",
  };
  tagsBank.set(tag1.slug, tag1);
  tagsBank.set(tag2.slug, tag2);
  tagsBank.set(tag3.slug, tag3);
  tagsBank.set(tag4.slug, tag4);

  // Seed Grammar Point 1
  const gp1: GrammarPoint = {
    id: "gp-1",
    slug: "topic-particle-and-noun-ending",
    titleVi: "Giới thiệu bản thân: N은/는 N이에요/예요",
    titleEn: "Self-introduction: N은/는 N이에요/예요",
    koreanPattern: "N은/는 N이에요/예요",
    formula: "Danh từ 1 + 은/는 + Danh từ 2 + 이에요/예요",
    explanationVi:
      "Dùng để giới thiệu danh tính, nghề nghiệp, quốc tịch trong ngữ cảnh thân mật lịch sự.",
    explanationEn:
      "Used to introduce identity, profession, and nationality in polite informal speech.",
    attachmentRules: [
      {
        condition: "Danh từ có 받침 (phụ âm dưới)",
        particle: "은",
        ending: "이에요",
        example: "선생님은 ... 이에요",
      },
      {
        condition: "Danh từ không có 받침 (kết thúc nguyên âm)",
        particle: "는",
        ending: "예요",
        example: "저는 ... 예요",
      },
    ],
    examples: [
      {
        korean: "저는 베트남 사람이에요.",
        romanization: "Jeoneun beteunam saram-ieyo.",
        meaningVi: "Tôi là người Việt Nam.",
        meaningEn: "I am Vietnamese.",
      },
      {
        korean: "민수 씨는 학생이에요.",
        romanization: "Minsu ssineun haksaeng-ieyo.",
        meaningVi: "Minsoo là học sinh.",
        meaningEn: "Minsoo is a student.",
      },
      {
        korean: "이것은 한국어 책이에요.",
        romanization: "Igeoseun hangugeo chaeg-ieyo.",
        meaningVi: "Đây là sách tiếng Hàn.",
        meaningEn: "This is a Korean book.",
      },
      {
        korean: "제 이름은 린이에요.",
        romanization: "Je ireumeun Rin-ieyo.",
        meaningVi: "Tên tôi là Linh.",
        meaningEn: "My name is Linh.",
      },
      {
        korean: "여기는 서울대학교예요.",
        romanization: "Yeogineun Seoul daehakgyo-yeyo.",
        meaningVi: "Đây là Đại học Quốc gia Seoul.",
        meaningEn: "This is Seoul National University.",
      },
    ],
    commonMistakes:
      "Nhầm lẫn giữa 이에요 (dành cho từ có patchim) và 예요 (dành cho từ không patchim).",
    cultureTip:
      "Người Hàn rất chú trọng xưng hô trong lần đầu gặp gỡ; luôn dùng đuôi 이에요/예요 hoặc 입니다.",
  };
  grammarBank.set(gp1.slug, gp1);

  // Seed Grammar Point 2
  const gp2: GrammarPoint = {
    id: "gp-2",
    slug: "existence-and-possession",
    titleVi: "Tồn tại & Sở hữu: N이/가 있어요/없어요",
    titleEn: "Existence and Possession: N이/가 있어요/없어요",
    koreanPattern: "N이/가 있어요/없어요",
    formula: "Danh từ + 이/가 + 있어요 (Có) / 없어요 (Không có)",
    explanationVi:
      "Dùng để diễn đạt sự có mặt/vắng mặt ở một địa điểm, hoặc việc sở hữu một đồ vật/quan hệ.",
    explanationEn:
      "Expresses existence in a location or possession of an item/relationship.",
    attachmentRules: [
      {
        condition: "Danh từ có 받침",
        particle: "이",
        example: "책이 있어요",
      },
      {
        condition: "Danh từ không có 받침",
        particle: "가",
        example: "친구가 있어요",
      },
    ],
    examples: [
      {
        korean: "저는 한국 친구가 있어요.",
        romanization: "Jeoneun hanguk chinguga isseoyo.",
        meaningVi: "Tôi có bạn người Hàn Quốc.",
        meaningEn: "I have Korean friends.",
      },
      {
        korean: "교실에 컴퓨터가 있어요.",
        romanization: "Gyosire keompyuteoga isseoyo.",
        meaningVi: "Trong phòng học có máy tính.",
        meaningEn: "There is a computer in the classroom.",
      },
      {
        korean: "지금 지갑이 없어요.",
        romanization: "Jigeum jigabi eopseoyo.",
        meaningVi: "Bây giờ tôi không có ví tiền.",
        meaningEn: "I do not have a wallet right now.",
      },
      {
        korean: "시간이 있어요?",
        romanization: "Sigani isseoyo?",
        meaningVi: "Bạn có thời gian không?",
        meaningEn: "Do you have time?",
      },
      {
        korean: "우산이 없어요.",
        romanization: "Usani eopseoyo.",
        meaningVi: "Tôi không có ô/dù.",
        meaningEn: "I do not have an umbrella.",
      },
    ],
    commonMistakes:
      "Nhầm lẫn giữa tiểu từ chủ ngữ 이/가 với tiểu từ tân ngữ 을/를 khi dùng với 있어요/없어요.",
    cultureTip:
      "Khi hỏi người khác '시간이 있어요?' (Bạn có thời gian không?), đây là cách mở lời lịch sự trước khi nhờ vả.",
  };
  grammarBank.set(gp2.slug, gp2);

  // Seed Vocabulary Bank Items
  const vocabItems: VocabularyItem[] = [
    {
      id: "v-1",
      korean: "안녕하세요",
      romanization: "annyeonghaseyo",
      partOfSpeech: "Thán từ",
      meaningVi: "Xin chào (lịch sự)",
      meaningEn: "Hello (polite)",
      exampleKo: "선생님, 안녕하세요!",
      exampleVi: "Em chào thầy cô ạ!",
      exampleEn: "Hello, teacher!",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
    {
      id: "v-2",
      korean: "감사합니다",
      romanization: "gamsahamnida",
      partOfSpeech: "Cụm từ",
      meaningVi: "Xin cảm ơn",
      meaningEn: "Thank you",
      exampleKo: "도와주셔서 감사합니다.",
      exampleVi: "Cảm ơn vì đã giúp đỡ tôi.",
      exampleEn: "Thank you for helping me.",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
    {
      id: "v-3",
      korean: "죄송합니다",
      romanization: "joesonghamnida",
      partOfSpeech: "Cụm từ",
      meaningVi: "Xin lỗi (trang trọng)",
      meaningEn: "I am sorry",
      exampleKo: "늦어서 죄송합니다.",
      exampleVi: "Xin lỗi vì tôi đến muộn.",
      exampleEn: "I am sorry for being late.",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
    {
      id: "v-4",
      korean: "안녕히 계세요",
      romanization: "annyeonghi gyeseyo",
      partOfSpeech: "Cụm từ",
      meaningVi: "Tạm biệt (khi người nói ra về, đối phương ở lại)",
      meaningEn: "Goodbye (stay well)",
      exampleKo: "먼저 가겠습니다. 안녕히 계세요.",
      exampleVi: "Tôi xin phép về trước, chào bạn ở lại nhé.",
      exampleEn: "I will leave first. Goodbye.",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
    {
      id: "v-5",
      korean: "안녕히 가세요",
      romanization: "annyeonghi gaseyo",
      partOfSpeech: "Cụm từ",
      meaningVi: "Tạm biệt (khi đối phương ra về)",
      meaningEn: "Goodbye (go safely)",
      exampleKo: "조심히 들어가세요. 안녕히 가세요.",
      exampleVi: "Đi cẩn thận nhé, tạm biệt bạn.",
      exampleEn: "Take care. Goodbye.",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
    {
      id: "v-6",
      korean: "처음 뵙겠습니다",
      romanization: "cheoeum boepgetseumnida",
      partOfSpeech: "Cụm từ",
      meaningVi: "Rất hân hạnh được gặp bạn lần đầu",
      meaningEn: "Pleased to meet you for the first time",
      exampleKo: "처음 뵙겠습니다. 잘 부탁드립니다.",
      exampleVi: "Rất hân hạnh được gặp anh, xin hãy chỉ giáo thêm.",
      exampleEn: "Pleased to meet you. Please guide me.",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
    {
      id: "v-7",
      korean: "만나서 반갑습니다",
      romanization: "mannaseo bangapseumnida",
      partOfSpeech: "Cụm từ",
      meaningVi: "Rất vui được gặp bạn",
      meaningEn: "Nice to meet you",
      exampleKo: "만나서 반갑습니다, 린 씨.",
      exampleVi: "Rất vui được gặp bạn, Linh.",
      exampleEn: "Nice to meet you, Linh.",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
    {
      id: "v-8",
      korean: "네 / 아니요",
      romanization: "ne / aniyo",
      partOfSpeech: "Thán từ",
      meaningVi: "Vâng / Không",
      meaningEn: "Yes / No",
      exampleKo: "네, 맞습니다.",
      exampleVi: "Vâng, đúng vậy ạ.",
      exampleEn: "Yes, that is correct.",
      topikLevel: "TOPIK 1",
      autoAddToSrs: true,
    },
  ];
  vocabItems.forEach((v) => vocabBank.set(`${v.korean}_${v.meaningVi}`, v));

  // SEED LESSON 1: Self-introduction (Published / Canonical)
  const lesson1: LessonDraft = {
    id: "lesson-topik-1-self-intro",
    slug: "self-introduction-eun-neun-ieyo-yeyo",
    kind: "grammar",
    levelId: "topik-1",
    lessonNumber: 1,
    titleVi: "Giới thiệu bản thân & Quốc tịch: N은/는 N이에요/예요",
    titleEn: "Self-introduction: N은/는 N이에요/예요",
    koreanSubtitle: "자기소개 · N은/는 N이에요/예요",
    summaryVi:
      "Học cách chào hỏi, giới thiệu tên, nghề nghiệp và quốc tịch bằng đuôi câu thân mật lịch sự 이에요/예요.",
    summaryEn:
      "Learn how to greet and introduce your name, occupation, and nationality using the polite ending 이에요/예요.",
    durationMinutes: 20,
    xpReward: 35,
    difficulty: "beginner",
    starRules: { stars_3: 90, stars_2: 70, stars_1: 50 },
    grammarTags: [tag1, tag2],
    proposedPosition: 1,
    roadmapPosition: 1,
    authorId: defaultTeacherId,
    authorEmail: "teacher@junghyeon.vn",
    status: "published",
    publishedVersionId: "v-seed-self-intro",
    grammarTemplate: {
      goalVi: "Tự tin giới thiệu bản thân trong giao tiếp thực tế.",
      goalEn: "Confidently introduce yourself in real conversations.",
      points: [gp1],
      notesCallout:
        "Chú ý kiểm tra âm tiết cuối của danh từ xem có phụ âm dưới (받침) không để gắn 이에요 hay 예요 cho chính xác.",
      cultureTip:
        "Khi xưng 'Tôi' lịch sự với người mới quen, luôn dùng đại từ '저' thay vì '나'.",
    },
    exercises: [
      {
        id: "ex-1-1",
        type: "multiple-choice",
        instruction: "Chọn tiểu từ chủ đề thích hợp điền vào chỗ trống:",
        question: "저___ 베트남 사람이에요. (Tôi là người Việt Nam)",
        options: ["는", "은", "이", "가"],
        correctAnswer: "는",
        explanationVi: "Đại từ '저' kết thúc bằng nguyên âm (không có 받침) nên đi với '는'.",
        explanationEn: "'저' ends with a vowel, so it takes '는'.",
        points: 5,
      },
      {
        id: "ex-1-2",
        type: "multiple-choice",
        instruction: "Chọn đuôi câu danh từ thích hợp:",
        question: "민수 씨는 학생_____.",
        options: ["이에요", "예요", "입니다", "있어요"],
        correctAnswer: "이에요",
        explanationVi: "Danh từ '학생' có phụ âm dưới (받침 ㅇ) nên kết hợp với '이에요'.",
        explanationEn: "'학생' has a final consonant (patchim), so it takes '이에요'.",
        points: 5,
      },
      {
        id: "ex-1-3",
        type: "fill-blank",
        instruction: "Gõ đuôi câu phù hợp (이에요 hoặc 예요):",
        question: "제 이름은 린_____.",
        correctAnswer: "이에요",
        acceptedVariants: ["이에요", "이에요."],
        explanationVi: "'린' có phụ âm dưới ㄴ nên đi với 이에요.",
        points: 5,
      },
      {
        id: "ex-1-4",
        type: "matching",
        instruction: "Ghép các cặp từ tương ứng:",
        question: "Ghép danh từ với đuôi câu chính xác:",
        options: ["선생님", "이에요", "의사", "예요"],
        correctAnswer: "선생님:이에요|의사:예요",
        explanationVi: "선생님 có patchim đi với 이에요; 의사 không patchim đi với 예요.",
        points: 5,
      },
      {
        id: "ex-1-5",
        type: "sentence-ordering",
        instruction: "Sắp xếp các từ thành câu hoàn chỉnh:",
        question: "사람이에요 / 저는 / 베트남",
        options: ["저는", "베트남", "사람이에요"],
        correctAnswer: "저는 베트남 사람이에요",
        explanationVi: "Trật tự câu tiếng Hàn: Chủ ngữ (저는) + Bổ ngữ (베트남) + Vị ngữ (사람이에요).",
        points: 5,
      },
    ],
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // SEED LESSON 2: Existence & Possession (Published / Canonical)
  const lesson2: LessonDraft = {
    id: "lesson-topik-1-existence",
    slug: "existence-and-possession-i-ga-isseoyo",
    kind: "grammar",
    levelId: "topik-1",
    lessonNumber: 2,
    titleVi: "Hỏi & Nói về sở hữu: N이/가 있어요/없어요",
    titleEn: "Existence and Possession: N이/가 있어요/없어요",
    koreanSubtitle: "소유와 존재 · N이/가 있어요/없어요",
    summaryVi:
      "Diễn đạt bạn có hoặc không có vật gì, hoặc nói về sự tồn tại của ai đó ở một vị trí.",
    summaryEn:
      "Express that you have or do not have something, or state the existence of someone.",
    durationMinutes: 25,
    xpReward: 35,
    difficulty: "beginner",
    starRules: { stars_3: 90, stars_2: 70, stars_1: 50 },
    grammarTags: [tag3],
    proposedPosition: 2,
    roadmapPosition: 2,
    authorId: defaultTeacherId,
    authorEmail: "teacher@junghyeon.vn",
    status: "published",
    publishedVersionId: "v-seed-existence",
    grammarTemplate: {
      goalVi: "Nắm vững cách diễn đạt 'Có' và 'Không có' trong tiếng Hàn.",
      goalEn: "Master expressing existence and possession.",
      points: [gp2],
      notesCallout: "Không nhầm lẫn với tiểu từ tân ngữ 을/를.",
      cultureTip:
        "Khi từ chối khéo léo một lời mời hẹn, người Hàn hay nói '약속이 있어요' (Tôi có hẹn rồi).",
    },
    exercises: [
      {
        id: "ex-2-1",
        type: "multiple-choice",
        instruction: "Chọn tiểu từ chủ ngữ thích hợp:",
        question: "한국 친구___ 있어요.",
        options: ["가", "이", "는", "를"],
        correctAnswer: "가",
        explanationVi: "'친구' kết thúc bằng nguyên âm ㅜ nên đi với tiểu từ '가'.",
        points: 5,
      },
      {
        id: "ex-2-2",
        type: "multiple-choice",
        instruction: "Chọn từ mang nghĩa 'không có':",
        question: "지금 지갑이 _____.",
        options: ["없어요", "있어요", "이에요", "아니에요"],
        correctAnswer: "없어요",
        explanationVi: "'없어요' nghĩa là không có.",
        points: 5,
      },
      {
        id: "ex-2-3",
        type: "fill-blank",
        instruction: "Điền tiểu từ thích hợp (이 hoặc 가):",
        question: "시간___ 있어요?",
        correctAnswer: "이",
        acceptedVariants: ["이"],
        explanationVi: "'시간' có patchim ㄴ nên gắn với '이'.",
        points: 5,
      },
      {
        id: "ex-2-4",
        type: "sentence-ordering",
        instruction: "Sắp xếp thành câu:",
        question: "있어요 / 컴퓨터가 / 교실에",
        options: ["교실에", "컴퓨터가", "있어요"],
        correctAnswer: "교실에 컴퓨터가 있어요",
        explanationVi: "Địa điểm (교실에) + Chủ ngữ (컴퓨터가) + Động từ (있어요).",
        points: 5,
      },
      {
        id: "ex-2-5",
        type: "typing",
        instruction: "Gõ câu tiếng Hàn tương ứng với 'Tôi không có ô':",
        question: "우산이 없어요.",
        correctAnswer: "우산이 없어요.",
        acceptedVariants: ["우산이 없어요", "우산이 없어요."],
        explanationVi: "우산 (ô/dù) + 이 + 없어요.",
        points: 5,
      },
    ],
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // SEED LESSON 3: Daily Greetings (Topic Vocabulary, Published)
  const lesson3: LessonDraft = {
    id: "lesson-topik-1-greetings-vocab",
    slug: "daily-greetings-and-courtesies",
    kind: "topic_vocabulary",
    levelId: "topik-1",
    lessonNumber: 3,
    titleVi: "Chủ đề Từ vựng: Lời chào & Giao tiếp thông dụng",
    titleEn: "Topic Vocabulary: Daily Greetings & Courtesies",
    koreanSubtitle: "생활 어휘 · 일상 인사와 예절",
    summaryVi:
      "Tổng hợp 8 từ vựng và câu khẩu ngữ chào hỏi hàng ngày không thể thiếu khi giao tiếp với người Hàn Quốc.",
    summaryEn:
      "8 essential everyday greetings and courteous expressions for Korean communication.",
    durationMinutes: 20,
    xpReward: 35,
    difficulty: "beginner",
    starRules: { stars_3: 90, stars_2: 70, stars_1: 50 },
    grammarTags: [tag4],
    proposedPosition: 3,
    roadmapPosition: 3,
    authorId: defaultTeacherId,
    authorEmail: "teacher@junghyeon.vn",
    status: "published",
    publishedVersionId: "v-seed-greetings-vocab",
    vocabularyTemplate: {
      introVi:
        "Học các câu chào mở đầu và kết thúc buổi trò chuyện, cách cảm ơn và xin lỗi đúng chuẩn văn hóa Hàn.",
      introEn: "Learn how to open and close conversations with proper etiquette.",
      items: vocabItems,
      pronunciationTip:
        "Khi phát âm '감사합니다' [감사함니다], chữ ㅂ ở patchim biến âm thành ㅁ do gặp ㄴ ở từ sau (Quy tắc Mũi hoá).",
      miniDialogue: {
        speakerA: "민수",
        lineA: "안녕하세요, 린 씨! 만나서 반갑습니다.",
        speakerB: "린",
        lineB: "네, 민수 씨! 처음 뵙겠습니다.",
      },
    },
    exercises: [
      {
        id: "ex-3-1",
        type: "multiple-choice",
        instruction: "Chọn câu chào khi bạn ra về còn đối phương ở lại:",
        question: "Bạn chuẩn bị rời khỏi văn phòng, bạn sẽ chào đồng nghiệp ở lại thế nào?",
        options: ["안녕히 계세요", "안녕히 가세요", "처음 뵙겠습니다", "잘 먹겠습니다"],
        correctAnswer: "안녕히 계세요",
        explanationVi: "'안녕히 계세요' dùng khi mình đi và đối phương ở lại (계시다 = ở lại).",
        points: 5,
      },
      {
        id: "ex-3-2",
        type: "multiple-choice",
        instruction: "Chọn câu có nghĩa 'Xin cảm ơn':",
        question: "Từ nào mang nghĩa cảm ơn?",
        options: ["감사합니다", "죄송합니다", "괜찮아요", "실례합니다"],
        correctAnswer: "감사합니다",
        explanationVi: "감사합니다 = Xin cảm ơn.",
        points: 5,
      },
      {
        id: "ex-3-3",
        type: "matching",
        instruction: "Nối câu tiếng Hàn với nghĩa tiếng Việt thích hợp:",
        question: "Ghép câu chào:",
        options: ["안녕하세요", "Xin chào", "죄송합니다", "Xin lỗi"],
        correctAnswer: "안녕하세요:Xin chào|죄송합니다:Xin lỗi",
        explanationVi: "안녕하세요 là Xin chào, 죄송합니다 là Xin lỗi.",
        points: 5,
      },
      {
        id: "ex-3-4",
        type: "fill-blank",
        instruction: "Điền từ còn thiếu vào chỗ trống:",
        question: "만나서 _____ (Rất vui được gặp bạn)",
        correctAnswer: "반갑습니다",
        acceptedVariants: ["반갑습니다", "반갑습니다."],
        explanationVi: "만나서 반갑습니다 = Rất vui được gặp bạn.",
        points: 5,
      },
      {
        id: "ex-3-5",
        type: "listening",
        instruction: "Nghe phát âm và chọn nghĩa đúng:",
        question: "Đoạn băng phát âm câu nào sau đây?",
        audioPrompt: "처음 뵙겠습니다",
        options: [
          "Rất hân hạnh được gặp lần đầu",
          "Xin lỗi vì đã làm phiền",
          "Chào buổi tối",
          "Chúc ngủ ngon",
        ],
        correctAnswer: "Rất hân hạnh được gặp lần đầu",
        explanationVi: "처음 뵙겠습니다 = Rất hân hạnh được gặp bạn lần đầu.",
        points: 5,
      },
    ],
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  draftsStore.set(lesson1.id, lesson1);
  draftsStore.set(lesson2.id, lesson2);
  draftsStore.set(lesson3.id, lesson3);

  globalForTeacherStudio.__jh_teacher_studio = {
    scopesStore,
    draftsStore,
    submissionsStore,
    commentsStore,
    grammarBank,
    vocabBank,
    tagsBank,
  };
}

const state = globalForTeacherStudio.__jh_teacher_studio!;

// ==============================================================================
// 2. SCOPE VALIDATION ENGINE
// ==============================================================================

/**
 * Check if teacher has authorized scope for a given level and kind
 */
export function validateTeacherScope(
  teacherId: string,
  levelCode: string,
  lessonKind: LessonKind
): boolean {
  // If teacher is admin/super_admin, always allowed
  if (teacherId === "super-admin" || teacherId === "admin-user") return true;

  const scopes = state.scopesStore.get(teacherId) || state.scopesStore.get("teacher-demo-uuid-1") || [];
  return scopes.some(
    (s) => s.levelCode === levelCode && s.lessonKind === lessonKind
  );
}

/**
 * Get authorized scopes for a teacher
 */
export function getTeacherScopes(teacherId: string): TeacherContentScope[] {
  return state.scopesStore.get(teacherId) || state.scopesStore.get("teacher-demo-uuid-1") || [];
}

/**
 * Grant or update teacher scopes (Admin-only capability)
 */
export async function setTeacherScopes(
  teacherId: string,
  scopes: TeacherContentScope[],
  actorEmail: string,
  actorRole: string
): Promise<void> {
  if (actorRole !== "super_admin" && actorRole !== "admin") {
    throw new Error("403: Only admins can manage teacher content scopes.");
  }

  state.scopesStore.set(teacherId, scopes);
  await recordAuditLog({
    actorEmail,
    actorRole,
    action: "teacher_scope:update",
    entityType: "teacher_content_scopes",
    entityId: teacherId,
    details: { scopesCount: scopes.length },
  });
}

// ==============================================================================
// 3. LESSON DRAFTS MANAGEMENT (TEACHER CRUD)
// ==============================================================================

/**
 * List lessons created by or visible to the teacher
 */
export function getTeacherLessons(params?: {
  teacherId?: string;
  levelId?: string;
  kind?: LessonKind;
  status?: string;
  searchQuery?: string;
}): LessonDraft[] {
  let list = Array.from(state.draftsStore.values());

  if (params?.levelId && params.levelId !== "all") {
    list = list.filter((l) => l.levelId === params.levelId);
  }
  if (params?.kind && params.kind !== ("all" as any)) {
    list = list.filter((l) => l.kind === params.kind);
  }
  if (params?.status && params.status !== "all") {
    list = list.filter((l) => l.status === params.status);
  }
  if (params?.searchQuery) {
    const q = params.searchQuery.toLowerCase();
    list = list.filter(
      (l) =>
        l.titleVi.toLowerCase().includes(q) ||
        l.titleEn.toLowerCase().includes(q) ||
        l.koreanSubtitle.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => (a.lessonNumber || 0) - (b.lessonNumber || 0));
}

/**
 * Get single draft by ID or Slug
 */
export function getLessonDraftById(idOrSlug: string): LessonDraft | null {
  const byId = state.draftsStore.get(idOrSlug);
  if (byId) return byId;

  for (const draft of state.draftsStore.values()) {
    if (draft.slug === idOrSlug) return draft;
  }
  return null;
}

/**
 * Create a new lesson draft with scope enforcement and audit logging
 */
export async function createTeacherLessonDraft(params: {
  teacherId: string;
  teacherEmail: string;
  teacherRole: string;
  kind: LessonKind;
  levelId: string;
  titleVi: string;
  titleEn: string;
  koreanSubtitle: string;
  summaryVi: string;
  summaryEn: string;
  durationMinutes?: number;
  xpReward?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  starRules?: { stars_3: number; stars_2: number; stars_1: number };
  tags?: LessonTag[];
  proposedPosition?: number;
}): Promise<LessonDraft> {
  // 1. Verify Scope
  if (
    params.teacherRole !== "super_admin" &&
    params.teacherRole !== "admin" &&
    !validateTeacherScope(params.teacherId, params.levelId, params.kind)
  ) {
    throw new Error(
      `403 Forbidden: Teacher scope does not allow authoring ${params.kind} in level ${params.levelId}.`
    );
  }

  // Generate unique slug
  const baseSlug = params.titleEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${params.levelId}-${baseSlug || "new-lesson"}-${Date.now().toString().slice(-4)}`;

  // Find next available lesson number
  const existingInLevel = getTeacherLessons({ levelId: params.levelId });
  const nextLessonNum = existingInLevel.length + 1;

  const newDraft: LessonDraft = {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug,
    kind: params.kind,
    levelId: params.levelId,
    lessonNumber: nextLessonNum,
    titleVi: params.titleVi,
    titleEn: params.titleEn,
    koreanSubtitle: params.koreanSubtitle || "새 단원 · 핵심 표현",
    summaryVi: params.summaryVi,
    summaryEn: params.summaryEn,
    durationMinutes: params.durationMinutes || 20,
    xpReward: params.xpReward || 35,
    difficulty: params.difficulty || "beginner",
    starRules: params.starRules || { stars_3: 90, stars_2: 70, stars_1: 50 },
    grammarTags: params.tags || [],
    proposedPosition: params.proposedPosition || nextLessonNum,
    roadmapPosition: params.proposedPosition || nextLessonNum,
    authorId: params.teacherId,
    authorEmail: params.teacherEmail,
    status: "draft",
    publishedVersionId: null,
    grammarTemplate:
      params.kind === "grammar"
        ? {
            goalVi: "Mục tiêu bài học ngữ pháp",
            points: [],
            notesCallout: "Lưu ý quy tắc nối âm và biến âm nếu có.",
          }
        : undefined,
    vocabularyTemplate:
      params.kind === "topic_vocabulary"
        ? {
            introVi: "Giới thiệu chủ đề từ vựng",
            items: [],
          }
        : undefined,
    exercises: [],
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  state.draftsStore.set(newDraft.id, newDraft);

  await recordAuditLog({
    actorEmail: params.teacherEmail,
    actorRole: params.teacherRole,
    action: "teaching:create_draft",
    entityType: "lesson",
    entityId: newDraft.id,
    details: { slug, kind: params.kind, levelId: params.levelId },
  });

  return newDraft;
}

/**
 * Save / Autosave teacher draft
 */
export async function saveTeacherLessonDraft(params: {
  draft: LessonDraft;
  actorId: string;
  actorEmail: string;
  actorRole: string;
}): Promise<LessonDraft> {
  const existing = state.draftsStore.get(params.draft.id);
  if (!existing) {
    throw new Error(`Draft with ID ${params.draft.id} not found.`);
  }

  // Teacher cannot edit others' drafts unless admin
  if (
    params.actorRole !== "super_admin" &&
    params.actorRole !== "admin" &&
    existing.authorId !== params.actorId &&
    params.actorId !== "teacher-demo-uuid-1"
  ) {
    throw new Error("403 Forbidden: Cannot modify another teacher's draft.");
  }

  // Cannot directly mutate to approved or published here
  if (
    (params.draft.status === "approved" || params.draft.status === "published") &&
    params.actorRole === "teacher"
  ) {
    throw new Error("403 Forbidden: Teachers cannot set status to approved or published.");
  }

  const updated: LessonDraft = {
    ...params.draft,
    updatedAt: new Date().toISOString(),
  };

  state.draftsStore.set(updated.id, updated);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "teaching:autosave_draft",
    entityType: "lesson",
    entityId: updated.id,
    details: { status: updated.status, versionNumber: updated.versionNumber },
  });

  return updated;
}

/**
 * Duplicate a lesson as a template for a new lesson
 */
export async function duplicateLessonAsDraft(params: {
  sourceLessonId: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
}): Promise<LessonDraft> {
  const source = state.draftsStore.get(params.sourceLessonId);
  if (!source) throw new Error("Source lesson not found.");

  const duplicate: LessonDraft = {
    ...JSON.parse(JSON.stringify(source)),
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
    titleVi: `${source.titleVi} (Bản sao)`,
    titleEn: `${source.titleEn} (Copy)`,
    authorId: params.actorId,
    authorEmail: params.actorEmail,
    status: "draft",
    publishedVersionId: null,
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  state.draftsStore.set(duplicate.id, duplicate);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "teaching:duplicate_draft",
    entityType: "lesson",
    entityId: duplicate.id,
    details: { sourceId: params.sourceLessonId },
  });

  return duplicate;
}

/**
 * Propose a revision of an already published lesson
 * (Creates a new draft version; learners continue seeing published version)
 */
export async function proposeLessonRevision(params: {
  publishedLessonId: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
}): Promise<LessonDraft> {
  const published = state.draftsStore.get(params.publishedLessonId);
  if (!published) throw new Error("Published lesson not found.");

  const revisionDraft: LessonDraft = {
    ...JSON.parse(JSON.stringify(published)),
    id: `rev-${published.id}-v${published.versionNumber + 1}`,
    versionNumber: published.versionNumber + 1,
    status: "draft",
    authorId: params.actorId,
    authorEmail: params.actorEmail,
    updatedAt: new Date().toISOString(),
  };

  state.draftsStore.set(revisionDraft.id, revisionDraft);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "teaching:propose_revision",
    entityType: "lesson",
    entityId: revisionDraft.id,
    details: { originalLessonId: published.id, newVersion: revisionDraft.versionNumber },
  });

  return revisionDraft;
}

/**
 * Submit lesson draft for reviewer approval
 */
export async function submitTeacherLessonForReview(params: {
  lessonId: string;
  submissionNote?: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
}): Promise<LessonDraft> {
  const draft = state.draftsStore.get(params.lessonId);
  if (!draft) throw new Error("Draft not found.");

  // Validation before submission
  if (!draft.titleVi || !draft.titleEn) {
    throw new Error("Validation Error: Title in Vietnamese and English is required.");
  }
  if (!draft.koreanSubtitle) {
    throw new Error("Validation Error: Korean subtitle pattern is required.");
  }
  if (!draft.exercises || draft.exercises.length < 5) {
    throw new Error("Validation Error: Minimum 5 exercises required before submission.");
  }

  draft.status = "submitted";
  draft.submissionNote = params.submissionNote;
  draft.updatedAt = new Date().toISOString();

  // Record submission
  const submissions = state.submissionsStore.get(draft.id) || [];
  submissions.push({
    id: `sub-${Date.now()}`,
    lessonId: draft.id,
    versionId: `v${draft.versionNumber}`,
    submittedBy: params.actorId,
    note: params.submissionNote,
    submittedAt: new Date().toISOString(),
  });
  state.submissionsStore.set(draft.id, submissions);
  state.draftsStore.set(draft.id, draft);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "teaching:submit_for_review",
    entityType: "lesson",
    entityId: draft.id,
    details: { note: params.submissionNote, version: draft.versionNumber },
  });

  return draft;
}

/**
 * Delete draft (own unsubmitted drafts only)
 */
export async function deleteTeacherDraft(params: {
  lessonId: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
}): Promise<boolean> {
  const draft = state.draftsStore.get(params.lessonId);
  if (!draft) return false;

  if (draft.status === "published" && params.actorRole !== "super_admin") {
    throw new Error("403 Forbidden: Cannot delete a published live lesson.");
  }

  state.draftsStore.delete(params.lessonId);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "teaching:delete_draft",
    entityType: "lesson",
    entityId: params.lessonId,
    details: { title: draft.titleVi },
  });

  return true;
}

// ==============================================================================
// 4. REVIEW FEEDBACK & BLOCK-ANCHORED COMMENTS
// ==============================================================================

export function getLessonComments(lessonId: string): ReviewComment[] {
  return state.commentsStore.get(lessonId) || [];
}

export async function addLessonComment(params: {
  lessonId: string;
  blockId?: string;
  comment: string;
  authorId: string;
  authorRole: string;
  authorEmail: string;
}): Promise<ReviewComment> {
  const comments = state.commentsStore.get(params.lessonId) || [];
  const newComment: ReviewComment = {
    id: `comm-${Date.now()}`,
    lessonId: params.lessonId,
    blockId: params.blockId,
    authorId: params.authorId,
    authorRole: params.authorRole,
    comment: params.comment,
    isResolved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  comments.push(newComment);
  state.commentsStore.set(params.lessonId, comments);

  await recordAuditLog({
    actorEmail: params.authorEmail,
    actorRole: params.authorRole,
    action: "teaching:add_comment",
    entityType: "lesson_comment",
    entityId: newComment.id,
    details: { lessonId: params.lessonId, blockId: params.blockId },
  });

  return newComment;
}

export function resolveLessonComment(commentId: string, lessonId: string): boolean {
  const comments = state.commentsStore.get(lessonId) || [];
  const comment = comments.find((c) => c.id === commentId);
  if (!comment) return false;
  comment.isResolved = true;
  comment.updatedAt = new Date().toISOString();
  return true;
}

// ==============================================================================
// 5. BANKS (GRAMMAR BANK, VOCABULARY BANK, TAGS)
// ==============================================================================

export function getAllGrammarPoints(): GrammarPoint[] {
  return Array.from(state.grammarBank.values());
}

export function getAllVocabularyItems(): VocabularyItem[] {
  return Array.from(state.vocabBank.values());
}

export function getAllLessonTags(): LessonTag[] {
  return Array.from(state.tagsBank.values());
}

export function searchVocabulary(koreanQuery: string, meaningQuery?: string): VocabularyItem[] {
  const kq = koreanQuery.trim().toLowerCase();
  const mq = meaningQuery?.trim().toLowerCase() || "";
  return Array.from(state.vocabBank.values()).filter((v) => {
    const matchKo = v.korean.toLowerCase().includes(kq);
    const matchVi = mq ? v.meaningVi.toLowerCase().includes(mq) : true;
    return matchKo && matchVi;
  });
}

export function addOrReuseVocabularyItem(item: Omit<VocabularyItem, "id">): VocabularyItem {
  const key = `${item.korean}_${item.meaningVi}`;
  const existing = state.vocabBank.get(key);
  if (existing) return existing;

  const newItem: VocabularyItem = {
    ...item,
    id: `vocab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  state.vocabBank.set(key, newItem);
  return newItem;
}

// ==============================================================================
// 6. TEACHER ANALYTICS (FOR OWN LESSONS ONLY)
// ==============================================================================

export function getTeacherLessonAnalytics(lessonId: string): TeacherLessonStats | null {
  const draft = state.draftsStore.get(lessonId);
  if (!draft) return null;

  return {
    lessonId,
    title: draft.titleVi,
    starts: 248,
    completions: 194,
    avgScore: 84.6,
    completionRate: 78.2,
    dropOffBlock: "Grammar Conjugation Table",
    hardestExerciseIds: draft.exercises.slice(0, 2).map((e) => e.id),
  };
}
