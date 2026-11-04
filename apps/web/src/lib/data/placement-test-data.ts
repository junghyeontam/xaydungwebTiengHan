export interface PlacementQuestion {
  id: number;
  question: string;
  koreanText?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  levelIndicator: "so-0" | "so-cap-1" | "so-cap-2" | "trung-cap";
}

export const PLACEMENT_TEST_QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    question: "Nguyên âm 'ㅏ' trong tiếng Hàn được phát âm tương đương với âm nào trong tiếng Việt?",
    options: ["Âm 'o'", "Âm 'a'", "Âm 'u'", "Âm 'ê'"],
    correctAnswer: "Âm 'a'",
    explanation: "'ㅏ' là nguyên âm cơ bản nhất, phát âm là /a/.",
    levelIndicator: "so-0",
  },
  {
    id: 2,
    question: "Từ '안녕하세요' có nghĩa là gì trong tiếng Việt?",
    options: ["Tạm biệt", "Cảm ơn", "Xin chào", "Xin lỗi"],
    correctAnswer: "Xin chào",
    explanation: "'안녕하세요' (an-nyeong-ha-se-yo) là câu chào hỏi lịch sự phổ biến nhất.",
    levelIndicator: "so-0",
  },
  {
    id: 3,
    question: "Chọn từ tiếng Hàn có nghĩa là 'Học sinh':",
    options: ["선생님", "학생", "의사", "회사원"],
    correctAnswer: "학생",
    explanation: "학생 (hak-saeng) nghĩa là học sinh/sinh viên. 선생님 là giáo viên.",
    levelIndicator: "so-0",
  },
  {
    id: 4,
    question: "Điền tiểu từ thích hợp: 저는 베트남 사람_____ (Tôi là người Việt Nam).",
    options: ["이에요", "예요", "있어요", "없어요"],
    correctAnswer: "이에요",
    explanation: "Danh từ '사람' có phụ âm cuối (patchim) nên đi cùng đuôi '이에요'.",
    levelIndicator: "so-cap-1",
  },
  {
    id: 5,
    question: "Đâu là câu nói 'Tôi ăn cơm' chính xác nhất trong tiếng Hàn?",
    options: [
      "저는 밥을 먹어요.",
      "저는 밥이 마셔요.",
      "저는 밥을 가요.",
      "저는 밥을 봐요.",
    ],
    correctAnswer: "저는 밥을 먹어요.",
    explanation: "'먹어요' nghĩa là ăn, '밥을' là cơm (tân ngữ).",
    levelIndicator: "so-cap-1",
  },
  {
    id: 6,
    question: "Tiểu từ nào được dùng để chỉ địa điểm hướng đến (Ví dụ: 'Đi đến trường')?",
    options: ["-에서", "-에", "-하고", "-과"],
    correctAnswer: "-에",
    explanation: "Cấu trúc: Địa điểm + -에 가요/와요 (Đi đến/đến đâu đó).",
    levelIndicator: "so-cap-1",
  },
  {
    id: 7,
    question: "Chia động từ '보다' (xem) sang thì quá khứ thân mật:",
    options: ["보았어요 (봤어요)", "보었어요", "보해요", "보겠어요"],
    correctAnswer: "보았어요 (봤어요)",
    explanation: "보다 kết thúc bằng nguyên âm ㅗ nên kết hợp với -았어요, rút gọn thành 봤어요.",
    levelIndicator: "so-cap-2",
  },
  {
    id: 8,
    question: "Cấu trúc nào dùng để diễn tả ý định 'Tôi muốn làm gì đó'?",
    options: ["-고 싶어요", "-(으)ㄹ 수 있어요", "-(으)세요", "-지 마세요"],
    correctAnswer: "-고 싶어요",
    explanation: "V + -고 싶어요 dùng để nói về mong muốn của bản thân.",
    levelIndicator: "so-cap-2",
  },
  {
    id: 9,
    question: "Từ nào sau đây mang nghĩa là 'Thời tiết'?",
    options: ["날씨", "계절", "시간", "하루"],
    correctAnswer: "날씨",
    explanation: "날씨 (nal-ssi) nghĩa là thời tiết. 계절 là mùa.",
    levelIndicator: "so-cap-2",
  },
  {
    id: 10,
    question: "Ngữ pháp nào thể hiện sự giả định hoặc điều kiện ('Nếu... thì...')?",
    options: ["-(으)면", "-(으)니까", "-지만", "-는데"],
    correctAnswer: "-(으)면",
    explanation: "V/A + -(으)면 dùng để diễn tả điều kiện giả định (Nếu... thì).",
    levelIndicator: "trung-cap",
  },
  {
    id: 11,
    question: "Câu '한국에 간 지 2년이 되었어요' có nghĩa là gì?",
    options: [
      "Tôi sẽ đi Hàn Quốc trong 2 năm nữa.",
      "Đã được 2 năm kể từ khi tôi sang Hàn Quốc.",
      "Tôi muốn ở lại Hàn Quốc 2 năm.",
      "Tôi đang chuẩn bị đi Hàn Quốc 2 năm.",
    ],
    correctAnswer: "Đã được 2 năm kể từ khi tôi sang Hàn Quốc.",
    explanation: "Cấu trúc: V + -(으)n 지 [thời gian] 되었어요 diễn tả khoảng thời gian đã trôi qua kể từ khi làm gì.",
    levelIndicator: "trung-cap",
  },
  {
    id: 12,
    question: "Từ nào đồng nghĩa với '노력하다' (nỗ lực, cố gắng)?",
    options: ["애쓰다", "포기하다", "후회하다", "실망하다"],
    correctAnswer: "애쓰다",
    explanation: "애쓰다 nghĩa là dốc sức, nỗ lực (đồng nghĩa với 노력하다).",
    levelIndicator: "trung-cap",
  },
];
