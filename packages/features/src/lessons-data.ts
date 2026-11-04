export interface VocabItem {
  id: string;
  korean: string;
  romaja: string;
  meaning: string;
  audioText: string;
  exampleKorean: string;
  exampleRomaja: string;
  exampleMeaning: string;
}

export interface GrammarRule {
  title: string;
  formula: string;
  explanation: string;
  examples: {
    korean: string;
    romaja: string;
    meaning: string;
  }[];
}

export type ExerciseType =
  | "multiple-choice"
  | "fill-blank"
  | "reorder"
  | "matching"
  | "listening"
  | "typing";

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  instruction: string;
  question: string;
  audioPrompt?: string;
  options?: string[];
  correctAnswer: string | string[];
  pairs?: { korean: string; meaning: string }[];
  wordBank?: string[];
  explanation: string;
  xp: number;
}

export interface LessonDetail {
  slug: string;
  title: string;
  koreanTitle: string;
  levelBadge: string;
  levelName: string;
  estimatedMinutes: number;
  totalXp: number;
  introduction: string;
  vocabulary: VocabItem[];
  grammarRules: GrammarRule[];
  exercises: ExerciseItem[];
}

export const LESSONS_DATABASE: Record<string, LessonDetail> = {
  "beginner-1-lesson-3-ayo-eoyo-endings": {
    slug: "beginner-1-lesson-3-ayo-eoyo-endings",
    title: "Bài 3: Đuôi câu thân mật -아요 / -어요 / -여요",
    koreanTitle: "해요체 기본 종결어미 (-아요 / -어요)",
    levelBadge: "TOPIK 1",
    levelName: "Sơ cấp 1 • Bài 3",
    estimatedMinutes: 25,
    totalXp: 50,
    introduction:
      "Trong đời sống thực tế tại Hàn Quốc, đuôi câu thân mật lịch sự (해요체) là dạng câu được sử dụng nhiều nhất (chiếm hơn 80% hội thoại). Hôm nay bạn sẽ nắm vững quy tắc chia đuôi câu này cho mọi động từ!",
    vocabulary: [
      {
        id: "v1",
        korean: "가다",
        romaja: "ga-da",
        meaning: "Đi (go)",
        audioText: "가다",
        exampleKorean: "저는 학교에 가요.",
        exampleRomaja: "Jeo-neun hak-gyo-e ga-yo.",
        exampleMeaning: "Tôi đi đến trường học.",
      },
      {
        id: "v2",
        korean: "오다",
        romaja: "o-da",
        meaning: "Đến, về (come)",
        audioText: "오다",
        exampleKorean: "친구가 집에 와요.",
        exampleRomaja: "Chin-gu-ga jib-e wa-yo.",
        exampleMeaning: "Bạn đến nhà tôi chơi.",
      },
      {
        id: "v3",
        korean: "먹다",
        romaja: "meok-da",
        meaning: "Ăn (eat)",
        audioText: "먹다",
        exampleKorean: "한국 음식을 먹어요.",
        exampleRomaja: "Han-guk eum-sig-eul meog-eo-yo.",
        exampleMeaning: "Tôi ăn món ăn Hàn Quốc.",
      },
      {
        id: "v4",
        korean: "마시다",
        romaja: "ma-si-da",
        meaning: "Uống (drink)",
        audioText: "마시다",
        exampleKorean: "커피를 마셔요.",
        exampleRomaja: "Keo-pi-reul ma-syeo-yo.",
        exampleMeaning: "Tôi uống cà phê.",
      },
      {
        id: "v5",
        korean: "공부하다",
        romaja: "gong-bu-ha-da",
        meaning: "Học tập (study)",
        audioText: "공부하다",
        exampleKorean: "한국어를 공부해요.",
        exampleRomaja: "Han-gug-eo-reul gong-bu-hae-yo.",
        exampleMeaning: "Tôi học tiếng Hàn Quốc.",
      },
      {
        id: "v6",
        korean: "보다",
        romaja: "bo-da",
        meaning: "Xem, nhìn (watch)",
        audioText: "보다",
        exampleKorean: "영화를 봐요.",
        exampleRomaja: "Yeong-hwa-reul bwa-yo.",
        exampleMeaning: "Tôi xem phim điện ảnh.",
      },
    ],
    grammarRules: [
      {
        title: "Quy tắc 1: Thân động từ có nguyên âm kết thúc là 'ㅏ' hoặc 'ㅗ' -> kết hợp với '-아요'",
        formula: "Thân động/tính từ (ㅏ, ㅗ) + -아요",
        explanation:
          "Các nguyên âm sáng (dương tính) sẽ đi cùng -아요. Khi không có phụ âm cuối (patchim), hai nguyên âm sẽ rút gọn lại (ví dụ: 가 + 아요 -> 가요; 보 + 아요 -> 봐요).",
        examples: [
          {
            korean: "가다 -> 가 + 아요 = 가요",
            romaja: "ga-da -> ga-yo",
            meaning: "Đi -> Tôi đi / Đi nhé.",
          },
          {
            korean: "보다 -> 보 + 아요 = 봐요",
            romaja: "bo-da -> bwa-yo",
            meaning: "Xem -> Tôi xem / Xem nhé.",
          },
          {
            korean: "살다 -> 살 + 아요 = 살아요",
            romaja: "sal-da -> sar-a-yo",
            meaning: "Sống -> Tôi đang sống.",
          },
        ],
      },
      {
        title: "Quy tắc 2: Thân động từ kết thúc bằng các nguyên âm còn lại -> kết hợp với '-어요'",
        formula: "Thân động/tính từ (ㅓ, ㅜ, ㅡ, ㅣ...) + -어요",
        explanation:
          "Các nguyên âm tối (âm tính) kết hợp với -어요. Ví dụ: 먹다 có âm ㅓ nên chia thành 먹어요. 마시다 có âm ㅣ kết hợp với 어요 biến thành 마셔요.",
        examples: [
          {
            korean: "먹다 -> 먹 + 어요 = 먹어요",
            romaja: "meok-da -> meog-eo-yo",
            meaning: "Ăn -> Tôi ăn.",
          },
          {
            korean: "마시다 -> 마시 + 어요 = 마셔요",
            romaja: "ma-si-da -> ma-syeo-yo",
            meaning: "Uống -> Tôi uống.",
          },
          {
            korean: "읽다 -> 읽 + 어요 = 읽어요",
            romaja: "ik-da -> ilg-eo-yo",
            meaning: "Đọc -> Tôi đọc sách.",
          },
        ],
      },
      {
        title: "Quy tắc 3: Động từ có đuôi '-하다' luôn biến đổi thành '-해요'",
        formula: "하다 -> 해요",
        explanation:
          "Tất cả các động từ kết thúc bằng '하다' (học tập, làm việc, yêu thương, điện thoại...) đều chia đồng nhất thành '해요'. Đây là quy tắc cực kỳ dễ nhớ!",
        examples: [
          {
            korean: "공부하다 -> 공부해요",
            romaja: "gong-bu-ha-da -> gong-bu-hae-yo",
            meaning: "Học tập -> Tôi học.",
          },
          {
            korean: "사랑하다 -> 사랑해요",
            romaja: "sa-rang-ha-da -> sa-rang-hae-yo",
            meaning: "Yêu -> Tôi yêu bạn.",
          },
          {
            korean: "운동하다 -> 운동해요",
            romaja: "un-dong-ha-da -> un-dong-hae-yo",
            meaning: "Tập thể dục -> Tôi tập thể thao.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "ex-1",
        type: "multiple-choice",
        instruction: "Dạng 1: Trắc nghiệm - Chọn đáp án đúng nhất",
        question: "Động từ '가다' (đi) khi chia sang đuôi câu thân mật -아요/어요 sẽ trở thành:",
        options: ["가어요", "가요", "가해요", "가시요"],
        correctAnswer: "가요",
        explanation:
          "Chính xác! Thân từ '가' chứa nguyên âm 'ㅏ' nên cộng với '-아요'. Do '가' không có patchim nên '가 + 아' rút gọn thành '가요'.",
        xp: 10,
      },
      {
        id: "ex-2",
        type: "fill-blank",
        instruction: "Dạng 2: Điền từ vào chỗ trống",
        question: "저는 지금 밥을 ______ (먹다 -> chia đuôi thân mật).",
        options: ["먹어요", "먹아요", "먹해요", "먹봐요"],
        correctAnswer: "먹어요",
        explanation:
          "Tuyệt vời! '먹다' có nguyên âm 'ㅓ' (không phải ㅏ hay ㅗ) nên kết hợp với '-어요' thành '먹어요'.",
        xp: 10,
      },
      {
        id: "ex-3",
        type: "reorder",
        instruction: "Dạng 3: Sắp xếp các từ theo trật tự đúng của ngữ pháp tiếng Hàn (Chủ ngữ - Tân ngữ - Động từ)",
        question: "Tạo thành câu: 'Tôi học tiếng Hàn Quốc'",
        wordBank: ["공부해요", "저는", "한국어를"],
        correctAnswer: ["저는", "한국어를", "공부해요"],
        explanation:
          "Xuất sắc! Trật tự câu tiếng Hàn chuẩn là: Chủ ngữ (저는) + Tân ngữ (한국어를) + Động từ vị ngữ cuối câu (공부해요).",
        xp: 15,
      },
      {
        id: "ex-4",
        type: "matching",
        instruction: "Dạng 4: Ghép từng cặp từ tiếng Hàn với nghĩa tương ứng",
        question: "Hãy chọn 1 từ tiếng Hàn và 1 từ nghĩa tương ứng để nối cặp:",
        pairs: [
          { korean: "마시다", meaning: "Uống (drink)" },
          { korean: "보다", meaning: "Xem, nhìn (watch)" },
          { korean: "사랑하다", meaning: "Yêu thương (love)" },
          { korean: "오다", meaning: "Đến, về (come)" },
        ],
        correctAnswer: "all-matched",
        explanation:
          "Chuẩn xác 100%! Bạn đã ghi nhớ rất tốt các động từ cốt lõi này.",
        xp: 15,
      },
      {
        id: "ex-5",
        type: "listening",
        instruction: "Dạng 5: Nghe phát âm và chọn câu có nghĩa đúng",
        question: "Bấm nút loa để nghe giọng đọc bản xứ rồi chọn câu bạn nghe được:",
        audioPrompt: "커피를 마셔요.",
        options: [
          "커피를 마셔요 (Tôi uống cà phê)",
          "콜라를 마셔요 (Tôi uống coca)",
          "영화를 봐요 (Tôi xem phim)",
          "밥을 먹어요 (Tôi ăn cơm)",
        ],
        correctAnswer: "커피를 마셔요 (Tôi uống cà phê)",
        explanation:
          "Chính xác! Giọng đọc vừa phát âm câu: '커피를 마셔요.' (Tôi uống cà phê).",
        xp: 15,
      },
      {
        id: "ex-6",
        type: "typing",
        instruction: "Dạng 6: Gõ chữ Hàn Quốc - Luyện phản xạ bàn phím",
        question: "Chia động từ '사랑하다' sang đuôi thân mật và gõ vào ô bên dưới:",
        correctAnswer: "사랑해요",
        explanation:
          "Hoàn hảo! Đuôi '-하다' luôn biến đổi thành '-해요', tạo thành từ '사랑해요' (Anh yêu em / Em yêu anh).",
        xp: 20,
      },
    ],
  },
};

// Backward-compatible alias for the old Vietnamese slug
LESSONS_DATABASE["so-cap-1-bai-3-duoi-cau-ayo-eoyo"] =
  LESSONS_DATABASE["beginner-1-lesson-3-ayo-eoyo-endings"];
