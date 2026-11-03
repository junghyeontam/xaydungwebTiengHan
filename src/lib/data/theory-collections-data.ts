export interface TheoryVocabWord {
  id: string;
  korean: string;
  romaja: string;
  partOfSpeech: string;
  meaningVi: string;
  meaningEn?: string;
  exampleKo: string;
  exampleVi: string;
  audioUrl?: string;
  isLearned?: boolean;
  topikLevel: "topik-1" | "topik-2" | "topik-3" | "topik-4" | "topik-5" | "topik-6";
  chapterId: string;
  chapterTitleVi: string;
}

export interface GrammarPracticeDrill {
  id: string;
  type: "conjugation" | "fill-blank";
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanationVi: string;
}

export interface TheoryGrammarItem {
  id: string;
  titleVi: string;
  koreanPattern: string;
  formula: string;
  explanationVi: string;
  attachmentRules?: { condition: string; example: string }[];
  examples: { korean: string; romaja: string; meaningVi: string }[];
  practiceDrills?: GrammarPracticeDrill[];
  isLearned?: boolean;
  topikLevel: "topik-1" | "topik-2" | "topik-3" | "topik-4" | "topik-5" | "topik-6";
  chapterId: string;
  chapterTitleVi: string;
}

export interface TheoryChapter<T> {
  id: string;
  titleVi: string;
  koreanSubtitle: string;
  descriptionVi: string;
  items: T[];
}

export interface TheoryCollectionCard {
  id: string;
  type: "vocab" | "grammar" | "topic";
  titleVi: string;
  koreanTitle: string;
  levelBadge: string;
  topikLevel: string;
  completedCount: number;
  totalCount: number;
  iconType: "vocab-book" | "unlearned" | "grammar-search" | "topic-card";
  accentColor: string;
  chapters: TheoryChapter<TheoryVocabWord | TheoryGrammarItem>[];
}

// Initial Seed Data matching the user's reference (Image 2)
export const INITIAL_THEORY_COLLECTIONS: TheoryCollectionCard[] = [
  // 1. TỪ VỰNG: TOPIK 1
  {
    id: "vocab-topik-1",
    type: "vocab",
    titleVi: "Từ vựng cấp độ TOPIK 1",
    koreanTitle: "토픽 1급 필수 어휘",
    levelBadge: "Cấp độ 1",
    topikLevel: "topik-1",
    completedCount: 366,
    totalCount: 838,
    iconType: "vocab-book",
    accentColor: "emerald",
    chapters: [
      {
        id: "v1-c1",
        titleVi: "Chương 1: Chào hỏi, Bản thân & Quốc tịch",
        koreanSubtitle: "인사 · 자기소개 · 국적",
        descriptionVi: "Các từ vựng mở đầu giao tiếp tiếng Hàn cơ bản và lịch sự nhất.",
        items: [
          {
            id: "v-101",
            korean: "안녕하세요",
            romaja: "annyeonghaseyo",
            partOfSpeech: "Thán từ",
            meaningVi: "Xin chào (trang trọng, lịch sự)",
            meaningEn: "Hello / Good morning",
            exampleKo: "안녕하세요, 저는 민수입니다.",
            exampleVi: "Xin chào, tôi là Minsoo.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c1",
            chapterTitleVi: "Chương 1: Chào hỏi & Bản thân",
          },
          {
            id: "v-102",
            korean: "감사합니다",
            romaja: "gamsahamnida",
            partOfSpeech: "Động từ",
            meaningVi: "Cảm ơn (trang trọng)",
            meaningEn: "Thank you",
            exampleKo: "도와주셔서 감사합니다.",
            exampleVi: "Cảm ơn vì đã giúp đỡ tôi.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c1",
            chapterTitleVi: "Chương 1: Chào hỏi & Bản thân",
          },
          {
            id: "v-103",
            korean: "죄송합니다",
            romaja: "joesonghamnida",
            partOfSpeech: "Động từ",
            meaningVi: "Xin lỗi",
            meaningEn: "I am sorry",
            exampleKo: "늦어서 정말 죄송합니다.",
            exampleVi: "Tôi thật sự xin lỗi vì đến muộn.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c1",
            chapterTitleVi: "Chương 1: Chào hỏi & Bản thân",
          },
          {
            id: "v-104",
            korean: "한국",
            romaja: "hanguk",
            partOfSpeech: "Danh từ",
            meaningVi: "Hàn Quốc",
            meaningEn: "Korea",
            exampleKo: "저는 한국 사람입니다.",
            exampleVi: "Tôi là người Hàn Quốc.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c1",
            chapterTitleVi: "Chương 1: Chào hỏi & Bản thân",
          },
          {
            id: "v-105",
            korean: "베트남",
            romaja: "beteunam",
            partOfSpeech: "Danh từ",
            meaningVi: "Việt Nam",
            meaningEn: "Vietnam",
            exampleKo: "저는 베트남에서 왔어요.",
            exampleVi: "Tôi đến từ Việt Nam.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c1",
            chapterTitleVi: "Chương 1: Chào hỏi & Bản thân",
          },
          {
            id: "v-106",
            korean: "선생님",
            romaja: "seonsaengnim",
            partOfSpeech: "Danh từ",
            meaningVi: "Thầy giáo / Cô giáo",
            meaningEn: "Teacher",
            exampleKo: "선생님, 질문이 있습니다.",
            exampleVi: "Thưa thầy, em có câu hỏi ạ.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "v1-c1",
            chapterTitleVi: "Chương 1: Chào hỏi & Bản thân",
          },
        ],
      },
      {
        id: "v1-c2",
        titleVi: "Chương 2: Trường học & Đồ vật hàng ngày",
        koreanSubtitle: "학교와 일상 사물",
        descriptionVi: "Tên gọi các dụng cụ học tập, phòng học và vật dụng quen thuộc xung quanh bạn.",
        items: [
          {
            id: "v-107",
            korean: "책상",
            romaja: "chaeksang",
            partOfSpeech: "Danh từ",
            meaningVi: "Bàn học",
            meaningEn: "Desk",
            exampleKo: "책상 위에 책이 있어요.",
            exampleVi: "Trên bàn học có sách.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c2",
            chapterTitleVi: "Chương 2: Trường học & Đồ vật",
          },
          {
            id: "v-108",
            korean: "의자",
            romaja: "uija",
            partOfSpeech: "Danh từ",
            meaningVi: "Cái ghế",
            meaningEn: "Chair",
            exampleKo: "편한 의자에 앉으세요.",
            exampleVi: "Xin mời ngồi vào chiếc ghế thoải mái.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c2",
            chapterTitleVi: "Chương 2: Trường học & Đồ vật",
          },
          {
            id: "v-109",
            korean: "공책",
            romaja: "gongchaek",
            partOfSpeech: "Danh từ",
            meaningVi: "Vở ghi bài",
            meaningEn: "Notebook",
            exampleKo: "공책에 이름을 적어요.",
            exampleVi: "Ghi tên vào vở ghi chép.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "v1-c2",
            chapterTitleVi: "Chương 2: Trường học & Đồ vật",
          },
          {
            id: "v-110",
            korean: "연필",
            romaja: "yeonpil",
            partOfSpeech: "Danh từ",
            meaningVi: "Bút chì",
            meaningEn: "Pencil",
            exampleKo: "연필로 글씨를 써요.",
            exampleVi: "Viết chữ bằng bút chì.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "v1-c2",
            chapterTitleVi: "Chương 2: Trường học & Đồ vật",
          },
        ],
      },
      {
        id: "v1-c3",
        titleVi: "Chương 3: Sinh hoạt hàng ngày & Ăn uống",
        koreanSubtitle: "일상생활과 음식",
        descriptionVi: "Hành động sinh hoạt từ sáng đến tối: ăn cơm, uống nước, nghỉ ngơi.",
        items: [
          {
            id: "v-111",
            korean: "밥",
            romaja: "bap",
            partOfSpeech: "Danh từ",
            meaningVi: "Cơm / Bữa ăn",
            meaningEn: "Rice / Meal",
            exampleKo: "밥을 맛있게 먹었어요.",
            exampleVi: "Tôi đã ăn cơm rất ngon miệng.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c3",
            chapterTitleVi: "Chương 3: Sinh hoạt & Ăn uống",
          },
          {
            id: "v-112",
            korean: "물",
            romaja: "mul",
            partOfSpeech: "Danh từ",
            meaningVi: "Nước uống",
            meaningEn: "Water",
            exampleKo: "물 한 잔 주세요.",
            exampleVi: "Cho tôi xin một ly nước.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "v1-c3",
            chapterTitleVi: "Chương 3: Sinh hoạt & Ăn uống",
          },
          {
            id: "v-113",
            korean: "자다",
            romaja: "jada",
            partOfSpeech: "Động từ",
            meaningVi: "Ngủ",
            meaningEn: "To sleep",
            exampleKo: "밤 11시에 자요.",
            exampleVi: "Tôi ngủ lúc 11 giờ đêm.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "v1-c3",
            chapterTitleVi: "Chương 3: Sinh hoạt & Ăn uống",
          },
          {
            id: "v-114",
            korean: "일어나다",
            romaja: "ireonada",
            partOfSpeech: "Động từ",
            meaningVi: "Thức dậy",
            meaningEn: "To wake up",
            exampleKo: "아침 7시에 일어나요.",
            exampleVi: "Tôi thức dậy vào lúc 7 giờ sáng.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "v1-c3",
            chapterTitleVi: "Chương 3: Sinh hoạt & Ăn uống",
          },
        ],
      },
    ],
  },

  // 2. TỪ VỰNG: CHƯA THUỘC (SRS / Focus list)
  {
    id: "vocab-unlearned",
    type: "vocab",
    titleVi: "Từ vựng chưa thuộc",
    koreanTitle: "복습 필요 어휘",
    levelBadge: "Cần ôn tập",
    topikLevel: "topik-1",
    completedCount: 25,
    totalCount: 838,
    iconType: "unlearned",
    accentColor: "amber",
    chapters: [
      {
        id: "vu-c1",
        titleVi: "Danh sách 25 từ cần luyện tập thêm",
        koreanSubtitle: "반복 학습 단어 25개",
        descriptionVi: "Hệ thống tự động lọc các từ bạn trả lời sai hoặc cần lặp lại theo Spaced Repetition.",
        items: [
          {
            id: "v-106",
            korean: "선생님",
            romaja: "seonsaengnim",
            partOfSpeech: "Danh từ",
            meaningVi: "Thầy giáo / Cô giáo",
            meaningEn: "Teacher",
            exampleKo: "선생님, 질문이 있습니다.",
            exampleVi: "Thưa thầy, em có câu hỏi ạ.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "vu-c1",
            chapterTitleVi: "Từ cần ôn tập",
          },
          {
            id: "v-109",
            korean: "공책",
            romaja: "gongchaek",
            partOfSpeech: "Danh từ",
            meaningVi: "Vở ghi bài",
            meaningEn: "Notebook",
            exampleKo: "공책에 이름을 적어요.",
            exampleVi: "Ghi tên vào vở ghi chép.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "vu-c1",
            chapterTitleVi: "Từ cần ôn tập",
          },
          {
            id: "v-110",
            korean: "연필",
            romaja: "yeonpil",
            partOfSpeech: "Danh từ",
            meaningVi: "Bút chì",
            meaningEn: "Pencil",
            exampleKo: "연필로 글씨를 써요.",
            exampleVi: "Viết chữ bằng bút chì.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "vu-c1",
            chapterTitleVi: "Từ cần ôn tập",
          },
          {
            id: "v-113",
            korean: "자다",
            romaja: "jada",
            partOfSpeech: "Động từ",
            meaningVi: "Ngủ",
            meaningEn: "To sleep",
            exampleKo: "밤 11시에 자요.",
            exampleVi: "Tôi ngủ lúc 11 giờ đêm.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "vu-c1",
            chapterTitleVi: "Từ cần ôn tập",
          },
          {
            id: "v-114",
            korean: "일어나다",
            romaja: "ireonada",
            partOfSpeech: "Động từ",
            meaningVi: "Thức dậy",
            meaningEn: "To wake up",
            exampleKo: "아침 7시에 일어나요.",
            exampleVi: "Tôi thức dậy vào lúc 7 giờ sáng.",
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "vu-c1",
            chapterTitleVi: "Từ cần ôn tập",
          },
        ],
      },
    ],
  },

  // 3. TỪ VỰNG: TOPIK 2
  {
    id: "vocab-topik-2",
    type: "vocab",
    titleVi: "Từ vựng cấp độ TOPIK 2",
    koreanTitle: "토픽 2급 중급 진입 어휘",
    levelBadge: "Cấp độ 2",
    topikLevel: "topik-2",
    completedCount: 120,
    totalCount: 950,
    iconType: "vocab-book",
    accentColor: "blue",
    chapters: [
      {
        id: "v2-c1",
        titleVi: "Chương 1: Mua sắm, Đổi hàng & Giá cả",
        koreanSubtitle: "쇼핑 · 교환 · 가격",
        descriptionVi: "Từ vựng khi đi chợ, siêu thị, trung tâm thương mại và mặc cả giá tiền.",
        items: [
          {
            id: "v-201",
            korean: "얼마예요?",
            romaja: "eolmayeyo",
            partOfSpeech: "Mẫu câu",
            meaningVi: "Bao nhiêu tiền ạ?",
            exampleKo: "이 사과 얼마예요?",
            exampleVi: "Quả táo này bao nhiêu tiền ạ?",
            isLearned: true,
            topikLevel: "topik-2",
            chapterId: "v2-c1",
            chapterTitleVi: "Chương 1: Mua sắm",
          },
          {
            id: "v-202",
            korean: "깎아주세요",
            romaja: "kkakkajuseyo",
            partOfSpeech: "Mẫu câu",
            meaningVi: "Bớt giá cho tôi một chút nhé",
            exampleKo: "조금만 깎아주세요.",
            exampleVi: "Giảm giá cho tôi một chút đi ạ.",
            isLearned: false,
            topikLevel: "topik-2",
            chapterId: "v2-c1",
            chapterTitleVi: "Chương 1: Mua sắm",
          },
        ],
      },
    ],
  },

  // 4. NGỮ PHÁP: TOPIK 1 (38/53)
  {
    id: "grammar-topik-1",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 1",
    koreanTitle: "토픽 1급 핵심 문법",
    levelBadge: "TOPIK 1",
    topikLevel: "topik-1",
    completedCount: 38,
    totalCount: 53,
    iconType: "grammar-search",
    accentColor: "emerald",
    chapters: [
      {
        id: "g1-c1",
        titleVi: "Chương 1: Trợ từ và Đuôi câu danh từ",
        koreanSubtitle: "조사와 명사 종결어미",
        descriptionVi: "Nền tảng cấu trúc câu tiếng Hàn với tiểu từ chủ đề và khẳng định danh từ.",
        items: [
          {
            id: "g-101",
            titleVi: "1. Tiểu từ chủ đề: 은 / 는",
            koreanPattern: "N은/는",
            formula: "Danh từ + 은 (có 받침) / 는 (không có 받침)",
            explanationVi: "Đứng sau danh từ để biểu thị danh từ đó là chủ đề chính của câu hoặc dùng khi so sánh, đối chiếu.",
            attachmentRules: [
              { condition: "Danh từ kết thúc có phụ âm dưới (받침)", example: "선생님 + 은 -> 선생님은" },
              { condition: "Danh từ kết thúc không có phụ âm dưới", example: "저 + 는 -> 저는" },
            ],
            examples: [
              { korean: "저는 베트남 사람이에요.", romaja: "jeoneun beteunam saram-ieyo.", meaningVi: "Tôi là người Việt Nam." },
              { korean: "이 책은 재미있어요.", romaja: "i chaek-eun jaemiisseoyo.", meaningVi: "Cuốn sách này thú vị." },
            ],
            practiceDrills: [
              {
                id: "d-101-1",
                type: "conjugation",
                prompt: "선생님 (thầy giáo) + [ 은 / 는 ]",
                options: ["선생님은", "선생님는"],
                correctAnswer: "선생님은",
                explanationVi: "Danh từ 선생님 kết thúc bằng phụ âm dưới (받침 ㅁ) nên kết hợp với 은.",
              },
              {
                id: "d-101-2",
                type: "conjugation",
                prompt: "저 (tôi) + [ 은 / 는 ]",
                options: ["저는", "저은"],
                correctAnswer: "저는",
                explanationVi: "Danh từ 저 kết thúc không có phụ âm dưới (không có 받침) nên kết hợp với 는.",
              },
              {
                id: "d-101-3",
                type: "fill-blank",
                prompt: "저 [ ___ ] 베트남 사람이에요.",
                options: ["는", "은", "이", "가"],
                correctAnswer: "는",
                explanationVi: "Chủ đề 'Tôi là ai' dùng 는 vì danh từ '저' không có 받침.",
              },
              {
                id: "d-101-4",
                type: "fill-blank",
                prompt: "이 책 [ ___ ] 정말 재미있어요.",
                options: ["은", "는", "를", "에"],
                correctAnswer: "은",
                explanationVi: "Danh từ '책' có phụ âm dưới (받침 ㄱ) nên gắn với tiểu từ chủ đề '은'.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-c1",
            chapterTitleVi: "Chương 1: Trợ từ & Đuôi danh từ",
          },
          {
            id: "g-102",
            titleVi: "2. Đuôi câu danh từ thân mật: 이에요 / 예요",
            koreanPattern: "N이에요/예요",
            formula: "Danh từ + 이에요 (có 받침) / 예よ (không có 받침)",
            explanationVi: "Đuôi câu kết thúc khẳng định thân mật lịch sự, tương đương với 'Là [Danh từ]' trong tiếng Việt.",
            attachmentRules: [
              { condition: "Có 받침", example: "학생 + 이에요 -> 학생이에요" },
              { condition: "Không có 받침", example: "의사 + 예요 -> 의사예요" },
            ],
            examples: [
              { korean: "저는 학생이에요.", romaja: "jeoneun haksaeng-ieyo.", meaningVi: "Tôi là học sinh." },
              { korean: "여기는 제 방이에요.", romaja: "yeogineun je bang-ieyo.", meaningVi: "Đây là phòng của tôi." },
            ],
            practiceDrills: [
              {
                id: "d-102-1",
                type: "conjugation",
                prompt: "학생 (học sinh) + [ 이에요 / 예요 ]",
                options: ["학생이에요", "학생예요"],
                correctAnswer: "학생이에요",
                explanationVi: "학생 có 받침 (ㅇ) nên gắn với 이에요.",
              },
              {
                id: "d-102-2",
                type: "conjugation",
                prompt: "의사 (bác sĩ) + [ 이에요 / 예요 ]",
                options: ["의사예요", "의사이에요"],
                correctAnswer: "의사예요",
                explanationVi: "의사 không có 받침 nên gắn với 예요.",
              },
              {
                id: "d-102-3",
                type: "fill-blank",
                prompt: "여기는 제 방 [ ___ ].",
                options: ["이에요", "예요", "있어요", "없어요"],
                correctAnswer: "이에요",
                explanationVi: "방 có 받침 (ㅇ) nên đuôi câu kết thúc là 이에요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-c1",
            chapterTitleVi: "Chương 1: Trợ từ & Đuôi danh từ",
          },
          {
            id: "g-103",
            titleVi: "3. Tiểu từ chủ ngữ: 이 / 가",
            koreanPattern: "N이/가",
            formula: "Danh từ + 이 (có 받침) / 가 (không có 받침)",
            explanationVi: "Nhấn mạnh vào chủ thể thực hiện hành động hoặc trạng thái cụ thể trong câu.",
            attachmentRules: [
              { condition: "Có 받침", example: "가방 + 이 -> 가방이" },
              { condition: "Không có 받침", example: "날씨 + 가 -> 날씨가" },
            ],
            examples: [
              { korean: "날씨가 정말 좋아요.", romaja: "nalssiga jeongmal joayo.", meaningVi: "Thời tiết thực sự rất đẹp." },
            ],
            practiceDrills: [
              {
                id: "d-103-1",
                type: "conjugation",
                prompt: "가방 (cặp sách) + [ 이 / 가 ]",
                options: ["가방이", "가방가"],
                correctAnswer: "가방이",
                explanationVi: "가방 có 받침 (ㅇ) nên kết hợp với 이.",
              },
              {
                id: "d-103-2",
                type: "fill-blank",
                prompt: "오늘 날씨 [ ___ ] 정말 좋아요.",
                options: ["가", "이", "는", "을"],
                correctAnswer: "가",
                explanationVi: "날씨 không có 받침 nên đi với tiểu từ chủ ngữ 가.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-c1",
            chapterTitleVi: "Chương 1: Trợ từ & Đuôi danh từ",
          },
          {
            id: "g-104",
            titleVi: "4. Tồn tại & Sở hữu: 있어요 / 없어요",
            koreanPattern: "N이/가 있어요/없어요",
            formula: "Danh từ + 이/가 + 있어요 (có) / 없어요 (không có)",
            explanationVi: "Dùng để diễn tả ai đó, vật gì đó đang có mặt ở đâu hoặc thuộc quyền sở hữu của ai.",
            examples: [
              { korean: "시간이 있어요?", romaja: "sigani isseoyo?", meaningVi: "Bạn có thời gian không?" },
              { korean: "돈이 없어요.", romaja: "doni eopseoyo.", meaningVi: "Tôi không có tiền." },
            ],
            practiceDrills: [
              {
                id: "d-104-1",
                type: "fill-blank",
                prompt: "지금 시간 [ ___ ] 있어요?",
                options: ["이", "가", "을", "에"],
                correctAnswer: "이",
                explanationVi: "시간 có 받침 nên đi với tiểu từ 이 trước 있어요.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "g1-c1",
            chapterTitleVi: "Chương 1: Trợ từ & Đuôi danh từ",
          },
        ],
      },
      {
        id: "g1-c2",
        titleVi: "Chương 2: Đuôi câu động từ & Tính từ hiện tại",
        koreanSubtitle: "해요체와 기본 어미",
        descriptionVi: "Quy tắc chia đuôi câu -아요 / -어요 / -해요 phổ biến nhất trong đời sống Hàn Quốc.",
        items: [
          {
            id: "g-105",
            titleVi: "5. Đuôi câu hiện tại thân mật: -아요 / -어요 / -해요",
            koreanPattern: "A/V-아요/어요",
            formula: "Gốc động từ có ㅏ, ㅗ + 아요 | còn lại + 어요 | 하다 -> 해요",
            explanationVi: "Đuôi câu giao tiếp tự nhiên và chuẩn mực nhất cho người lớn tuổi hoặc đồng nghiệp thân thiện.",
            attachmentRules: [
              { condition: "Nguyên âm dương tính (ㅏ, ㅗ)", example: "가다 + 아요 -> 가요 | 보다 + 아요 -> 봐요" },
              { condition: "Nguyên âm âm tính (các âm còn lại)", example: "먹다 + 어요 -> 먹어요 | 마시다 + 어요 -> 마셔요" },
              { condition: "Động từ đuôi 하다", example: "공부하다 -> 공부해요 | 운동하다 -> 운동해요" },
            ],
            examples: [
              { korean: "지금 밥을 먹어요.", romaja: "jigeum babeul meogeoyo.", meaningVi: "Bây giờ tôi ăn cơm." },
              { korean: "매일 한국어를 공부해요.", romaja: "maeil hangugeoreul gongbuhaeyo.", meaningVi: "Mỗi ngày tôi đều học tiếng Hàn." },
            ],
            practiceDrills: [
              {
                id: "d-105-1",
                type: "conjugation",
                prompt: "가다 (đi) -> chia đuôi 해요체:",
                options: ["가요", "가어요", "가해요"],
                correctAnswer: "가요",
                explanationVi: "가다 có nguyên âm ㅏ nên kết hợp với 아요 (rút gọn thành 가요).",
              },
              {
                id: "d-105-2",
                type: "conjugation",
                prompt: "먹다 (ăn) -> chia đuôi 해요체:",
                options: ["먹어요", "먹아요", "먹해요"],
                correctAnswer: "먹어요",
                explanationVi: "먹다 có nguyên âm ㅓ nên kết hợp với 어요 -> 먹어요.",
              },
              {
                id: "d-105-3",
                type: "conjugation",
                prompt: "공부하다 (học tập) -> chia đuôi 해요체:",
                options: ["공부해요", "공부하아요", "공부하어요"],
                correctAnswer: "공부해요",
                explanationVi: "Tất cả động từ đuôi 하다 đều chuyển thành 해요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-c2",
            chapterTitleVi: "Chương 2: Đuôi câu hiện tại",
          },
          {
            id: "g-106",
            titleVi: "6. Tiểu từ tân ngữ: 을 / 를",
            koreanPattern: "N을/를",
            formula: "Danh từ + 을 (có 받침) / 를 (không có 받침)",
            explanationVi: "Đứng sau danh từ chịu sự tác động trực tiếp của ngoại động từ (như ăn, uống, học, đọc...).",
            attachmentRules: [
              { condition: "Danh từ có 받침", example: "밥 + 을 -> 밥을" },
              { condition: "Danh từ không có 받침", example: "사과 + 를 -> 사과를" },
            ],
            examples: [
              { korean: "사과를 먹어요.", romaja: "sagwareul meogeoyo.", meaningVi: "Tôi ăn táo." },
              { korean: "한국어를 배워요.", romaja: "hangugeoreul baewoyo.", meaningVi: "Tôi học tiếng Hàn." },
            ],
            practiceDrills: [
              {
                id: "d-106-1",
                type: "conjugation",
                prompt: "밥 (cơm) + [ 을 / 를 ]",
                options: ["밥을", "밥를"],
                correctAnswer: "밥을",
                explanationVi: "밥 có 받침 ㅂ nên gắn với 을.",
              },
              {
                id: "d-106-2",
                type: "fill-blank",
                prompt: "저는 책 [ ___ ] 읽어요.",
                options: ["을", "를", "이", "가"],
                correctAnswer: "을",
                explanationVi: "책 có 받침 ㄱ và là tân ngữ của động từ 읽다 (đọc) nên đi với 을.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-c2",
            chapterTitleVi: "Chương 2: Đuôi câu hiện tại",
          },
          {
            id: "g-107",
            titleVi: "7. Hướng di chuyển & Địa điểm: -에 가요 / 와요",
            koreanPattern: "N(địa điểm)-에 가요/와요",
            formula: "Danh từ nơi chốn + 에 + 가요 (đi) / 와요 (đến)",
            explanationVi: "Chỉ đích đến, phương hướng di chuyển tới một địa điểm cụ thể.",
            examples: [
              { korean: "학교에 가요.", romaja: "hakgyoe gayo.", meaningVi: "Tôi đi đến trường học." },
              { korean: "집에 와요.", romaja: "jibe wayo.", meaningVi: "Tôi về nhà." },
            ],
            practiceDrills: [
              {
                id: "d-107-1",
                type: "fill-blank",
                prompt: "지금 도서관 [ ___ ] 가요.",
                options: ["에", "에서", "을", "는"],
                correctAnswer: "에",
                explanationVi: "Đích đến di chuyển với động từ 가다 luôn đi với tiểu từ 에.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "g1-c2",
            chapterTitleVi: "Chương 2: Đuôi câu hiện tại",
          },
          {
            id: "g-108",
            titleVi: "8. Câu phủ định cơ bản: 안 V / V-지 않아요",
            koreanPattern: "안 V / V-지 않아요",
            formula: "안 + Động từ (phủ định ngắn) | Gốc động từ + 지 않아요 (phủ định dài)",
            explanationVi: "Dùng để diễn tả việc không làm một hành động hoặc không có một trạng thái nào đó.",
            examples: [
              { korean: "커피를 안 마셔요.", romaja: "keopireul an masyeoyo.", meaningVi: "Tôi không uống cà phê." },
              { korean: "맵지 않아요.", romaja: "maepji anayo.", meaningVi: "Món này không cay." },
            ],
            practiceDrills: [
              {
                id: "d-108-1",
                type: "conjugation",
                prompt: "가다 -> phủ định ngắn:",
                options: ["안 가요", "가 안요", "안 가지요"],
                correctAnswer: "안 가요",
                explanationVi: "Phủ định ngắn đặt '안' ngay trước động từ: 안 + 가요.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "g1-c2",
            chapterTitleVi: "Chương 2: Đuôi câu hiện tại",
          },
        ],
      },
    ],
  },

  // 5. NGỮ PHÁP: TOPIK 2 (9/46)
  {
    id: "grammar-topik-2",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 2",
    koreanTitle: "토픽 2급 필수 문법",
    levelBadge: "TOPIK 2",
    topikLevel: "topik-2",
    completedCount: 9,
    totalCount: 46,
    iconType: "grammar-search",
    accentColor: "sky",
    chapters: [
      {
        id: "g2-c1",
        titleVi: "Chương 1: Liên kết câu - Nguyên nhân & Kết quả",
        koreanSubtitle: "이유와 결과 연결어미",
        descriptionVi: "Cách nói 'Vì... nên...', 'Bởi vì' với -아서/어서 và -(으)니까.",
        items: [
          {
            id: "g-201",
            titleVi: "1. Nguyên nhân tự nhiên: -아/어서",
            koreanPattern: "A/V-아/어서",
            formula: "V/A + 아/어서",
            explanationVi: "Dùng để diễn tả lý do, nguyên nhân dẫn đến hành động hoặc trạng thái ở vế sau. Không dùng với mệnh lệnh.",
            examples: [
              { korean: "비가 와서 집에 있어요.", romaja: "biga waseo jibe isseoyo.", meaningVi: "Vì trời mưa nên tôi ở nhà." },
            ],
            isLearned: true,
            topikLevel: "topik-2",
            chapterId: "g2-c1",
            chapterTitleVi: "Chương 1: Nguyên nhân & Kết quả",
          },
        ],
      },
    ],
  },

  // 6. NGỮ PHÁP: TOPIK 3 (3/50)
  {
    id: "grammar-topik-3",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 3",
    koreanTitle: "토픽 3급 중급 문법",
    levelBadge: "TOPIK 3",
    topikLevel: "topik-3",
    completedCount: 3,
    totalCount: 50,
    iconType: "grammar-search",
    accentColor: "indigo",
    chapters: [
      {
        id: "g3-c1",
        titleVi: "Chương 1: Dự đoán & Suy đoán khách quan",
        koreanSubtitle: "추측과 예측 표현",
        descriptionVi: "Ngữ pháp -(으)ㄴ/는 것 같다, -(으)ㄹ 지도 모르다 trong giao tiếp trung cấp.",
        items: [
          {
            id: "g-301",
            titleVi: "1. Suy đoán: -(으)ㄴ/는 것 같다",
            koreanPattern: "A/V-(으)ㄴ/는 것 같다",
            formula: "V + 는 것 같다 | A + (으)ㄴ 것 같다",
            explanationVi: "Biểu thị suy đoán lịch sự, nhẹ nhàng: 'Có vẻ như là...', 'Dường như là...'.",
            examples: [
              { korean: "내일 비가 올 것 같아요.", romaja: "naeil biga ol geot gat-ayo.", meaningVi: "Có vẻ ngày mai trời sẽ mưa đấy." },
            ],
            isLearned: true,
            topikLevel: "topik-3",
            chapterId: "g3-c1",
            chapterTitleVi: "Chương 1: Suy đoán",
          },
        ],
      },
    ],
  },

  // 7. NGỮ PHÁP: TOPIK 4 (0/48)
  {
    id: "grammar-topik-4",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 4",
    koreanTitle: "토픽 4급 중고급 문 pháp",
    levelBadge: "TOPIK 4",
    topikLevel: "topik-4",
    completedCount: 0,
    totalCount: 48,
    iconType: "grammar-search",
    accentColor: "purple",
    chapters: [
      {
        id: "g4-c1",
        titleVi: "Chương 1: Trích dẫn gián tiếp & Văn phong báo chí",
        koreanSubtitle: "간접화법과 신문 문체",
        descriptionVi: "Ngữ pháp trích dẫn -다고 하다, -냐고 하다, -(으)라고 하다, -자고 하다.",
        items: [],
      },
    ],
  },

  // 8. NGỮ PHÁP: TOPIK 5 (0/46)
  {
    id: "grammar-topik-5",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 5",
    koreanTitle: "토픽 5급 고급 문법",
    levelBadge: "TOPIK 5",
    topikLevel: "topik-5",
    completedCount: 0,
    totalCount: 46,
    iconType: "grammar-search",
    accentColor: "rose",
    chapters: [],
  },

  // 9. NGỮ PHÁP: TOPIK 6 (0/60)
  {
    id: "grammar-topik-6",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 6",
    koreanTitle: "토픽 6급 최고급 학술 문법",
    levelBadge: "TOPIK 6",
    topikLevel: "topik-6",
    completedCount: 0,
    totalCount: 60,
    iconType: "grammar-search",
    accentColor: "slate",
    chapters: [],
  },

  // 10. NÂNG CAO: TỪ VỰNG CHỦ ĐỀ
  {
    id: "topic-communication",
    type: "topic",
    titleVi: "Giao tiếp đời sống hàng ngày",
    koreanTitle: "일상 실전 회화 어휘",
    levelBadge: "Chủ đề 1",
    topikLevel: "topik-1",
    completedCount: 45,
    totalCount: 120,
    iconType: "topic-card",
    accentColor: "teal",
    chapters: [
      {
        id: "tc-c1",
        titleVi: "Chương 1: Quán cà phê & Gọi món",
        koreanSubtitle: "카페와 주문",
        descriptionVi: "Cách gọi các loại đồ uống, yêu cầu đá, đường, mang về (포장) hoặc dùng tại quán.",
        items: [
          {
            id: "tc-101",
            korean: "아이스 아메리카노",
            romaja: "aiseu americano",
            partOfSpeech: "Danh từ",
            meaningVi: "Cà phê Americano đá (Ah-Ah)",
            meaningEn: "Iced Americano",
            exampleKo: "아이스 아메리카노 한 잔 포장해 주세요.",
            exampleVi: "Cho tôi một ly Americano đá mang về ạ.",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "tc-c1",
            chapterTitleVi: "Chương 1: Quán cà phê",
          },
          {
            id: "tc-102",
            korean: "테이크아웃",
            romaja: "teikeu-aut",
            partOfSpeech: "Danh từ",
            meaningVi: "Mang về / Takeout",
            meaningEn: "Takeout",
            exampleKo: "드시고 가세요, 테이크아웃이세요?",
            exampleVi: "Quý khách dùng ở đây hay mang về ạ?",
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "tc-c1",
            chapterTitleVi: "Chương 1: Quán cà phê",
          },
        ],
      },
    ],
  },
  {
    id: "topic-office",
    type: "topic",
    titleVi: "Tiếng Hàn công sở & Phỏng vấn",
    koreanTitle: "비즈니스 및 면접 어휘",
    levelBadge: "Chủ đề 2",
    topikLevel: "topik-2",
    completedCount: 18,
    totalCount: 95,
    iconType: "topic-card",
    accentColor: "blue",
    chapters: [
      {
        id: "to-c1",
        titleVi: "Chương 1: Viết Email & Trao đổi công việc",
        koreanSubtitle: "이메일 작성과 업무 소통",
        descriptionVi: "Các câu chúc đầu thư, đính kèm file và báo cáo tiến độ dự án.",
        items: [
          {
            id: "to-101",
            korean: "첨부파일",
            romaja: "cheombupail",
            partOfSpeech: "Danh từ",
            meaningVi: "Tệp đính kèm",
            meaningEn: "Attachment file",
            exampleKo: "첨부파일을 확인해 주시기 바랍니다.",
            exampleVi: "Kính mong quý vị kiểm tra tệp đính kèm.",
            isLearned: true,
            topikLevel: "topik-2",
            chapterId: "to-c1",
            chapterTitleVi: "Chương 1: Email công sở",
          },
        ],
      },
    ],
  },
  {
    id: "topic-travel",
    type: "topic",
    titleVi: "Du lịch, Tàu điện & Sân bay Incheon",
    koreanTitle: "여행 · 지하철 · 인천공항",
    levelBadge: "Chủ đề 3",
    topikLevel: "topik-1",
    completedCount: 30,
    totalCount: 80,
    iconType: "topic-card",
    accentColor: "emerald",
    chapters: [],
  },
  {
    id: "topic-kpop",
    type: "topic",
    titleVi: "K-pop, K-drama & Mạng xã hội",
    koreanTitle: "K-POP 및 드라마 필수 표현",
    levelBadge: "Chủ đề 4",
    topikLevel: "topik-1",
    completedCount: 12,
    totalCount: 65,
    iconType: "topic-card",
    accentColor: "amber",
    chapters: [],
  },
];
