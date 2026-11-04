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
  titleVi: string; // Short meaning shown on the 3-col card subtitle (e.g. "Là", "Tiểu từ chỉ chủ ngữ")
  koreanPattern: string; // Bold heading shown on the 3-col card title (e.g. "Danh từ + 입니다")
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
  targetWordCount?: number;
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

// Helper to build vocabulary items concisely
function makeVocabList(
  chapterId: string,
  chapterTitleVi: string,
  topikLevel: TheoryVocabWord["topikLevel"],
  raw: [string, string, string, string, string, string, boolean?][]
): TheoryVocabWord[] {
  return raw.map(([korean, romaja, meaningVi, partOfSpeech, exampleKo, exampleVi, isLearned = true], idx) => ({
    id: `${chapterId}-w-${idx + 1}`,
    korean,
    romaja,
    partOfSpeech,
    meaningVi,
    exampleKo,
    exampleVi,
    isLearned,
    topikLevel,
    chapterId,
    chapterTitleVi,
  }));
}

export function syncCollectionStats(col: TheoryCollectionCard): TheoryCollectionCard {
  let totalCount = 0;
  let completedCount = 0;
  const chapters = col.chapters.map((ch) => {
    const items = ch.items || [];
    totalCount += items.length;
    completedCount += items.filter((it) => Boolean(it.isLearned)).length;
    return {
      ...ch,
      targetWordCount: items.length,
    };
  });
  return {
    ...col,
    totalCount,
    completedCount,
    chapters,
  };
}

const RAW_THEORY_COLLECTIONS: TheoryCollectionCard[] = [
  // =========================================================================
  // 1. TỪ VỰNG TOPIK 1 (CẤU TRÚC THƯ MỤC BÀI HỌC NHƯ ẢNH 1 & 2)
  // =========================================================================
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
    accentColor: "primary",
    chapters: [
      {
        id: "v1-b1a",
        titleVi: "Bài 1A: Giới thiệu",
        koreanSubtitle: "1A과: 기본 명사와 인사",
        descriptionVi: "Các danh từ cơ bản đầu tiên để luyện đọc ghép âm và nhận diện mặt chữ tiếng Hàn.",
        targetWordCount: 34,
        items: makeVocabList("v1-b1a", "Bài 1A: Giới thiệu", "topik-1", [
          ["오이", "Oi", "Quả dưa chuột", "Danh từ", "오이가 아주 신선해요.", "Quả dưa chuột rất tươi.", true],
          ["우유", "Uyu", "Sữa", "Danh từ", "아침에 우유를 마셔요.", "Buổi sáng tôi uống sữa.", true],
          ["모자", "Moja", "Mũ", "Danh từ", "예쁜 모자를 썼어요.", "Tôi đã đội chiếc mũ đẹp.", true],
          ["바지", "Baji", "Quần", "Danh từ", "바지가 조금 길어요.", "Chiếc quần hơi dài một chút.", true],
          ["치마", "Chima", "Váy", "Danh từ", "새 치마를 샀어요.", "Tôi đã mua chiếc váy mới.", true],
          ["사과", "Sagwa", "Quả táo", "Danh từ", "사과가 달고 맛있어요.", "Quả táo ngọt và ngon.", true],
          ["고기", "Gogi", "Thịt", "Danh từ", "한국 불고기를 좋아해요.", "Tôi thích món thịt nướng Hàn Quốc.", true],
          ["시계", "Sigye", "Đồng hồ", "Danh từ", "시계를 보고 시간을 확인해요.", "Xem đồng hồ để kiểm tra giờ.", true],
          ["휴지", "Hyuji", "Giấy lau, khăn giấy", "Danh từ", "식탁 위에 휴지가 있어요.", "Trên bàn ăn có khăn giấy.", true],
          ["돼지", "Dwaeji", "Con lợn", "Danh từ", "돼지고기를 구워 먹어요.", "Nướng thịt lợn để ăn.", true],
          ["포도", "Podo", "Nho", "Danh từ", "여름에는 포도가 맛있어요.", "Vào mùa hè nho rất ngon.", true],
          ["의자", "Uija", "Cái ghế", "Danh từ", "의자에 앉으세요.", "Xin mời ngồi xuống ghế.", true],
          ["피자", "Pija", "Bánh pizza", "Danh từ", "친구와 피자를 먹었어요.", "Tôi đã ăn pizza cùng bạn.", true],
          ["기차", "Gicha", "Tàu hỏa", "Danh từ", "기차를 타고 부산에 가요.", "Đi tàu hỏa đến Busan.", true],
          ["토끼", "Tokki", "Con thỏ", "Danh từ", "토끼가 귀가 길어요.", "Con thỏ có đôi tai dài.", true],
          ["떡", "Tteok", "Bánh gạo", "Danh từ", "명절에 떡을 먹어요.", "Ăn bánh gạo vào dịp lễ Tết.", true],
          ["딸기", "Ttalgi", "Quả dâu tây", "Danh từ", "딸기 케이크를 만들어요.", "Làm bánh kem dâu tây.", true],
          ["옷", "Ot", "Áo, quần áo", "Danh từ", "따뜻한 옷을 입으세요.", "Hãy mặc quần áo ấm vào nhé.", true],
        ]),
      },
      {
        id: "v1-b1b",
        titleVi: "Bài 1B: Giới thiệu",
        koreanSubtitle: "1B과: 국적과 직업 소개",
        descriptionVi: "Từ vựng giới thiệu tên tuổi, quốc tịch và nghề nghiệp khi mới làm quen.",
        targetWordCount: 36,
        items: makeVocabList("v1-b1b", "Bài 1B: Giới thiệu", "topik-1", [
          ["안녕하세요", "Annyeonghaseyo", "Xin chào", "Thán từ", "안녕하세요, 만나서 반갑습니다.", "Xin chào, rất vui được gặp bạn.", true],
          ["한국", "Hanguk", "Hàn Quốc", "Danh từ", "한국 문화를 좋아해요.", "Tôi thích văn hóa Hàn Quốc.", true],
          ["베트남", "Beteunam", "Việt Nam", "Danh từ", "저는 베트남 사람입니다.", "Tôi là người Việt Nam.", true],
          ["미국", "Miguk", "Mỹ", "Danh từ", "미국에서 영어를 배웠어요.", "Tôi đã học tiếng Anh ở Mỹ.", true],
          ["일본", "Ilbon", "Nhật Bản", "Danh từ", "일본 여행을 가고 싶어요.", "Tôi muốn đi du lịch Nhật Bản.", true],
          ["중국", "Jungguk", "Trung Quốc", "Danh từ", "중국 음식을 먹어 봤어요.", "Tôi đã từng ăn món Trung Quốc.", true],
          ["학생", "Haksaeng", "Học sinh, sinh viên", "Danh từ", "저는 대학교 학생입니다.", "Tôi là sinh viên đại học.", true],
          ["선생님", "Seonsaengnim", "Thầy giáo, cô giáo", "Danh từ", "한국어 선생님이 친절해요.", "Cô giáo tiếng Hàn rất thân thiện.", true],
          ["회사원", "Hoesawon", "Nhân viên văn phòng", "Danh từ", "형은 회사원입니다.", "Anh trai tôi là nhân viên công ty.", true],
          ["의사", "Uisa", "Bác sĩ", "Danh từ", "병원에서 의사를 만났어요.", "Tôi đã gặp bác sĩ ở bệnh viện.", true],
          ["요리사", "Yorisa", "Đầu bếp", "Danh từ", "유명한 요리사가 되고 싶어요.", "Tôi muốn trở thành đầu bếp nổi tiếng.", true],
          ["가수", "Gasu", "Ca sĩ", "Danh từ", "케이팝 가수를 좋아해요.", "Tôi thích ca sĩ K-Pop.", true],
        ]),
      },
      {
        id: "v1-b2",
        titleVi: "Bài 2: Trường học",
        koreanSubtitle: "2과: 학교와 교실 물건",
        descriptionVi: "Các địa điểm trong trường học và đồ dùng học tập trong lớp học.",
        targetWordCount: 51,
        items: makeVocabList("v1-b2", "Bài 2: Trường học", "topik-1", [
          ["학교", "Hakgyo", "Trường học", "Danh từ", "학교에 버스로 가요.", "Tôi đến trường bằng xe buýt.", true],
          ["교실", "Gyosil", "Phòng học, lớp học", "Danh từ", "교실이 넓고 깨끗해요.", "Phòng học rộng và sạch sẽ.", true],
          ["도서관", "Doseogwan", "Thư viện", "Danh từ", "도서관에서 책을 읽어요.", "Tôi đọc sách ở thư viện.", true],
          ["책상", "Chaeksang", "Cái bàn", "Danh từ", "책상 위에 컴퓨터가 있어요.", "Trên bàn có máy tính.", true],
          ["책", "Chaek", "Quyển sách", "Danh từ", "한국어 책을 샀어요.", "Tôi đã mua sách tiếng Hàn.", true],
          ["공책", "Gongchaek", "Quyển vở", "Danh từ", "공책에 단어를 써요.", "Viết từ vựng vào vở.", true],
          ["연필", "Yeonpil", "Bút chì", "Danh từ", "연필로 그림을 그려요.", "Vẽ tranh bằng bút chì.", true],
          ["볼펜", "Bolpen", "Bút bi", "Danh từ", "파란색 볼펜이 있어요?", "Bạn có bút bi màu xanh không?", true],
          ["가방", "Gabang", "Cặp sách, túi xách", "Danh từ", "가방 안에 지갑이 있어요.", "Trong túi xách có ví tiền.", true],
          ["창문", "Changmun", "Cửa sổ", "Danh từ", "창문을 열어 주세요.", "Làm ơn mở cửa sổ giúp tôi.", true],
          ["컴퓨터", "Keompyuteo", "Máy tính", "Danh từ", "컴퓨터로 숙제를 해요.", "Làm bài tập bằng máy tính.", true],
          ["칠판", "Chilpan", "Bảng viết", "Danh từ", "칠판의 글씨를 보세요.", "Hãy nhìn chữ trên bảng.", true],
        ]),
      },
      {
        id: "v1-b3",
        titleVi: "Bài 3: Sinh hoạt đời thường",
        koreanSubtitle: "3과: 일상 동작과 생활",
        descriptionVi: "Các động từ và tính từ miêu tả hoạt động thường ngày.",
        targetWordCount: 53,
        items: makeVocabList("v1-b3", "Bài 3: Sinh hoạt đời thường", "topik-1", [
          ["가다", "Gada", "Đi", "Động từ", "내일 서울에 가요.", "Ngày mai tôi đi Seoul.", true],
          ["오다", "Oda", "Đến", "Động từ", "친구가 우리 집에 와요.", "Bạn đến nhà tôi.", true],
          ["자다", "Jada", "Ngủ", "Động từ", "밤 열한 시에 자요.", "Tôi ngủ lúc 11 giờ đêm.", true],
          ["먹다", "Meokda", "Ăn", "Động từ", "아침밥을 먹었어요.", "Tôi đã ăn sáng rồi.", true],
          ["마시다", "Masida", "Uống", "Động từ", "커피를 한 잔 마셔요.", "Tôi uống một tách cà phê.", true],
          ["읽다", "Ikda", "Đọc", "Động từ", "주말에 소설책을 읽어요.", "Cuối tuần tôi đọc tiểu thuyết.", true],
          ["쓰다", "Sseuda", "Viết, dùng", "Động từ", "일기를 매일 써요.", "Tôi viết nhật ký mỗi ngày.", true],
          ["보다", "Boda", "Xem, nhìn", "Động từ", "극장에서 영화를 봐요.", "Xem phim ở rạp chiếu phim.", true],
          ["듣다", "Deutda", "Nghe", "Động từ", "한국 노래를 들어요.", "Tôi nghe nhạc Hàn Quốc.", true],
          ["공부하다", "Gongbuhada", "Học tập", "Động từ", "도서관에서 한국어를 공부해요.", "Tôi học tiếng Hàn ở thư viện.", true],
          ["운동하다", "Undonghada", "Tập thể dục", "Động từ", "공원에서 운동해요.", "Tôi tập thể dục ở công viên.", true],
          ["쉬다", "Swida", "Nghỉ ngơi", "Động từ", "일요일에는 집에서 쉬어요.", "Chủ nhật tôi nghỉ ngơi ở nhà.", true],
        ]),
      },
      {
        id: "v1-b4a",
        titleVi: "Bài 4A: Thứ ngày tháng",
        koreanSubtitle: "4A과: 요일과 날짜",
        descriptionVi: "Cách gọi tên các thứ trong tuần và các mốc thời gian hôm qua, hôm nay, ngày mai.",
        targetWordCount: 36,
        items: makeVocabList("v1-b4a", "Bài 4A: Thứ ngày tháng", "topik-1", [
          ["월요일", "Woryoil", "Thứ Hai", "Danh từ", "월요일에 회의가 있어요.", "Thứ Hai có cuộc họp.", true],
          ["화요일", "Hwayoil", "Thứ Ba", "Danh từ", "화요일마다 한국어를 배워요.", "Mỗi thứ Ba tôi học tiếng Hàn.", true],
          ["수요일", "Suyoil", "Thứ Tư", "Danh từ", "수요일에 친구를 만나요.", "Thứ Tư tôi gặp bạn.", true],
          ["목요일", "Mogyoil", "Thứ Năm", "Danh từ", "목요일에 시험이 있어요.", "Thứ Năm có bài kiểm tra.", true],
          ["금요일", "Geumyoil", "Thứ Sáu", "Danh từ", "금요일 저녁에 파티를 해요.", "Tối thứ Sáu tổ chức tiệc.", true],
          ["토요일", "Toyoil", "Thứ Bảy", "Danh từ", "토요일에 등산을 가요.", "Thứ Bảy đi leo núi.", true],
          ["일요일", "Iryoil", "Chủ Nhật", "Danh từ", "일요일에는 푹 쉬어요.", "Chủ Nhật tôi nghỉ ngơi thoải mái.", true],
          ["오늘", "Oneul", "Hôm nay", "Danh từ", "오늘은 날씨가 좋아요.", "Hôm nay thời tiết đẹp.", true],
          ["내일", "Naeil", "Ngày mai", "Danh từ", "내일 다시 만나요.", "Ngày mai gặp lại nhé.", true],
          ["어제", "Eoje", "Hôm qua", "Danh từ", "어제 영화를 봤어요.", "Hôm qua tôi đã xem phim.", true],
          ["주말", "Jumal", "Cuối tuần", "Danh từ", "주말 잘 보내세요.", "Chúc bạn cuối tuần vui vẻ.", true],
        ]),
      },
      {
        id: "v1-b4b",
        titleVi: "Bài 4B: Thứ ngày tháng",
        koreanSubtitle: "4B과: 월과 한자어 숫자",
        descriptionVi: "12 tháng trong năm và hệ thống số đếm Hán Hàn dùng cho ngày tháng, tiền tệ.",
        targetWordCount: 37,
        items: makeVocabList("v1-b4b", "Bài 4B: Thứ ngày tháng", "topik-1", [
          ["일월", "Irwol", "Tháng 1", "Danh từ", "일월은 아주 추워요.", "Tháng 1 rất lạnh.", true],
          ["이월", "Iwol", "Tháng 2", "Danh từ", "이월에 설날이 있어요.", "Tháng 2 có Tết Nguyên Đán.", true],
          ["삼월", "Samwol", "Tháng 3", "Danh từ", "삼월에 새 학기가 시작해요.", "Tháng 3 bắt đầu học kỳ mới.", true],
          ["사월", "Sawol", "Tháng 4", "Danh từ", "사월에 벚꽃이 피어요.", "Tháng 4 hoa anh đào nở.", true],
          ["오월", "Owol", "Tháng 5", "Danh từ", "오월은 가정의 달이에요.", "Tháng 5 là tháng của gia đình.", true],
          ["유월", "Yuwol", "Tháng 6", "Danh từ", "유월부터 여름이 시작돼요.", "Từ tháng 6 mùa hè bắt đầu.", true],
          ["칠월", "Chirwol", "Tháng 7", "Danh từ", "칠월에 방학을 해요.", "Tháng 7 được nghỉ hè.", true],
          ["팔월", "Parwol", "Tháng 8", "Danh từ", "팔월에 바다에 가요.", "Tháng 8 đi biển.", true],
          ["구월", "Guwol", "Tháng 9", "Danh từ", "구월에는 날씨가 시원해요.", "Tháng 9 thời tiết mát mẻ.", true],
          ["시월", "Siwol", "Tháng 10", "Danh từ", "시월에 단풍이 아름다워요.", "Tháng 10 lá đỏ rất đẹp.", true],
          ["십일월", "Sibirwol", "Tháng 11", "Danh từ", "십일월에 바람이 많이 불어요.", "Tháng 11 gió thổi nhiều.", true],
          ["십이월", "Sibiwol", "Tháng 12", "Danh từ", "십이월에 눈이 내려요.", "Tháng 12 tuyết rơi.", true],
        ]),
      },
      {
        id: "v1-b5",
        titleVi: "Bài 5: Công việc trong ngày",
        koreanSubtitle: "5과: 하루 일과와 시간",
        descriptionVi: "Từ vựng về các buổi trong ngày, giờ giấc và lịch trình sinh hoạt.",
        targetWordCount: 65,
        items: makeVocabList("v1-b5", "Bài 5: Công việc trong ngày", "topik-1", [
          ["아침", "Achim", "Buổi sáng", "Danh từ", "아침 일찍 일어나요.", "Tôi thức dậy sớm vào buổi sáng.", true],
          ["점심", "Jeomsim", "Buổi trưa", "Danh từ", "점심에 비빔밥을 먹어요.", "Buổi trưa tôi ăn cơm trộn.", true],
          ["저녁", "Jeonyeok", "Buổi tối", "Danh từ", "저녁에 가족과 이야기해요.", "Buổi tối trò chuyện cùng gia đình.", true],
          ["밤", "Bam", "Ban đêm", "Danh từ", "밤에는 조용해요.", "Ban đêm rất yên tĩnh.", false],
          ["일어나다", "Ireonada", "Thức dậy", "Động từ", "매일 여섯 시에 일어나요.", "Mỗi ngày tôi dậy lúc 6 giờ.", false],
          ["세수하다", "Sesuhada", "Rửa mặt", "Động từ", "찬물로 세수해요.", "Rửa mặt bằng nước lạnh.", false],
          ["출근하다", "Chulgeunhada", "Đi làm", "Động từ", "지하철로 출근해요.", "Tôi đi làm bằng tàu điện ngầm.", false],
          ["퇴근하다", "Toegeunhada", "Tan làm", "Động từ", "여섯 시에 퇴근해요.", "Tôi tan làm lúc 6 giờ.", false],
          ["청소하다", "Cheongsohada", "Dọn dẹp", "Động từ", "방을 깨끗하게 청소해요.", "Dọn phòng sạch sẽ.", false],
          ["샤워하다", "Syawohada", "Tắm vòi sen", "Động từ", "운동 후에 샤워해요.", "Tắm sau khi tập thể dục.", false],
        ]),
      },
      {
        id: "v1-b6",
        titleVi: "Bài 6: Cuối tuần",
        koreanSubtitle: "6과: 주말 활동과 여가",
        descriptionVi: "Hoạt động vui chơi, giải trí, gặp gỡ bạn bè vào dịp cuối tuần.",
        targetWordCount: 48,
        items: makeVocabList("v1-b6", "Bài 6: Cuối tuần", "topik-1", [
          ["공원", "Gongwon", "Công viên", "Danh từ", "공원에서 산책해요.", "Đi dạo ở công viên.", false],
          ["영화관", "Yeonghwagwan", "Rạp chiếu phim", "Danh từ", "주말에 영화관에 갔어요.", "Cuối tuần tôi đã đi rạp chiếu phim.", false],
          ["백화점", "Baekhwajeom", "Trung tâm thương mại", "Danh từ", "백화점에서 옷을 샀어요.", "Mua quần áo ở trung tâm thương mại.", false],
          ["만나다", "Mannada", "Gặp gỡ", "Động từ", "커피숍에서 친구를 만나요.", "Gặp bạn ở quán cà phê.", false],
          ["구경하다", "Gugyeonghada", "Ngắm, tham quan", "Động từ", "시내를 구경했어요.", "Tôi đã đi dạo ngắm phố phường.", false],
          ["여행하다", "Yeohaenghada", "Du lịch", "Động từ", "제주도를 여행하고 싶어요.", "Tôi muốn đi du lịch đảo Jeju.", false],
        ]),
      },
      {
        id: "v1-b7",
        titleVi: "Bài 7: Mua sắm P1",
        koreanSubtitle: "7과: 물건 사기와 가격",
        descriptionVi: "Từ vựng giao dịch mua bán, hỏi giá cả và đơn vị đếm đồ vật.",
        targetWordCount: 30,
        items: makeVocabList("v1-b7", "Bài 7: Mua sắm P1", "topik-1", [
          ["사다", "Sada", "Mua", "Động từ", "과일을 많이 샀어요.", "Tôi đã mua nhiều hoa quả.", false],
          ["팔다", "Palda", "Bán", "Động từ", "이 가게에서 빵을 팔아요.", "Cửa hàng này bán bánh mì.", false],
          ["비싸다", "Bissada", "Đắt", "Tính từ", "이 가방은 너무 비싸요.", "Chiếc túi này đắt quá.", false],
          ["싸다", "Ssada", "Rẻ", "Tính từ", "시장 물건이 싸요.", "Đồ ngoài chợ rẻ.", false],
          ["주다", "Juda", "Cho, đưa", "Động từ", "물 한 잔 주세요.", "Cho tôi xin một cốc nước.", false],
          ["영수증", "Yeongsujeung", "Hóa đơn", "Danh từ", "영수증을 받으세요.", "Xin mời nhận hóa đơn.", false],
        ]),
      },
      {
        id: "v1-b8",
        titleVi: "Bài 8: Ẩm thực",
        koreanSubtitle: "8과: 한국 음식과 맛",
        descriptionVi: "Tên các món ăn nổi tiếng Hàn Quốc, mùi vị và cách gọi món tại nhà hàng.",
        targetWordCount: 57,
        items: makeVocabList("v1-b8", "Bài 8: Ẩm thực", "topik-1", [
          ["김치찌개", "Gimchijjigae", "Canh kim chi", "Danh từ", "김치찌개가 조금 매워요.", "Canh kim chi hơi cay.", true],
          ["불고기", "Bulgogi", "Thịt bò nướng", "Danh từ", "불고기가 달고 맛있어요.", "Thịt bò nướng ngọt và ngon.", true],
          ["비빔밥", "Bibimbap", "Cơm trộn", "Danh từ", "전주 비빔밥이 유명해요.", "Cơm trộn Jeonju rất nổi tiếng.", true],
          ["삼겹살", "Samgyeopsal", "Thịt ba chỉ nướng", "Danh từ", "저녁에 삼겹살을 먹었어요.", "Tối nay tôi đã ăn thịt ba chỉ nướng.", true],
          ["맛있다", "Masitda", "Ngon", "Tính từ", "이 식당 음식이 맛있어요.", "Đồ ăn quán này ngon.", true],
          ["맛없다", "Maseopda", "Không ngon", "Tính từ", "이 과자는 맛없어요.", "Bánh quy này không ngon.", true],
          ["맵다", "Maepda", "Cay", "Tính từ", "떡볶이가 매워요.", "Bánh gạo cay.", true],
          ["달다", "Dalda", "Ngọt", "Tính từ", "초콜릿이 아주 달아요.", "Sô-cô-la rất ngọt.", true],
        ]),
      },
      {
        id: "v1-b9",
        titleVi: "Bài 9: Nhà ở",
        koreanSubtitle: "9과: 집과 가구",
        descriptionVi: "Các phòng trong nhà, đồ nội thất và vị trí không gian (trên, dưới, trong, ngoài).",
        targetWordCount: 60,
        items: makeVocabList("v1-b9", "Bài 9: Nhà ở", "topik-1", [
          ["집", "Jip", "Nhà", "Danh từ", "우리 집은 역 근처에 있어요.", "Nhà tôi ở gần ga.", false],
          ["방", "Bang", "Căn phòng", "Danh từ", "방이 밝고 따뜻해요.", "Căn phòng sáng sủa và ấm áp.", false],
          ["거실", "Geosil", "Phòng khách", "Danh từ", "거실에서 텔레비전을 봐요.", "Xem tivi ở phòng khách.", false],
          ["부엌", "Bueok", "Phòng bếp", "Danh từ", "부엌에서 요리해요.", "Nấu ăn trong bếp.", false],
          ["침대", "Chimdae", "Giường ngủ", "Danh từ", "침대가 아주 편해요.", "Chiếc giường rất êm ái.", false],
          ["냉장고", "Naengjanggo", "Tủ lạnh", "Danh từ", "냉장고에 과일이 있어요.", "Trong tủ lạnh có trái cây.", false],
        ]),
      },
      {
        id: "v1-b10",
        titleVi: "Bài 10: Gia đình",
        koreanSubtitle: "10과: 가족과 높임말",
        descriptionVi: "Cách xưng hô các thành viên trong gia đình và từ vựng kính ngữ cơ bản.",
        targetWordCount: 62,
        items: makeVocabList("v1-b10", "Bài 10: Gia đình", "topik-1", [
          ["가족", "Gajok", "Gia đình", "Danh từ", "우리 가족은 네 명이에요.", "Gia đình tôi có 4 người.", true],
          ["할아버지", "Harabeoji", "Ông", "Danh từ", "할아버지께서 신문을 읽으세요.", "Ông đang đọc báo.", true],
          ["할머니", "Halmeoni", "Bà", "Danh từ", "할머니께서 요리를 잘하세요.", "Bà nấu ăn rất ngon.", true],
          ["아버지", "Abeoji", "Bố", "Danh từ", "아버지는 회사에 다니세요.", "Bố tôi làm việc ở công ty.", true],
          ["어머니", "Eomeoni", "Mẹ", "Danh từ", "어머니와 시장에 갔어요.", "Tôi đã đi chợ cùng mẹ.", true],
          ["동생", "Dongsaeng", "Em (trai/gái)", "Danh từ", "동생이 고등학생이에요.", "Em tôi là học sinh cấp 3.", true],
        ]),
      },
      {
        id: "v1-b11",
        titleVi: "Bài 11: Thời tiết",
        koreanSubtitle: "11과: 계절과 날씨",
        descriptionVi: "Bốn mùa xuân hạ thu đông và các hiện tượng thời tiết, nhiệt độ.",
        targetWordCount: 52,
        items: makeVocabList("v1-b11", "Bài 11: Thời tiết", "topik-1", [
          ["날씨", "Nalssi", "Thời tiết", "Danh từ", "오늘 날씨가 참 맑아요.", "Thời tiết hôm nay thật trong lành.", false],
          ["봄", "Bom", "Mùa xuân", "Danh từ", "봄에는 꽃이 많이 피어요.", "Mùa xuân hoa nở nhiều.", false],
          ["여름", "Yeoreum", "Mùa hè", "Danh từ", "여름에는 바다에서 수영해요.", "Mùa hè bơi ở biển.", false],
          ["가을", "Gaeul", "Mùa thu", "Danh từ", "가을 하늘이 높고 푸르러요.", "Bầu trời mùa thu cao và xanh.", false],
          ["겨울", "Gyeoul", "Mùa đông", "Danh từ", "한국의 겨울은 추워요.", "Mùa đông Hàn Quốc lạnh.", false],
          ["따뜻하다", "Ttatteuthada", "Ấm áp", "Tính từ", "봄 날씨가 따뜻해요.", "Thời tiết mùa xuân ấm áp.", false],
        ]),
      },
      {
        id: "v1-b12",
        titleVi: "Bài 12: Điện thoại liên lạc P1",
        koreanSubtitle: "12과: 전화와 약속",
        descriptionVi: "Từ vựng nghe gọi điện thoại, nhắn tin và đặt lịch hẹn.",
        targetWordCount: 52,
        items: makeVocabList("v1-b12", "Bài 12: Điện thoại liên lạc P1", "topik-1", [
          ["전화", "Jeonhwa", "Điện thoại", "Danh từ", "집에 전화가 왔어요.", "Có điện thoại gọi đến nhà.", false],
          ["휴대폰", "Hyudaepon", "Điện thoại di động", "Danh từ", "휴대폰 번호가 뭐예요?", "Số điện thoại di động của bạn là gì?", false],
          ["문자", "Munja", "Tin nhắn", "Danh từ", "친구에게 문자를 보냈어요.", "Tôi đã gửi tin nhắn cho bạn.", false],
          ["약속", "Yaksok", "Cuộc hẹn, lời hứa", "Danh từ", "오늘 저녁에 약속이 있어요.", "Tối nay tôi có cuộc hẹn.", false],
        ]),
      },
      {
        id: "v1-b13",
        titleVi: "Bài 13: Sinh nhật",
        koreanSubtitle: "13과: 생일과 선물",
        descriptionVi: "Từ vựng chúc mừng sinh nhật, tặng quà và tổ chức tiệc.",
        targetWordCount: 48,
        items: makeVocabList("v1-b13", "Bài 13: Sinh nhật", "topik-1", [
          ["생일", "Saengil", "Sinh nhật", "Danh từ", "생일을 진심으로 축하해요.", "Chúc mừng sinh nhật bạn.", false],
          ["선물", "Seonmul", "Món quà", "Danh từ", "생일 선물을 받았어요.", "Tôi đã nhận được quà sinh nhật.", false],
          ["케이크", "Keikeu", "Bánh kem", "Danh từ", "맛있는 케이크를 샀어요.", "Tôi đã mua chiếc bánh kem ngon.", false],
          ["초대하다", "Chodaehada", "Mời", "Động từ", "생일 파티에 친구들을 초대했어요.", "Tôi đã mời bạn bè đến bữa tiệc sinh nhật.", false],
        ]),
      },
      {
        id: "v1-b14",
        titleVi: "Bài 14: Sở thích và đam mê",
        koreanSubtitle: "14과: 취미와 스포츠",
        descriptionVi: "Các môn thể thao, âm nhạc, nghệ thuật và hoạt động yêu thích.",
        targetWordCount: 65,
        items: makeVocabList("v1-b14", "Bài 14: Sở thích và đam mê", "topik-1", [
          ["취미", "Chwimi", "Sở thích", "Danh từ", "제 취미는 사진 찍기예요.", "Sở thích của tôi là chụp ảnh.", false],
          ["독서", "Dokseo", "Đọc sách", "Danh từ", "주말에 독서를 즐겨요.", "Tôi thích đọc sách vào cuối tuần.", false],
          ["등산", "Deungsan", "Leo núi", "Danh từ", "아버지는 등산을 좋아하세요.", "Bố tôi thích leo núi.", false],
          ["수영", "Suyeong", "Bơi lội", "Danh từ", "아침마다 수영을 배워요.", "Mỗi sáng tôi đều học bơi.", false],
        ]),
      },
      {
        id: "v1-b15",
        titleVi: "Bài 15: Giao thông P1",
        koreanSubtitle: "15과: 교통수단과 길 찾기",
        descriptionVi: "Phương tiện đi lại, chỉ đường và hỏi khoảng cách, thời gian di chuyển.",
        targetWordCount: 52,
        items: makeVocabList("v1-b15", "Bài 15: Giao thông P1", "topik-1", [
          ["버스", "Beoseu", "Xe buýt", "Danh từ", "버스를 타고 학교에 가요.", "Tôi đi xe buýt đến trường.", false],
          ["지하철", "Jihacheol", "Tàu điện ngầm", "Danh từ", "서울 지하철은 아주 편리해요.", "Tàu điện ngầm ở Seoul rất tiện lợi.", false],
          ["택시", "Taeksi", "Xe taxi", "Danh từ", "늦어서 택시를 탔어요.", "Vì muộn nên tôi đã đi taxi.", false],
          ["비행기", "Bihaenggi", "Máy bay", "Danh từ", "비행기로 제주도에 갔어요.", "Tôi đã đi Jeju bằng máy bay.", false],
        ]),
      },
    ],
  },

  // =========================================================================
  // 2. TỪ VỰNG TOPIK 2 -> 6
  // =========================================================================
  {
    id: "vocab-topik-2",
    type: "vocab",
    titleVi: "Từ vựng cấp độ TOPIK 2",
    koreanTitle: "토픽 2급 필수 어휘",
    levelBadge: "Cấp độ 2",
    topikLevel: "topik-2",
    completedCount: 120,
    totalCount: 850,
    iconType: "vocab-book",
    accentColor: "primary",
    chapters: [
      {
        id: "v2-b1",
        titleVi: "Bài 1: Bệnh viện & Sức khỏe",
        koreanSubtitle: "1과: 병원과 건강",
        descriptionVi: "Triệu chứng bệnh, hiệu thuốc và lời khuyên giữ gìn sức khỏe.",
        targetWordCount: 45,
        items: makeVocabList("v2-b1", "Bài 1: Bệnh viện & Sức khỏe", "topik-2", [
          ["감기", "Gamgi", "Cảm cúm", "Danh từ", "감기에 걸려서 열이 나요.", "Tôi bị cảm nên bị sốt.", true],
          ["약국", "Yakguk", "Hiệu thuốc", "Danh từ", "약국에서 감기약을 샀어요.", "Mua thuốc cảm ở hiệu thuốc.", true],
          ["아프다", "Apeuda", "Đau, ốm", "Tính từ", "배가 너무 아파요.", "Tôi đau bụng quá.", true],
          ["치료", "Chiryo", "Điều trị", "Danh từ", "병원에서 치료를 받았어요.", "Tôi đã được điều trị ở bệnh viện.", true],
        ]),
      },
      {
        id: "v2-b2",
        titleVi: "Bài 2: Ngân hàng & Bưu điện",
        koreanSubtitle: "2과: 은행과 우체국",
        descriptionVi: "Giao dịch chuyển khoản, đổi tiền, gửi bưu phẩm quốc tế.",
        targetWordCount: 42,
        items: makeVocabList("v2-b2", "Bài 2: Ngân hàng & Bưu điện", "topik-2", [
          ["통장", "Tongjang", "Sổ tài khoản", "Danh từ", "은행에서 통장을 만들었어요.", "Tôi đã mở sổ tài khoản ở ngân hàng.", true],
          ["환전", "Hwanjeon", "Đổi ngoại tệ", "Danh từ", "여행 전에 환전을 했어요.", "Tôi đã đổi tiền trước chuyến du lịch.", true],
          ["소포", "Sopo", "Bưu kiện", "Danh từ", "고향으로 소포를 보냈어요.", "Tôi đã gửi bưu kiện về quê.", false],
          ["우표", "Upyo", "Con tem", "Danh từ", "편지에 우표를 붙였어요.", "Dán tem lên bì thư.", false],
        ]),
      },
      {
        id: "v2-b3",
        titleVi: "Bài 3: Du lịch & Đặt phòng",
        koreanSubtitle: "3과: 여행과 숙소 예약",
        descriptionVi: "Đặt vé máy bay, khách sạn, chuẩn bị hành lý và tham quan danh lam thắng cảnh.",
        targetWordCount: 50,
        items: makeVocabList("v2-b3", "Bài 3: Du lịch & Đặt phòng", "topik-2", [
          ["예약하다", "Yeyakhada", "Đặt trước", "Động từ", "호텔 방을 미리 예약했어요.", "Tôi đã đặt trước phòng khách sạn.", true],
          ["여권", "Yeogwon", "Hộ chiếu", "Danh từ", "공항에 갈 때 여권을 챙기세요.", "Hãy mang theo hộ chiếu khi ra sân bay.", true],
          ["짐을 싸다", "Jimeul ssada", "Đóng gói hành lý", "Cụm từ", "여행 가기 전에 짐을 싸요.", "Đóng gói hành lý trước khi đi du lịch.", false],
        ]),
      },
    ],
  },
  {
    id: "vocab-topik-3",
    type: "vocab",
    titleVi: "Từ vựng cấp độ TOPIK 3",
    koreanTitle: "토픽 3급 필수 어휘",
    levelBadge: "Cấp độ 3",
    topikLevel: "topik-3",
    completedCount: 45,
    totalCount: 900,
    iconType: "vocab-book",
    accentColor: "primary",
    chapters: [
      {
        id: "v3-b1",
        titleVi: "Bài 1: Đời sống Đô thị & Môi trường",
        koreanSubtitle: "1과: 도시 생활과 환경",
        descriptionVi: "Từ vựng trung cấp về xã hội, môi trường sống và tiện ích công cộng.",
        targetWordCount: 48,
        items: makeVocabList("v3-b1", "Bài 1: Đời sống Đô thị & Môi trường", "topik-3", [
          ["환경", "Hwangyeong", "Môi trường", "Danh từ", "환경을 보호해야 합니다.", "Chúng ta phải bảo vệ môi trường.", true],
          ["대중교통", "Daejunggyotong", "Giao thông công cộng", "Danh từ", "대중교통을 이용하면 편리해요.", "Sử dụng giao thông công cộng rất tiện lợi.", true],
          ["재활용", "Jaehwaryong", "Tái chế", "Danh từ", "쓰레기를 분리수거하여 재활용해요.", "Phân loại rác để tái chế.", false],
        ]),
      },
      {
        id: "v3-b2",
        titleVi: "Bài 2: Giáo dục & Nghề nghiệp",
        koreanSubtitle: "2과: 교육과 진로",
        descriptionVi: "Từ vựng về học thuật, chọn ngành nghề và phát triển bản thân.",
        targetWordCount: 52,
        items: makeVocabList("v3-b2", "Bài 2: Giáo dục & Nghề nghiệp", "topik-3", [
          ["전공", "Jeongong", "Chuyên ngành", "Danh từ", "제 전공은 경영학입니다.", "Chuyên ngành của tôi là Quản trị kinh doanh.", true],
          ["경험", "Gyeongheom", "Kinh nghiệm", "Danh từ", "다양한 경험을 쌓고 싶어요.", "Tôi muốn tích lũy nhiều kinh nghiệm đa dạng.", false],
        ]),
      },
    ],
  },
  {
    id: "vocab-topik-4",
    type: "vocab",
    titleVi: "Từ vựng cấp độ TOPIK 4",
    koreanTitle: "토픽 4급 필수 어휘",
    levelBadge: "Cấp độ 4",
    topikLevel: "topik-4",
    completedCount: 0,
    totalCount: 950,
    iconType: "vocab-book",
    accentColor: "primary",
    chapters: [
      {
        id: "v4-b1",
        titleVi: "Bài 1: Kinh tế & Truyền thông",
        koreanSubtitle: "1과: 경제와 대중매체",
        descriptionVi: "Từ vựng báo chí, tin tức kinh tế và truyền thông hiện đại.",
        targetWordCount: 55,
        items: makeVocabList("v4-b1", "Bài 1: Kinh tế & Truyền thông", "topik-4", [
          ["소비자", "Sobija", "Người tiêu dùng", "Danh từ", "소비자의 권리를 보호해야 한다.", "Cần bảo vệ quyền lợi người tiêu dùng.", false],
          ["광고", "Gwanggo", "Quảng cáo", "Danh từ", "인상적인 광고를 보았다.", "Tôi đã xem một quảng cáo ấn tượng.", false],
        ]),
      },
    ],
  },
  {
    id: "vocab-topik-5",
    type: "vocab",
    titleVi: "Từ vựng cấp độ TOPIK 5",
    koreanTitle: "토픽 5급 필수 어휘",
    levelBadge: "Cấp độ 5",
    topikLevel: "topik-5",
    completedCount: 0,
    totalCount: 1000,
    iconType: "vocab-book",
    accentColor: "primary",
    chapters: [
      {
        id: "v5-b1",
        titleVi: "Bài 1: Khoa học, Công nghệ & Pháp luật",
        koreanSubtitle: "1과: 과학 기술과 법률",
        descriptionVi: "Từ vựng học thuật cao cấp xuất hiện trong đề đọc hiểu TOPIK II.",
        targetWordCount: 60,
        items: makeVocabList("v5-b1", "Bài 1: Khoa học & Pháp luật", "topik-5", [
          ["인공지능", "Ingongjineung", "Trí tuệ nhân tạo (AI)", "Danh từ", "인공지능 기술이 빠르게 발전하고 있다.", "Công nghệ AI đang phát triển nhanh chóng.", false],
          ["제도", "Jedo", "Chế độ, hệ thống", "Danh từ", "새로운 제도를 도입했다.", "Đã áp dụng chế độ mới.", false],
        ]),
      },
    ],
  },
  {
    id: "vocab-topik-6",
    type: "vocab",
    titleVi: "Từ vựng cấp độ TOPIK 6",
    koreanTitle: "토픽 6급 필수 어휘",
    levelBadge: "Cấp độ 6",
    topikLevel: "topik-6",
    completedCount: 0,
    totalCount: 1100,
    iconType: "vocab-book",
    accentColor: "primary",
    chapters: [
      {
        id: "v6-b1",
        titleVi: "Bài 1: Triết học, Lịch sử & Văn học",
        koreanSubtitle: "1과: 철학, 역사와 문학",
        descriptionVi: "Từ vựng chuyên sâu và thành ngữ Hán Hàn bốn chữ (사자성어).",
        targetWordCount: 65,
        items: makeVocabList("v6-b1", "Bài 1: Triết học & Văn học", "topik-6", [
          ["가치관", "Gachigwan", "Thế giới quan / Quan niệm giá trị", "Danh từ", "시대에 따라 가치관이 변한다.", "Quan niệm giá trị thay đổi theo thời đại.", false],
          ["일석이조", "Ilseogijo", "Một mũi tên trúng hai đích", "Danh từ", "운동도 하고 친구도 만나니 일석이조이다.", "Vừa tập thể dục vừa gặp bạn thì đúng là một công đôi việc.", false],
        ]),
      },
    ],
  },

  // =========================================================================
  // 3. NGỮ PHÁP TOPIK 1 (HIỂN THỊ DẠNG GRID 3 CỘT NHƯ ẢNH 3, BẤM VÀO XEM CHI TIẾT & LUYỆN TẬP)
  // =========================================================================
  {
    id: "grammar-topik-1",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 1",
    koreanTitle: "토픽 1급 핵심 문법",
    levelBadge: "Cấp độ 1",
    topikLevel: "topik-1",
    completedCount: 38,
    totalCount: 53,
    iconType: "grammar-search",
    accentColor: "primary",
    chapters: [
      {
        id: "g1-ch1",
        titleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
        koreanSubtitle: "기본 문장 구조와 조사",
        descriptionVi: "Các cấu trúc nền tảng nhất của tiếng Hàn Sơ cấp 1 (TOPIK 1).",
        items: [
          {
            id: "g1-01",
            koreanPattern: "Danh từ + 입니다",
            titleVi: "Là",
            formula: "Danh từ (N) + 입니다",
            explanationVi:
              "Đuôi câu khẳng định trang trọng trong tiếng Hàn, tương đương với 'là...' trong tiếng Việt. Thường được sử dụng khi giới thiệu tên, nghề nghiệp, quốc tịch hoặc trong các tình huống trang trọng như thuyết trình, phỏng vấn, gặp người lớn tuổi.",
            attachmentRules: [
              { condition: "Danh từ có patchim (phụ âm cuối)", example: "학생 + 입니다 → 학생입니다 (Là học sinh)" },
              { condition: "Danh từ không có patchim", example: "의사 + 입니다 → 의사입니다 (Là bác sĩ)" },
            ],
            examples: [
              { korean: "저는 베트남 사람입니다.", romaja: "Jeoneun Beteunam saramimnida.", meaningVi: "Tôi là người Việt Nam." },
              { korean: "제 이름은 민수입니다.", romaja: "Je ireumeun Minsu-imnida.", meaningVi: "Tên của tôi là Minsoo." },
              { korean: "이분은 한국어 선생님입니다.", romaja: "Ibuneun hangugeo seonsaengnimimnida.", meaningVi: "Vị này là giáo viên tiếng Hàn." },
            ],
            practiceDrills: [
              {
                id: "d-g1-01-1",
                type: "conjugation",
                prompt: "Chọn dạng kết hợp đúng để nói 'Tôi là nhân viên công ty (회사원)' ở thể trang trọng:",
                options: ["저는 회사원입니다.", "저는 회사원입니까?", "저는 회사원어요.", "저는 회사원습니다."],
                correctAnswer: "저는 회사원입니다.",
                explanationVi: "Danh từ 회사원 gắn trực tiếp với 입니다 để tạo câu trần thuật khẳng định trang trọng.",
              },
              {
                id: "d-g1-01-2",
                type: "fill-blank",
                prompt: "Điền vào chỗ trống: 여기는 우리 학교_____. (Đây là trường học của chúng tôi.)",
                options: ["입니다", "습니다", "ㅂ니다", "있어요"],
                correctAnswer: "입니다",
                explanationVi: "Sau danh từ 학교 (trường học), dùng 입니다 để mang nghĩa 'là trường học'.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-02",
            koreanPattern: "Danh từ + 입니까",
            titleVi: "Là ... phải không?",
            formula: "Danh từ (N) + 입니까?",
            explanationVi:
              "Là hình thức nghi vấn trang trọng của '입니다', dùng để hỏi xác nhận thông tin về danh từ ('là ... phải không?'). Khi phát âm, cần lên giọng ở cuối câu.",
            attachmentRules: [
              { condition: "Danh từ có patchim", example: "학생 + 입니까? → 학생입니까? (Là học sinh phải không?)" },
              { condition: "Danh từ không có patchim", example: "한국어 + 입니까? → 한국어입니까? (Là tiếng Hàn phải không?)" },
            ],
            examples: [
              { korean: "어느 나라 사람입니까?", romaja: "Eoneu nara saramimnikka?", meaningVi: "Bạn là người nước nào?" },
              { korean: "이것은 무엇입니까?", romaja: "Igeoseun mueosimnikka?", meaningVi: "Cái này là cái gì vậy ạ?" },
              { korean: "선생님입니까?", romaja: "Seonsaengnimimnikka?", meaningVi: "Bạn là giáo viên phải không?" },
            ],
            practiceDrills: [
              {
                id: "d-g1-02-1",
                type: "fill-blank",
                prompt: "Hoàn thành câu hỏi trang trọng: 직업이 무엇_____? (Nghề nghiệp của bạn là gì?)",
                options: ["입니까", "입니다", "습니까", "어요"],
                correctAnswer: "입니까",
                explanationVi: "무엇 là đại từ nghi vấn (danh từ), câu hỏi trang trọng dùng 입니까?.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-03",
            koreanPattern: "Danh từ + 은/는",
            titleVi: "Tiểu từ chỉ chủ đề / chủ ngữ",
            formula: "Danh từ + 은 (có patchim) / 는 (không có patchim)",
            explanationVi:
              "Gắn vào sau danh từ để chỉ ra chủ đề chính của câu ('Về phần... thì...'). Ngoài ra còn dùng để nhấn mạnh hoặc so sánh đối chiếu hai sự vật, chủ thể với nhau.",
            attachmentRules: [
              { condition: "Danh từ kết thúc bằng phụ âm (có patchim)", example: "선생님은, 책은, 베트남은" },
              { condition: "Danh từ kết thúc bằng nguyên âm (không có patchim)", example: "저는, 나라는, 오이는" },
            ],
            examples: [
              { korean: "저는 대학생입니다.", romaja: "Jeoneun daehaksaengimnida.", meaningVi: "Tôi là sinh viên đại học." },
              { korean: "형은 키가 크지만 동생은 키가 작아요.", romaja: "Hyeongeun kiga keujiman dongsaengeun kiga jagayo.", meaningVi: "Anh trai thì cao nhưng em thì thấp." },
            ],
            practiceDrills: [
              {
                id: "d-g1-03-1",
                type: "fill-blank",
                prompt: "Điền trợ từ đúng: 저___ 한국어를 공부합니다. / 제 동생___ 영어를 공부합니다.",
                options: ["는 / 은", "은 / 는", "은 / 은", "는 / 는"],
                correctAnswer: "는 / 은",
                explanationVi: "저 không có patchim nên cộng với 는; 동생 có patchim (ㅇ) nên cộng với 은.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-04",
            koreanPattern: "여기, 거기, 저기",
            titleVi: "Đây, đó, kia",
            formula: "여기 / 거기 / 저기 + 은/는 + Địa điểm + 입니다/이에요",
            explanationVi:
              "Các đại từ chỉ định vị trí không gian: '여기' (đây - gần người nói), '거기' (đó - gần người nghe), '저기' (kia - xa cả người nói và người nghe).",
            attachmentRules: [
              { condition: "Gần người nói", example: "여기는 교실입니다 (Đây là phòng học)" },
              { condition: "Gần người nghe", example: "거기는 도서관입니다 (Đó là thư viện)" },
              { condition: "Xa cả hai người", example: "저기는 학생 식당입니다 (Đằng kia là nhà ăn sinh viên)" },
            ],
            examples: [
              { korean: "여기는 서울역입니다.", romaja: "Yeogineun Seouryeogimnida.", meaningVi: "Đây là ga Seoul." },
              { korean: "저기는 우리 회사예요.", romaja: "Jeogineun uri hoesayeyo.", meaningVi: "Đằng kia là công ty của chúng tôi." },
            ],
            practiceDrills: [
              {
                id: "d-g1-04-1",
                type: "fill-blank",
                prompt: "Khi chỉ vào một tòa nhà ở xa cả bạn và người đối diện, bạn dùng từ nào?",
                options: ["저기", "여기", "거기", "어디"],
                correctAnswer: "저기",
                explanationVi: "Vị trí ở xa cả người nói lẫn người nghe dùng 저기 (đằng kia).",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-05",
            koreanPattern: "이것, 그것, 저것",
            titleVi: "Cái này, cái đó, cái kia",
            formula: "이것 / 그것 / 저것 + 은/이 + Danh từ + 입니다/이에요",
            explanationVi:
              "Đại từ chỉ định đồ vật: '이것' (cái này - gần người nói), '그것' (cái đó - gần người nghe), '저것' (cái kia - xa cả hai).",
            attachmentRules: [
              { condition: "Khi kết hợp với 은", example: "이것은 (rút gọn: 이건), 그것은 (그건), 저것은 (저건)" },
              { condition: "Khi kết hợp với 이", example: "이것이 (rút gọn: 이게), 그것이 (그게), 저것이 (저게)" },
            ],
            examples: [
              { korean: "이것은 한국어 책입니다.", romaja: "Igeoseun hangugeo chaegimnida.", meaningVi: "Cái này là sách tiếng Hàn." },
              { korean: "저것은 무엇입니까?", romaja: "Jeogeoseun mueosimnikka?", meaningVi: "Cái đằng kia là cái gì?" },
            ],
            practiceDrills: [
              {
                id: "d-g1-05-1",
                type: "fill-blank",
                prompt: "Hỏi về món đồ người đối diện đang cầm trên tay: _____은 무엇입니까?",
                options: ["그것", "이것", "저것", "여기"],
                correctAnswer: "그것",
                explanationVi: "Đồ vật ở gần người nghe (người đối diện) dùng 그것 (cái đó).",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-06",
            koreanPattern: "Danh từ + 이/가",
            titleVi: "Tiểu từ chỉ chủ ngữ",
            formula: "Danh từ + 이 (có patchim) / 가 (không có patchim)",
            explanationVi:
              "Đứng sau danh từ để xác định chủ ngữ trực tiếp của hành động hoặc tính chất trong câu, đặc biệt thường đi kèm với 있다/없다, 아니다, và các tính từ miêu tả.",
            attachmentRules: [
              { condition: "Danh từ có patchim", example: "가방이, 교실이, 날씨가 → 책상이 커요" },
              { condition: "Danh từ không có patchim", example: "친구가, 어머니가, 비가 → 날씨가 좋아요" },
              { condition: "Biến đổi đặc biệt", example: "저 + 가 → 제가, 나 + 가 → 내가, 누구 + 가 → 누가" },
            ],
            examples: [
              { korean: "오늘 날씨가 아주 좋습니다.", romaja: "Oneul nalssiga aju joseumnida.", meaningVi: "Hôm nay thời tiết rất đẹp." },
              { korean: "교실에 학생이 많아요.", romaja: "Gyosire haksaengi manayo.", meaningVi: "Trong lớp có nhiều học sinh." },
            ],
            practiceDrills: [
              {
                id: "d-g1-06-1",
                type: "fill-blank",
                prompt: "Chọn trợ từ đúng: 방에 침대___ 있습니다. (Trong phòng có cái giường.)",
                options: ["가", "이", "를", "을"],
                correctAnswer: "가",
                explanationVi: "침대 kết thúc bằng nguyên âm ㅐ (không có patchim) và đi với 있습니다 nên dùng 가.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-07",
            koreanPattern: "Danh từ + 에 있습니다",
            titleVi: "Có ở (tồn tại tại vị trí)",
            formula: "Danh từ chỉ nơi chốn + 에 + 있다/없다 (있습니다/없습니다)",
            explanationVi:
              "Diễn tả người hoặc vật đang tồn tại (có mặt) hoặc không tồn tại ở một địa điểm, vị trí cụ thể nào đó.",
            attachmentRules: [
              { condition: "Cấu trúc chuẩn", example: "N1(Chủ thể)이/가 + N2(Vị trí)에 + 있습니다/없습니다" },
              { condition: "Thể lịch sự thân mật", example: "있어요 (có ở) / 없어요 (không có ở)" },
            ],
            examples: [
              { korean: "책이 책상 위에 있습니다.", romaja: "Chaegi chaeksang wie itseumnida.", meaningVi: "Quyển sách có ở trên bàn." },
              { korean: "동생은 지금 집에 없습니다.", romaja: "Dongsaengeun jigeum jibe eopseumnida.", meaningVi: "Em tôi bây giờ không có ở nhà." },
            ],
            practiceDrills: [
              {
                id: "d-g1-07-1",
                type: "fill-blank",
                prompt: "Điền vào chỗ trống: 도서관___ 책이 많습니다. (Ở thư viện có nhiều sách.)",
                options: ["에", "을", "가", "를"],
                correctAnswer: "에",
                explanationVi: "Chỉ vị trí tồn tại của sự vật dùng trợ từ 에.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-08",
            koreanPattern: "Danh từ + 이/가 아닙니다",
            titleVi: "Không phải (là)",
            formula: "Danh từ + 이/가 아닙니다 (아닙니다 / 아니에요)",
            explanationVi:
              "Là dạng phủ định của '입니다', mang nghĩa 'không phải là...'. Danh từ đứng trước bắt buộc đi kèm tiểu từ '이' (nếu có patchim) hoặc '가' (nếu không có patchim).",
            attachmentRules: [
              { condition: "Danh từ có patchim + 이 아닙니다", example: "학생이 아닙니다 (Không phải là học sinh)" },
              { condition: "Danh từ không có patchim + 가 아닙니다", example: "의사가 아닙니다 (Không phải là bác sĩ)" },
            ],
            examples: [
              { korean: "저는 일본 사람이 아닙니다.", romaja: "Jeoneun Ilbon sarami animnida.", meaningVi: "Tôi không phải là người Nhật Bản." },
              { korean: "이것은 제 가방이 아니에요.", romaja: "Igeoseun je gabangi anieyo.", meaningVi: "Cái này không phải là cặp của tôi." },
            ],
            practiceDrills: [
              {
                id: "d-g1-08-1",
                type: "conjugation",
                prompt: "Chuyển sang câu phủ định đúng: '저는 의사입니다' (Tôi là bác sĩ) → 'Tôi không phải là bác sĩ':",
                options: ["저는 의사가 아닙니다.", "저는 의사이 아닙니다.", "저는 의사 아닙니다.", "저는 의사를 아닙니다."],
                correctAnswer: "저는 의사가 아닙니다.",
                explanationVi: "의사 không có patchim nên thêm 가 + 아닙니다.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-09",
            koreanPattern: "Động từ/tính từ + ㅂ/습니다",
            titleVi: "Đuôi trang trọng kết thúc câu trần thuật",
            formula: "Gốc V/A + ㅂ니다 (không patchim) / 습니다 (có patchim)",
            explanationVi:
              "Đuôi câu kết thúc trần thuật ở mức độ kính ngữ cao và trang trọng. Dùng trong phát biểu, tin tức, quân đội, công sở hoặc khi giao tiếp lịch sự.",
            attachmentRules: [
              { condition: "Gốc từ không có patchim (hoặc patchim ㄹ)", example: "가다 → 갑니다, 마시다 → 마십니다, 살다 → 삽니다" },
              { condition: "Gốc từ có patchim", example: "먹다 → 먹습니다, 읽다 → 읽습니다, 좋다 → 좋습니다" },
            ],
            examples: [
              { korean: "저는 매일 한국어를 공부합니다.", romaja: "Jeoneun maeil hangugeoreul gongbuhamnida.", meaningVi: "Tôi học tiếng Hàn mỗi ngày." },
              { korean: "아침에 빵과 우유를 먹습니다.", romaja: "Achime ppanggwa uyureul meokseumnida.", meaningVi: "Buổi sáng tôi ăn bánh mì và sữa." },
            ],
            practiceDrills: [
              {
                id: "d-g1-09-1",
                type: "conjugation",
                prompt: "Chia động từ '읽다' (Đọc) với đuôi câu trang trọng ㅂ/습니다:",
                options: ["읽습니다", "읽ㅂ니다", "읽입니다", "읽어요"],
                correctAnswer: "읽습니다",
                explanationVi: "Gốc 읽 có patchim ㄺ nên cộng với 습니다 → 읽습니다.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-10",
            koreanPattern: "Động từ/tính từ + ㅂ/습니까",
            titleVi: "Đuôi trang trọng kết thúc câu nghi vấn",
            formula: "Gốc V/A + ㅂ니까? (không patchim) / 습니까? (có patchim)",
            explanationVi:
              "Hình thức câu hỏi trang trọng tương ứng với đuôi ㅂ/습니다. Dùng để hỏi hành động, trạng thái một cách lịch sự và trang nghiêm.",
            attachmentRules: [
              { condition: "Gốc từ không có patchim", example: "가다 → 갑니까?, 오다 → 옵니까?, 바쁘다 → 바쁩니까?" },
              { condition: "Gốc từ có patchim", example: "먹다 → 먹습니까?, 재미있다 → 재미있습니까?" },
            ],
            examples: [
              { korean: "주말에 무엇을 합니까?", romaja: "Jumare mueoseul hamnikka?", meaningVi: "Cuối tuần bạn làm gì?" },
              { korean: "한국 음식이 맛있습니까?", romaja: "Hanguk eumsigi masitseumnikka?", meaningVi: "Món ăn Hàn Quốc có ngon không ạ?" },
            ],
            practiceDrills: [
              {
                id: "d-g1-10-1",
                type: "conjugation",
                prompt: "Chọn câu hỏi trang trọng đúng cho động từ '가다' (Đi):",
                options: ["어디에 갑니까?", "어디에 가습니까?", "어디에 갑니다?", "어디에 가입니까?"],
                correctAnswer: "어디에 갑니까?",
                explanationVi: "가다 không có patchim nên gắn ㅂ니까? → 갑니까?.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-11",
            koreanPattern: "Danh từ + 을/를",
            titleVi: "Tiểu từ chỉ tân ngữ",
            formula: "Danh từ + 을 (có patchim) / 를 (không có patchim)",
            explanationVi:
              "Gắn vào sau danh từ để chỉ ra danh từ đó là tân ngữ trực tiếp chịu tác động của ngoại động từ (ăn cái gì, đọc cái gì, gặp ai, mua cái gì...).",
            attachmentRules: [
              { condition: "Danh từ có patchim", example: "밥을 먹어요, 책을 읽어요, 음악을 들어요" },
              { condition: "Danh từ không có patchim", example: "커피를 마셔요, 영화를 봐요, 친구를 만나요" },
            ],
            examples: [
              { korean: "저는 사과를 좋아합니다.", romaja: "Jeoneun sagwareul joahamnida.", meaningVi: "Tôi thích táo." },
              { korean: "도서관에서 한국어 책을 읽습니다.", romaja: "Doseogwaneseo hangugeo chaegeul ikseumnida.", meaningVi: "Tôi đọc sách tiếng Hàn ở thư viện." },
            ],
            practiceDrills: [
              {
                id: "d-g1-11-1",
                type: "fill-blank",
                prompt: "Điền trợ từ tân ngữ đúng: 아침에 우유___ 마시고 빵___ 먹어요.",
                options: ["를 / 을", "을 / 를", "가 / 이", "는 / 은"],
                correctAnswer: "를 / 을",
                explanationVi: "우유 không có patchim dùng 를; 빵 có patchim (ㅇ) dùng 을.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-12",
            koreanPattern: "Danh từ + 에서",
            titleVi: "Ở, tại (tiểu từ chỉ nơi diễn ra hành động)",
            formula: "Danh từ chỉ địa điểm + 에서 + Động từ hành động",
            explanationVi:
              "Đứng sau danh từ chỉ địa điểm để biểu thị nơi một hành động cụ thể đang diễn ra (học ở đâu, làm việc ở đâu, ăn ở đâu, mua sắm ở đâu). Ngoài ra còn có nghĩa là 'từ' (xuất phát điểm).",
            attachmentRules: [
              { condition: "Nơi diễn ra hành động động", example: "학교에서 공부해요 (Học ở trường), 식당에서 먹어요 (Ăn ở nhà hàng)" },
              { condition: "Phân biệt với 에", example: "에 chỉ vị trí tĩnh (있다/없다) hoặc đích đến (가다/오다); 에서 đi với động từ hành động." },
            ],
            examples: [
              { korean: "도서관에서 책을 읽습니다.", romaja: "Doseogwaneseo chaegeul ikseumnida.", meaningVi: "Tôi đọc sách ở thư viện." },
              { korean: "백화점에서 옷을 샀어요.", romaja: "Baekhwajeomeseo oseul sasseoyo.", meaningVi: "Tôi đã mua quần áo ở trung tâm thương mại." },
            ],
            practiceDrills: [
              {
                id: "d-g1-12-1",
                type: "fill-blank",
                prompt: "Điền trợ từ đúng: 공원____ 운동을 합니다. (Tôi tập thể dục ở công viên.)",
                options: ["에서", "에", "을", "으로"],
                correctAnswer: "에서",
                explanationVi: "운동하다 (tập thể dục) là động từ hành động diễn ra tại địa điểm nên dùng 에서.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-13",
            koreanPattern: "한자어 수사",
            titleVi: "Số Hán Hàn",
            formula: "일(1), 이(2), 삼(3), 사(4), 오(5), 육(6), 칠(7), 팔(8), 구(9), 십(10), 백(100), 천(1000), 만(10.000)",
            explanationVi:
              "Hệ thống số đếm có nguồn gốc Hán Hàn. Được sử dụng để nói ngày tháng năm, số phút, số giây, giá tiền (원), số tầng (층), số điện thoại, số phòng.",
            attachmentRules: [
              { condition: "Lưu ý tháng 6 và tháng 10", example: "6월 → 유월 (không đọc 육월), 10월 → 시월 (không đọc 십월)" },
              { condition: "Ghép số hàng chục", example: "20 = 이십, 35 = 삼십오, 100 = 백" },
            ],
            examples: [
              { korean: "오늘은 유월 십오일입니다.", romaja: "Oneureun yuwol siboirimnida.", meaningVi: "Hôm nay là ngày 15 tháng 6." },
              { korean: "이 책은 만 오천 원입니다.", romaja: "I chaegeun man ocheon wonimnida.", meaningVi: "Quyển sách này giá 15.000 won." },
            ],
            practiceDrills: [
              {
                id: "d-g1-13-1",
                type: "conjugation",
                prompt: "'Tháng 6' và 'Tháng 10' trong tiếng Hàn được viết và đọc đúng là:",
                options: ["유월 / 시월", "육월 / 십월", "유월 / 십월", "육월 / 시월"],
                correctAnswer: "유월 / 시월",
                explanationVi: "Bất quy tắc phát âm số Hán Hàn khi đi với 월: 육월 → 유월, 십월 → 시월.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-14",
            koreanPattern: "Danh từ + 와/과",
            titleVi: "Và (liên từ nối danh từ)",
            formula: "Danh từ + 과 (có patchim) / 와 (không có patchim)",
            explanationVi:
              "Dùng để nối hai hay nhiều danh từ với nhau (mang nghĩa 'và'), hoặc diễn tả làm hành động gì đó 'cùng với' ai. Thường dùng nhiều trong văn viết và lời nói trang trọng.",
            attachmentRules: [
              { condition: "Danh từ có patchim + 과", example: "빵과 우유 (Bánh mì và sữa), 책과 공책 (Sách và vở)" },
              { condition: "Danh từ không có patchim + 와", example: "사과와 오렌지 (Táo và cam), 친구와 함께 (Cùng với bạn)" },
            ],
            examples: [
              { korean: "교실에 책상과 의자가 있습니다.", romaja: "Gyosire chaeksanggwa uijaga itseumnida.", meaningVi: "Trong lớp có bàn và ghế." },
              { korean: "주말에 친구와 영화를 봤어요.", romaja: "Jumare chinguwa yeonghwareul bwasseoyo.", meaningVi: "Cuối tuần tôi đã xem phim cùng với bạn." },
            ],
            practiceDrills: [
              {
                id: "d-g1-14-1",
                type: "fill-blank",
                prompt: "Điền từ nối đúng: 시장에서 고기___ 채소를 샀습니다.",
                options: ["와", "과", "을", "에"],
                correctAnswer: "와",
                explanationVi: "고기 kết thúc bằng nguyên âm ㅣ (không có patchim) nên đi với 와.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-15",
            koreanPattern: "Danh từ + 에",
            titleVi: "Vào, vào lúc (tiểu từ chỉ thời gian)",
            formula: "Danh từ thời gian + 에",
            explanationVi:
              "Gắn sau danh từ chỉ thời gian (giờ, thứ, ngày, tháng, năm, mùa) để chỉ thời điểm mà một hành động diễn ra ('vào lúc...'). Lưu ý: KHÔNG dùng 에 sau các từ 오늘, 내일, 어제, 지금, 언제.",
            attachmentRules: [
              { condition: "Dùng với giờ, thứ, tháng", example: "일곱 시에 (lúc 7 giờ), 월요일에 (vào thứ Hai), 삼월에 (vào tháng 3)" },
              { condition: "Ngoại lệ KHÔNG dùng 에", example: "오늘, 내일, 어제, 모레, 지금, 언제 (VD: 내일 만나요)" },
            ],
            examples: [
              { korean: "아침 일곱 시에 일어납니다.", romaja: "Achim ilgop sie ireonamnida.", meaningVi: "Tôi thức dậy vào lúc 7 giờ sáng." },
              { korean: "내일 친구를 만납니다.", romaja: "Naeil chingureul mannamnida.", meaningVi: "Ngày mai tôi gặp bạn (không dùng 내일에)." },
            ],
            practiceDrills: [
              {
                id: "d-g1-15-1",
                type: "fill-blank",
                prompt: "Từ chỉ thời gian nào sau đây KHÔNG kết hợp với tiểu từ '에'?",
                options: ["오늘 (Hôm nay)", "토요일 (Thứ Bảy)", "아침 (Buổi sáng)", "여덟 시 (8 giờ)"],
                correctAnswer: "오늘 (Hôm nay)",
                explanationVi: "Các từ 오늘, 어제, 내일, 지금, 언제 đứng độc lập mà không gắn 에.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-16",
            koreanPattern: "고유어 수사",
            titleVi: "Số thuần Hàn",
            formula: "하나(1), 둘(2), 셋(3), 넷(4), 다섯(5), 여섯(6), 일곱(7), 여덟(8), 아홉(9), 열(10), 스물(20)",
            explanationVi:
              "Hệ thống số đếm thuần Hàn. Được dùng để nói giờ (시), tuổi (살), và đếm số lượng đồ vật, con người khi đi kèm với các danh từ đơn vị (개, 명, 마리, 잔, 병, 권...).",
            attachmentRules: [
              { condition: "Khi đứng trước danh từ đơn vị", example: "하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네, 스물 → 스무 (VD: 한 시, 두 명, 세 개)" },
              { condition: "Nói giờ + phút", example: "Giờ (시) dùng số thuần Hàn + Phút (분) dùng số Hán Hàn (VD: 두 시 삼십 분 = 2 giờ 30 phút)" },
            ],
            examples: [
              { korean: "지금은 세 시 이십 분입니다.", romaja: "Jigeumeun se si isip bunimnida.", meaningVi: "Bây giờ là 3 giờ 20 phút." },
              { korean: "커피 두 잔 주세요.", romaja: "Keopi du jan juseyo.", meaningVi: "Cho tôi 2 tách cà phê." },
            ],
            practiceDrills: [
              {
                id: "d-g1-16-1",
                type: "conjugation",
                prompt: "Cách nói '1 giờ 15 phút' đúng trong tiếng Hàn là:",
                options: ["한 시 십오 분", "하나 시 십오 분", "일 시 십오 분", "한 시 열다섯 분"],
                correctAnswer: "한 시 십오 분",
                explanationVi: "Giờ dùng số thuần Hàn rút gọn (한 시), phút dùng số Hán Hàn (십오 분).",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-17",
            koreanPattern: "수 관형사 (1)",
            titleVi: "Định từ số & Danh từ đơn vị",
            formula: "Danh từ + Số thuần Hàn (한/두/세/네...) + Danh từ đơn vị (개/명/분/권/병/잔/마리)",
            explanationVi:
              "Khi đếm số lượng sự vật trong tiếng Hàn, ta đặt Danh từ chỉ sự vật lên trước, sau đó đến Số thuần Hàn và Danh từ đơn vị tương ứng với loại vật đó.",
            attachmentRules: [
              { condition: "Đếm đồ vật nói chung", example: "개 (사과 세 개 = 3 quả táo)" },
              { condition: "Đếm người", example: "명 / 분(kính ngữ) (학생 네 명 = 4 học sinh, 선생님 두 분 = 2 vị giáo viên)" },
              { condition: "Đếm sách / cốc / động vật", example: "권 (quyển), 잔 (tách/ly), 병 (chai), 마리 (con vật)" },
            ],
            examples: [
              { korean: "교실에 학생이 스무 명 있어요.", romaja: "Gyosire haksaengi seumu myeong isseoyo.", meaningVi: "Trong lớp có 20 học sinh." },
              { korean: "공책 다섯 권을 샀습니다.", romaja: "Gongchaek daseot gwoneul satseumnida.", meaningVi: "Tôi đã mua 5 quyển vở." },
            ],
            practiceDrills: [
              {
                id: "d-g1-17-1",
                type: "fill-blank",
                prompt: "Điền cụm từ đúng để nói '4 quả táo': 사과 _____을/를 샀어요.",
                options: ["네 개", "넷 개", "사 개", "네 명"],
                correctAnswer: "네 개",
                explanationVi: "넷 đứng trước danh từ đơn vị 개 biến đổi thành 네 → 네 개.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-18",
            koreanPattern: "Động từ/tính từ + 아/어요",
            titleVi: "Đuôi câu thân mật, lịch sự",
            formula: "Gốc V/A + 아요 / 어요 / 해요",
            explanationVi:
              "Đuôi câu kết thúc ở thì hiện tại phổ biến nhất trong giao tiếp hàng ngày tại Hàn Quốc, vừa thể hiện sự lịch sự vừa gần gũi, dùng cho cả câu trần thuật, câu hỏi và câu cầu khiến.",
            attachmentRules: [
              { condition: "Gốc từ chứa nguyên âm ㅏ, ㅗ", example: "가다 → 가요, 오다 → 와요, 앉다 → 앉아요, 좋다 → 좋아요" },
              { condition: "Gốc từ chứa các nguyên âm còn lại", example: "먹다 → 먹어요, 읽다 → 읽어요, 마시다 → 마셔요, 배우다 → 배워요" },
              { condition: "Động/tính từ kết thúc bằng 하다", example: "하다 → 해요 (공부하다 → 공부해요, 운동하다 → 운동해요)" },
            ],
            examples: [
              { korean: "저는 매일 한국어를 공부해요.", romaja: "Jeoneun maeil hangugeoreul gongbuhaeyo.", meaningVi: "Tôi học tiếng Hàn mỗi ngày." },
              { korean: "주말에 친구와 영화를 봐요.", romaja: "Jumare chinguwa yeonghwareul bwayo.", meaningVi: "Cuối tuần tôi xem phim cùng bạn." },
            ],
            practiceDrills: [
              {
                id: "d-g1-18-1",
                type: "conjugation",
                prompt: "Chia động từ '마시다' (Uống) sang đuôi câu thân mật 아/어요:",
                options: ["마셔요", "마시어요", "마사요", "마해요"],
                correctAnswer: "마셔요",
                explanationVi: "마시 + 어요 → nguyên âm ㅣ kết hợp với 어 rút gọn thành ㅕ → 마셔요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-19",
            koreanPattern: "Danh từ + 에 가다",
            titleVi: "Đi đến (địa điểm đích đến)",
            formula: "Danh từ chỉ địa điểm + 에 + 가다/오다/다니다",
            explanationVi:
              "Tiểu từ '에' gắn sau danh từ chỉ nơi chốn và đi kèm với các động từ di chuyển (가다 - đi, 오다 - đến, 다니다 - đi lại thường xuyên, 도착하다 - đến nơi) để chỉ đích đến của hành động.",
            attachmentRules: [
              { condition: "Đi đến đâu", example: "학교에 가요 (Đi đến trường), 집에 와요 (Về đến nhà)" },
              { condition: "Đi làm / đi học thường xuyên", example: "회사에 다녀요 (Đi làm ở công ty)" },
            ],
            examples: [
              { korean: "일요일에 교회에 갑니다.", romaja: "Iryoire gyohoee gamnida.", meaningVi: "Chủ nhật tôi đi đến nhà thờ." },
              { korean: "지금 어디에 가요?", romaja: "Jigeum eodie gayo?", meaningVi: "Bây giờ bạn đi đâu thế?" },
            ],
            practiceDrills: [
              {
                id: "d-g1-19-1",
                type: "fill-blank",
                prompt: "Điền vào chỗ trống: 내일 부산___ 갑니다. (Ngày mai tôi đi Busan.)",
                options: ["에", "에서", "을", "과"],
                correctAnswer: "에",
                explanationVi: "Với động từ di chuyển 가다, địa điểm đích đến dùng tiểu từ 에.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-20",
            koreanPattern: "안 + Động từ/tính từ",
            titleVi: "Không (làm gì / như thế nào)",
            formula: "안 + Động từ / Tính từ (Với N+하다 → N + 안 하다)",
            explanationVi:
              "Phó từ phủ định '안' đặt ngay trước động từ hoặc tính từ để mang nghĩa 'không...'. Đối với động từ ghép dạng 'Danh từ + 하다' (như 공부하다, 운동하다), phải tách danh từ ra và đặt '안' ngay trước '하다'.",
            attachmentRules: [
              { condition: "Động từ / Tính từ đơn", example: "가다 → 안 가요 (Không đi), 먹다 → 안 먹어요 (Không ăn), 비싸다 → 안 비싸요 (Không đắt)" },
              { condition: "Động từ Danh từ + 하다", example: "공부하다 → 공부를 안 해요, 운동하다 → 운동을 안 해요" },
            ],
            examples: [
              { korean: "저는 매운 음식을 안 먹어요.", romaja: "Jeoneun maeun eumsigeul an meogeoyo.", meaningVi: "Tôi không ăn đồ ăn cay." },
              { korean: "오늘은 숙제를 안 했어요.", romaja: "Oneureun sukjereul an haesseoyo.", meaningVi: "Hôm nay tôi đã không làm bài tập." },
            ],
            practiceDrills: [
              {
                id: "d-g1-20-1",
                type: "conjugation",
                prompt: "Câu phủ định với '안' nào dưới đây là ĐÚNG ngữ pháp?",
                options: ["오늘 운동을 안 해요.", "오늘 안 운동해요.", "오늘 운동안 해요.", "오늘 운동해요 안."],
                correctAnswer: "오늘 운동을 안 해요.",
                explanationVi: "Với động từ N+하다 (운동하다), phải đặt 안 giữa danh từ và 하다 → 운동(을) 안 해요.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
          {
            id: "g1-21",
            koreanPattern: "Động từ/tính từ + 았/었",
            titleVi: "Đã (thì quá khứ)",
            formula: "Gốc V/A + 았어요 / 었어요 / 했어요 (았습니다 / 었습니다 / 했습니다)",
            explanationVi:
              "Vĩ tố thời quá khứ dùng để diễn tả hành động hoặc trạng thái đã xảy ra và kết thúc trong quá khứ ('đã...'). Quy tắc chọn 았/었/했 hoàn toàn giống với quy tắc chia 아/어/해 ở thì hiện tại.",
            attachmentRules: [
              { condition: "Gốc từ chứa ㅏ, ㅗ", example: "가다 → 갔어요, 오다 → 왔어요, 살다 → 살았어요, 좋다 → 좋았어요" },
              { condition: "Gốc từ chứa nguyên âm khác", example: "먹다 → 먹었어요, 마시다 → 마셨어요, 읽다 → 읽었어요" },
              { condition: "Kết thúc bằng 하다", example: "공부하다 → 공부했어요, 여행하다 → 여행했어요" },
            ],
            examples: [
              { korean: "어제 친구와 영화를 봤어요.", romaja: "Eoje chinguwa yeonghwareul bwasseoyo.", meaningVi: "Hôm qua tôi đã xem phim cùng bạn." },
              { korean: "주말에 부산을 여행했습니다.", romaja: "Jumare Busaneul yeohaenghaetseumnida.", meaningVi: "Cuối tuần tôi đã đi du lịch Busan." },
            ],
            practiceDrills: [
              {
                id: "d-g1-21-1",
                type: "conjugation",
                prompt: "Chia động từ '먹다' (Ăn) và '가다' (Đi) sang thì quá khứ thân mật:",
                options: ["먹었어요 / 갔어요", "먹았어요 / 가았어요", "먹었어요 / 가었어요", "먹았어요 / 갔어요"],
                correctAnswer: "먹었어요 / 갔어요",
                explanationVi: "먹다 (nguyên âm ㅓ) + 었어요 → 먹었어요; 가다 (nguyên âm ㅏ) + 았어요 → 갔어요.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-1",
            chapterId: "g1-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc câu cơ bản & Trợ từ",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 4. NGỮ PHÁP TOPIK 2
  // =========================================================================
  {
    id: "grammar-topik-2",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 2",
    koreanTitle: "토픽 2급 핵심 문법",
    levelBadge: "Cấp độ 2",
    topikLevel: "topik-2",
    completedCount: 9,
    totalCount: 46,
    iconType: "grammar-search",
    accentColor: "primary",
    chapters: [
      {
        id: "g2-ch1",
        titleVi: "Chương 1: Liên kết câu, Nguyên nhân & Mục đích",
        koreanSubtitle: "연결어미와 이유·목적 표현",
        descriptionVi: "Các cấu trúc mở rộng câu phức trong chương trình Sơ cấp 2 (TOPIK 2).",
        items: [
          {
            id: "g2-01",
            koreanPattern: "Động từ + 고 싶다",
            titleVi: "Muốn (làm gì)",
            formula: "Gốc Động từ + 고 싶다 (고 싶어요 / 고 싶습니다)",
            explanationVi:
              "Diễn tả mong muốn, hy vọng của chủ ngữ ngôi thứ nhất (tôi/chúng tôi) trong câu trần thuật, hoặc hỏi mong muốn của ngôi thứ hai (bạn) trong câu nghi vấn. Khi chủ ngữ là ngôi thứ ba, dùng '-고 싶어하다'.",
            attachmentRules: [
              { condition: "Mọi động từ (không phân biệt patchim)", example: "가다 → 가고 싶어요 (Muốn đi), 먹다 → 먹고 싶어요 (Muốn ăn)" },
              { condition: "Chủ ngữ ngôi thứ 3", example: "동생은 한국에 가고 싶어해요 (Em tôi muốn đi Hàn Quốc)" },
            ],
            examples: [
              { korean: "저는 한국에 유학 가고 싶어요.", romaja: "Jeoneun Hanguge yuhak gago sipeoyo.", meaningVi: "Tôi muốn đi du học Hàn Quốc." },
              { korean: "무엇을 먹고 싶습니까?", romaja: "Mueoseul meokgo sipseumnikka?", meaningVi: "Bạn muốn ăn món gì?" },
            ],
            practiceDrills: [
              {
                id: "d-g2-01-1",
                type: "conjugation",
                prompt: "Để nói 'Tôi muốn xem phim Hàn Quốc', câu nào đúng?",
                options: ["한국 영화를 보고 싶어요.", "한국 영화를 봐고 싶어요.", "한국 영화를 보싶어요.", "한국 영화를 보고 싶어해요."],
                correctAnswer: "한국 영화를 보고 싶어요.",
                explanationVi: "Gốc động từ 보다 là 보 + 고 싶어요 → 보고 싶어요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-2",
            chapterId: "g2-ch1",
            chapterTitleVi: "Chương 1: Liên kết câu & Mong muốn",
          },
          {
            id: "g2-02",
            koreanPattern: "Động từ/tính từ + 아/어서",
            titleVi: "Vì ... nên ... / Rồi (trình tự)",
            formula: "Gốc V/A + 아서 / 어서 / 해서",
            explanationVi:
              "Có 2 ý nghĩa chính: (1) Chỉ nguyên nhân - kết quả ('Vì vế trước nên dẫn đến vế sau', lưu ý vế sau KHÔNG dùng câu mệnh lệnh hay rủ rê); (2) Chỉ trình tự hai hành động có liên quan chặt chẽ theo thời gian.",
            attachmentRules: [
              { condition: "Nguyên âm ㅏ, ㅗ + 아서", example: "바쁘다 → 바빠서, 만나다 → 만나서" },
              { condition: "Nguyên âm khác + 어서", example: "먹다 → 먹어서, 늦다 → 늦어서" },
              { condition: "하다 → 해서", example: "공부하다 → 공부해서, 피곤하다 → 피곤해서" },
            ],
            examples: [
              { korean: "배가 아파서 병원에 갔어요.", romaja: "Baega apaseo byeongwone gasseoyo.", meaningVi: "Vì đau bụng nên tôi đã đi bệnh viện." },
              { korean: "도서관에 가서 책을 읽었어요.", romaja: "Doseogwane gaseo chaegeul ilgeosseoyo.", meaningVi: "Tôi đến thư viện rồi đọc sách ở đó." },
            ],
            practiceDrills: [
              {
                id: "d-g2-02-1",
                type: "fill-blank",
                prompt: "Chọn vế nối đúng: 차가 막히다 (Tắc đường) → 차가 _____ 늦었어요.",
                options: ["막혀서", "막혔어서", "막히고", "막히지만"],
                correctAnswer: "막혀서",
                explanationVi: "막히 + 어서 → 막혀서. Tuyệt đối không chia quá khứ (았/었) trước 아/어서.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-2",
            chapterId: "g2-ch1",
            chapterTitleVi: "Chương 1: Liên kết câu & Mong muốn",
          },
          {
            id: "g2-03",
            koreanPattern: "Động từ + (으)러 가다/오다",
            titleVi: "Đi/đến để làm gì (mục đích di chuyển)",
            formula: "Gốc Động từ + 으러 (có patchim) / 러 (không patchim hoặc patchim ㄹ) + 가다/오다",
            explanationVi:
              "Diễn tả mục đích của hành động di chuyển: đi hoặc đến một địa điểm nào đó để thực hiện hành động ở vế trước.",
            attachmentRules: [
              { condition: "Động từ không có patchim hoặc patchim ㄹ", example: "공부하다 → 공부하러 가요, 놀다 → 놀러 가요" },
              { condition: "Động từ có patchim", example: "먹다 → 먹으러 가요, 읽다 → 읽으러 가요" },
            ],
            examples: [
              { korean: "식당에 점심을 먹으러 갑니다.", romaja: "Sikdange jeomsimeul meogeureo gamnida.", meaningVi: "Tôi đi đến nhà hàng để ăn trưa." },
              { korean: "주말에 친구와 놀러 갈 거예요.", romaja: "Jumare chinguwa nolleo gal geoyeyo.", meaningVi: "Cuối tuần tôi sẽ đi chơi cùng bạn." },
            ],
            practiceDrills: [
              {
                id: "d-g2-03-1",
                type: "conjugation",
                prompt: "Chọn dạng kết hợp đúng cho '책을 읽다' (Đọc sách) + '(으)러 가다':",
                options: ["책을 읽으러 가요.", "책을 읽러 가요.", "책을 읽고 가요.", "책을 읽으러 먹어요."],
                correctAnswer: "책을 읽으러 가요.",
                explanationVi: "읽다 có patchim nên cộng với 으러 가요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-2",
            chapterId: "g2-ch1",
            chapterTitleVi: "Chương 1: Liên kết câu & Mong muốn",
          },
          {
            id: "g2-04",
            koreanPattern: "Động từ/tính từ + (으)ㄹ 거예요",
            titleVi: "Sẽ (thì tương lai & phỏng đoán)",
            formula: "Gốc V/A + 을 거예요 (có patchim) / ㄹ 거예요 (không patchim, patchim ㄹ)",
            explanationVi:
              "Diễn tả kế hoạch, dự định sẽ thực hiện trong tương lai ('sẽ làm gì'), hoặc dùng để phỏng đoán một sự việc có khả năng cao là đúng.",
            attachmentRules: [
              { condition: "Không có patchim hoặc patchim ㄹ", example: "가다 → 갈 거예요, 만들다 → 만들 거예요" },
              { condition: "Có patchim", example: "먹다 → 먹을 거예요, 읽다 → 읽을 거예요" },
            ],
            examples: [
              { korean: "내년 여름에 한국에 갈 거예요.", romaja: "Naenyeon yeoreume Hanguge gal geoyeyo.", meaningVi: "Mùa hè năm sau tôi sẽ đi Hàn Quốc." },
              { korean: "내일은 날씨가 추울 거예요.", romaja: "Naeireun nalssiga chuul geoyeyo.", meaningVi: "Ngày mai chắc thời tiết sẽ lạnh đấy." },
            ],
            practiceDrills: [
              {
                id: "d-g2-04-1",
                type: "conjugation",
                prompt: "Chia động từ '만들다' (Làm, chế biến) với cấu trúc tương lai '(으)ㄹ 거예요':",
                options: ["만들 거예요", "만들을 거예요", "만들릴 거예요", "만들어요"],
                correctAnswer: "만들 거예요",
                explanationVi: "만들다 có sẵn patchim ㄹ nên giữ nguyên ㄹ và cộng trực tiếp với 거예요 → 만들 거예요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-2",
            chapterId: "g2-ch1",
            chapterTitleVi: "Chương 1: Liên kết câu & Mong muốn",
          },
          {
            id: "g2-05",
            koreanPattern: "Động từ + (으)ㄹ 수 있다/없다",
            titleVi: "Có thể / Không thể (làm gì)",
            formula: "Gốc V + 을 수 있다/없다 (có patchim) / ㄹ 수 있다/없다 (không patchim)",
            explanationVi:
              "Diễn tả năng lực thực hiện một hành động hoặc khả năng cho phép của hoàn cảnh ('có thể' hoặc 'không thể' làm việc gì).",
            attachmentRules: [
              { condition: "Không patchim / Patchim ㄹ", example: "하다 → 할 수 있어요, 만들다 → 만들 수 있어요" },
              { condition: "Có patchim", example: "읽다 → 읽을 수 있어요, 먹다 → 먹을 수 없어요" },
            ],
            examples: [
              { korean: "저는 한국어를 읽을 수 있어요.", romaja: "Jeoneun hangugeoreul ilgeul su isseoyo.", meaningVi: "Tôi có thể đọc được tiếng Hàn." },
              { korean: "바빠서 파티에 갈 수 없습니다.", romaja: "Bappaseo patie gal su eopseumnida.", meaningVi: "Vì bận nên tôi không thể đến bữa tiệc." },
            ],
            practiceDrills: [
              {
                id: "d-g2-05-1",
                type: "fill-blank",
                prompt: "Hoàn thành câu: 저는 매운 음식을 먹다 → 저는 매운 음식을 _____.",
                options: ["먹을 수 없어요", "먹ㄹ 수 없어요", "먹수 없어요", "먹는 수 없어요"],
                correctAnswer: "먹을 수 없어요",
                explanationVi: "먹다 có patchim ㄱ nên cộng với 을 수 없어요.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-2",
            chapterId: "g2-ch1",
            chapterTitleVi: "Chương 1: Liên kết câu & Mong muốn",
          },
          {
            id: "g2-06",
            koreanPattern: "Động từ/tính từ + 아/어야 되다/하다",
            titleVi: "Phải, cần phải (làm gì)",
            formula: "Gốc V/A + 아/어/해야 되다 (hoặc 하다)",
            explanationVi:
              "Diễn tả nghĩa vụ, sự bắt buộc hoặc điều tất yếu phải thực hiện ('phải làm gì').",
            attachmentRules: [
              { condition: "Nguyên âm ㅏ, ㅗ", example: "가다 → 가야 해요 / 가야 돼요" },
              { condition: "Nguyên âm khác", example: "먹다 → 먹어야 해요, 읽다 → 읽어야 돼요" },
              { condition: "하다", example: "공부하다 → 공부해야 해요" },
            ],
            examples: [
              { korean: "내일 시험이 있어서 공부해야 해요.", romaja: "Naeil siheomi isseoseo gongbuhaeya haeyo.", meaningVi: "Ngày mai có bài thi nên tôi phải học bài." },
              { korean: "밤 열 시까지 집에 들어가야 돼요.", romaja: "Bam yeol sikkaji jibe deureogaya dwaeyo.", meaningVi: "Tôi phải về nhà trước 10 giờ đêm." },
            ],
            practiceDrills: [
              {
                id: "d-g2-06-1",
                type: "conjugation",
                prompt: "Để nói 'Tôi phải uống thuốc' (약을 먹다), cách chia nào đúng?",
                options: ["약을 먹어야 해요.", "약을 먹아야 해요.", "약을 먹야 해요.", "약을 먹어야 있어요."],
                correctAnswer: "약을 먹어야 해요.",
                explanationVi: "먹다 có nguyên âm ㅓ nên kết hợp với 어야 해요 → 먹어야 해요.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-2",
            chapterId: "g2-ch1",
            chapterTitleVi: "Chương 1: Liên kết câu & Mong muốn",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 5. NGỮ PHÁP TOPIK 3 - 6 (TRUNG - CAO CẤP)
  // =========================================================================
  {
    id: "grammar-topik-3",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 3",
    koreanTitle: "토픽 3급 핵심 문법",
    levelBadge: "Cấp độ 3",
    topikLevel: "topik-3",
    completedCount: 3,
    totalCount: 50,
    iconType: "grammar-search",
    accentColor: "primary",
    chapters: [
      {
        id: "g3-ch1",
        titleVi: "Chương 1: Biểu hiện Trung cấp & Tường thuật",
        koreanSubtitle: "중급 핵심 표현과 간접화법",
        descriptionVi: "Các cấu trúc biến đổi trạng thái, trích dẫn gián tiếp và suy đoán trung cấp.",
        items: [
          {
            id: "g3-01",
            koreanPattern: "Động từ + 게 되다",
            titleVi: "Trở nên, được/bị (chuyển biến khách quan)",
            formula: "Gốc Động từ + 게 되다 (게 되었어요 / 게 됐어요)",
            explanationVi:
              "Diễn tả một sự thay đổi trạng thái hoặc hoàn cảnh xảy ra do yếu tố khách quan bên ngoài tác động, không hoàn toàn do chủ ý ban đầu của người nói.",
            attachmentRules: [
              { condition: "Gắn trực tiếp vào gốc động từ", example: "가다 → 가게 되다, 일하다 → 일하게 되다, 알다 → 알게 되다" },
            ],
            examples: [
              { korean: "다음 달부터 한국 회사에서 일하게 됐어요.", romaja: "Daeum dalbuteo Hanguk hoesaeseo ilhage dwaesseoyo.", meaningVi: "Từ tháng sau tôi được vào làm việc tại công ty Hàn Quốc." },
              { korean: "한국 드라마를 보고 한국어를 좋아하게 되었어요.", romaja: "Hanguk deuramareul bogo hangugeoreul joahage doeeosseoyo.", meaningVi: "Xem phim Hàn rồi tôi đâm ra yêu thích tiếng Hàn." },
            ],
            practiceDrills: [
              {
                id: "d-g3-01-1",
                type: "fill-blank",
                prompt: "Điền vào chỗ trống: 우연히 그 사실을 알다 → 우연히 그 사실을 _____.",
                options: ["알게 되었어요", "알아졌어요", "알고 싶었어요", "알았어요"],
                correctAnswer: "알게 되었어요",
                explanationVi: "Tình cờ biết được một sự thật dùng 알다 + 게 되다 → 알게 되었어요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-3",
            chapterId: "g3-ch1",
            chapterTitleVi: "Chương 1: Biểu hiện Trung cấp",
          },
          {
            id: "g3-02",
            koreanPattern: "Động từ + 는 중이다",
            titleVi: "Đang trong quá trình (làm gì)",
            formula: "Gốc Động từ + 는 중이다 (Danh từ + 중이다)",
            explanationVi:
              "Nhấn mạnh một hành động đang diễn ra ngay tại thời điểm nói ('đang làm gì đó').",
            attachmentRules: [
              { condition: "Sau động từ (bỏ ㄹ nếu có patchim ㄹ)", example: "가다 → 가는 중이에요, 만들다 → 만드는 중이에요" },
              { condition: "Sau danh từ hành động", example: "회의 중 (Đang họp), 수업 중 (Đang trong giờ học)" },
            ],
            examples: [
              { korean: "지금 집으로 가는 중이에요.", romaja: "Jigeum jibeuro ganeun jungieyo.", meaningVi: "Bây giờ tôi đang trên đường về nhà." },
            ],
            practiceDrills: [
              {
                id: "d-g3-02-1",
                type: "conjugation",
                prompt: "Chia động từ '만들다' (Làm) với cấu trúc '는 중이다':",
                options: ["만드는 중이에요", "만들는 중이에요", "만든 중이에요", "만들 중이에요"],
                correctAnswer: "만드는 중이에요",
                explanationVi: "만들다 có patchim ㄹ, khi gặp 는 thì lược bỏ ㄹ → 만드는 중이에요.",
              },
            ],
            isLearned: true,
            topikLevel: "topik-3",
            chapterId: "g3-ch1",
            chapterTitleVi: "Chương 1: Biểu hiện Trung cấp",
          },
          {
            id: "g3-03",
            koreanPattern: "Động từ/tính từ + (으)ㄴ/는 줄 알았다",
            titleVi: "Cứ tưởng là...",
            formula: "Gốc V/A + (으)ㄴ/는/(으)ㄹ 줄 알았다 (hoặc 몰랐다)",
            explanationVi:
              "Diễn tả người nói đã nghĩ hoặc tưởng nhầm một điều gì đó khác với thực tế.",
            attachmentRules: [
              { condition: "Tính từ hiện tại / Động từ quá khứ", example: "(으)ㄴ 줄 알았어요 (예쁜 줄 알았어요, 간 줄 알았어요)" },
              { condition: "Động từ hiện tại", example: "는 줄 알았어요 (지금 자는 줄 알았어요)" },
            ],
            examples: [
              { korean: "민수 씨가 벌써 집에 간 줄 알았어요.", romaja: "Minsu ssiga beolsseo jibe gan jul arasseoyo.", meaningVi: "Tôi cứ tưởng là Minsoo đã về nhà rồi cơ." },
            ],
            practiceDrills: [
              {
                id: "d-g3-03-1",
                type: "fill-blank",
                prompt: "Hoàn thành câu: 'Tôi cứ tưởng hôm nay là Chủ Nhật': 오늘이 일요일___ 줄 알았어요.",
                options: ["인", "는", "한", "할"],
                correctAnswer: "인",
                explanationVi: "Sau danh từ + 이다 dùng 인 줄 알았어요.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-3",
            chapterId: "g3-ch1",
            chapterTitleVi: "Chương 1: Biểu hiện Trung cấp",
          },
        ],
      },
    ],
  },
  {
    id: "grammar-topik-4",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 4",
    koreanTitle: "토픽 4급 핵심 문법",
    levelBadge: "Cấp độ 4",
    topikLevel: "topik-4",
    completedCount: 0,
    totalCount: 48,
    iconType: "grammar-search",
    accentColor: "primary",
    chapters: [
      {
        id: "g4-ch1",
        titleVi: "Chương 1: Cấu trúc Nghị luận & So sánh Trung cấp 2",
        koreanSubtitle: "중급 심화 문법",
        descriptionVi: "Các cấu trúc viết câu nghị luận số 53, 54 trong kỳ thi TOPIK II.",
        items: [
          {
            id: "g4-01",
            koreanPattern: "Động từ/tính từ + (으)ㄹ 뿐만 아니라",
            titleVi: "Không những ... mà còn ...",
            formula: "Gốc V/A + (으)ㄹ 뿐만 아니라 (Danh từ + 일 뿐만 아니라)",
            explanationVi:
              "Bổ sung thêm thông tin tương đồng ở vế sau cho nội dung đã nêu ở vế trước ('không những... mà còn...').",
            attachmentRules: [
              { condition: "Có patchim", example: "좋다 → 좋을 뿐만 아니라, 먹다 → 먹을 뿐만 아니라" },
              { condition: "Không patchim / Patchim ㄹ", example: "크다 → 클 뿐만 아니라, 만들다 → 만들 뿐만 아니라" },
            ],
            examples: [
              { korean: "그 영화는 재미있을 뿐만 아니라 감동적이에요.", romaja: "Geu yeonghwaneun jaemiisseul ppunman anira gamdongjeogieyo.", meaningVi: "Bộ phim đó không những thú vị mà còn rất cảm động." },
            ],
            practiceDrills: [
              {
                id: "d-g4-01-1",
                type: "conjugation",
                prompt: "Chia tính từ '친절하다' (Thân thiện) với cấu trúc '(으)ㄹ 뿐만 아니라':",
                options: ["친절할 뿐만 아니라", "친절을 뿐만 아니라", "친절한 뿐만 아니라", "친절할 뿐이다"],
                correctAnswer: "친절할 뿐만 아니라",
                explanationVi: "친절하다 không có patchim nên gắn ㄹ 뿐만 아니라 → 친절할 뿐만 아니라.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-4",
            chapterId: "g4-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc Nghị luận TOPIK 4",
          },
          {
            id: "g4-02",
            koreanPattern: "Động từ + 는 바람에",
            titleVi: "Tại vì / Do (nguyên nhân ngoài ý muốn)",
            formula: "Gốc Động từ + 는 바람에",
            explanationVi:
              "Diễn tả một nguyên nhân bất ngờ xảy ra ngoài dự tính dẫn đến một kết quả không mong muốn ở vế sau.",
            attachmentRules: [
              { condition: "Chỉ kết hợp với Động từ", example: "비가 오다 → 비가 오는 바람에, 늦잠을 자다 → 늦잠을 자는 바람에" },
            ],
            examples: [
              { korean: "갑자기 비가 오는 바람에 소풍을 못 갔어요.", romaja: "Gapjagi biga oneun barame sopungeul mot gasseoyo.", meaningVi: "Do trời đột nhiên mưa nên chúng tôi đã không thể đi dã ngoại." },
            ],
            practiceDrills: [
              {
                id: "d-g4-02-1",
                type: "fill-blank",
                prompt: "Điền vào chỗ trống: 버스를 놓치다 → 버스를 _____ 지각했어요.",
                options: ["놓치는 바람에", "놓친 덕분에", "놓치기 위해", "놓치려고"],
                correctAnswer: "놓치는 바람에",
                explanationVi: "Kết quả tiêu cực ngoài ý muốn (지각했어요 - đi muộn) dùng 는 바람에.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-4",
            chapterId: "g4-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc Nghị luận TOPIK 4",
          },
        ],
      },
    ],
  },
  {
    id: "grammar-topik-5",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 5",
    koreanTitle: "토픽 5급 핵심 문법",
    levelBadge: "Cấp độ 5",
    topikLevel: "topik-5",
    completedCount: 0,
    totalCount: 46,
    iconType: "grammar-search",
    accentColor: "primary",
    chapters: [
      {
        id: "g5-ch1",
        titleVi: "Chương 1: Cấu trúc Học thuật & Văn viết Cao cấp",
        koreanSubtitle: "고급 문어체 문법",
        descriptionVi: "Các cấu trúc học thuật dùng trong bài luận TOPIK 54 và báo chí.",
        items: [
          {
            id: "g5-01",
            koreanPattern: "Động từ/tính từ + 는 한이 있더라도",
            titleVi: "Dù có phải ... đi chăng nữa",
            formula: "Gốc Động từ + 는 한이 있더라도",
            explanationVi:
              "Thể hiện quyết tâm mạnh mẽ của người nói: cho dù tình huống xấu ở vế trước có xảy ra đi nữa thì vẫn quyết thực hiện vế sau.",
            attachmentRules: [
              { condition: "Gốc động từ + 는 한이 있더라도", example: "실패하다 → 실패하는 한이 있더라도 (Dù có thất bại đi chăng nữa)" },
            ],
            examples: [
              { korean: "밤을 새우는 한이 있더라도 오늘 안에 끝내겠습니다.", romaja: "Bameul saeuneun hani itdeorado oneul ane kkeutnaegetseumnida.", meaningVi: "Dù có phải thức trắng đêm đi nữa tôi cũng sẽ hoàn thành trong hôm nay." },
            ],
            practiceDrills: [
              {
                id: "d-g5-01-1",
                type: "fill-blank",
                prompt: "Hoàn thành câu: 손해를 보다 (Chịu thiệt) → 손해를 _____ 약속을 지켜야 한다.",
                options: ["보는 한이 있더라도", "보는 바람에", "보느라고", "본 김에"],
                correctAnswer: "보는 한이 있더라도",
                explanationVi: "Quyết tâm giữ lời hứa dù có chịu thiệt dùng 보는 한이 있더라도.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-5",
            chapterId: "g5-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc Cao cấp TOPIK 5",
          },
        ],
      },
    ],
  },
  {
    id: "grammar-topik-6",
    type: "grammar",
    titleVi: "Ngữ pháp cấp độ TOPIK 6",
    koreanTitle: "토픽 6급 핵심 문법",
    levelBadge: "Cấp độ 6",
    topikLevel: "topik-6",
    completedCount: 0,
    totalCount: 60,
    iconType: "grammar-search",
    accentColor: "primary",
    chapters: [
      {
        id: "g6-ch1",
        titleVi: "Chương 1: Cấu trúc Cổ điển & Văn phong Học thuật Đỉnh cao",
        koreanSubtitle: "최고급 학술 표현",
        descriptionVi: "Các cấu trúc ngữ pháp cấp độ cao nhất trong khung năng lực tiếng Hàn TOPIK 6.",
        items: [
          {
            id: "g6-01",
            koreanPattern: "Động từ/tính từ + (으)ㄹ 따름이다",
            titleVi: "Chỉ biết / Chỉ đành ... mà thôi",
            formula: "Gốc V/A + (으)ㄹ 따름이다",
            explanationVi:
              "Nhấn mạnh ngoài hành động hay trạng thái đó ra thì không còn cách nào khác, thường dùng trong văn phong trang trọng.",
            attachmentRules: [
              { condition: "Có patchim + 을 따름이다", example: "믿다 → 믿을 따름이다" },
              { condition: "Không patchim + ㄹ 따름이다", example: "기다리다 → 기다릴 따름이다, 감사하다 → 감사할 따름이다" },
            ],
            examples: [
              { korean: "그저 도와주신 모든 분께 감사할 따름입니다.", romaja: "Geujeo dowajusin modeun bunkke gamsahal ttareumimnida.", meaningVi: "Tôi chỉ biết bày tỏ lòng biết ơn tới tất cả những người đã giúp đỡ mà thôi." },
            ],
            practiceDrills: [
              {
                id: "d-g6-01-1",
                type: "conjugation",
                prompt: "Chia động từ '바라다' (Mong mỏi) với cấu trúc '(으)ㄹ 따름이다':",
                options: ["바랄 따름이다", "바라을 따름이다", "바란 따름이다", "바라는 따름이다"],
                correctAnswer: "바랄 따름이다",
                explanationVi: "바라다 không có patchim nên gắn ㄹ 따름이다 → 바랄 따름이다.",
              },
            ],
            isLearned: false,
            topikLevel: "topik-6",
            chapterId: "g6-ch1",
            chapterTitleVi: "Chương 1: Cấu trúc Đỉnh cao TOPIK 6",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 6. TỪ VỰNG THEO CHỦ ĐỀ THỰC CHIẾN
  // =========================================================================
  {
    id: "topic-daily-korea",
    type: "topic",
    titleVi: "Từ vựng theo chủ đề thực chiến",
    koreanTitle: "실전 주제별 한국어 어휘",
    levelBadge: "Chủ đề",
    topikLevel: "topik-1",
    completedCount: 12,
    totalCount: 16,
    iconType: "topic-card",
    accentColor: "primary",
    chapters: [
      {
        id: "tp-1",
        titleVi: "Chủ đề 1: Giao tiếp tại Sân bay & Xuất nhập cảnh",
        koreanSubtitle: "공항과 출입국 심사",
        descriptionVi: "Từ vựng làm thủ tục check-in, gửi hành lý, hải quan khi bay sang Hàn Quốc.",
        targetWordCount: 25,
        items: makeVocabList("tp-1", "Chủ đề 1: Sân bay & Xuất nhập cảnh", "topik-1", [
          ["비행기표", "Bihaenggipyo", "Vé máy bay", "Danh từ", "비행기표를 예매했어요.", "Tôi đã đặt vé máy bay.", true],
          ["탑승권", "Tapseunggwon", "Thẻ lên máy bay (Boarding pass)", "Danh từ", "탑승권을 보여 주세요.", "Xin vui lòng xuất trình thẻ lên máy bay.", true],
          ["수하물", "Suhamul", "Hành lý ký gửi", "Danh từ", "수하물을 찾았어요.", "Tôi đã lấy hành lý ký gửi.", true],
          ["입국 신고서", "Ipguk singoseo", "Tờ khai nhập cảnh", "Danh từ", "입국 신고서를 작성했어요.", "Tôi đã điền tờ khai nhập cảnh.", true],
        ]),
      },
      {
        id: "tp-2",
        titleVi: "Chủ đề 2: Phỏng vấn & Làm việc tại Công ty Hàn Quốc",
        koreanSubtitle: "면접과 직장 생활",
        descriptionVi: "Các thuật ngữ phòng ban, chức vụ và văn hóa công sở tại doanh nghiệp Hàn Quốc.",
        targetWordCount: 30,
        items: makeVocabList("tp-2", "Chủ đề 2: Công sở Hàn Quốc", "topik-2", [
          ["이력서", "Iryeokseo", "Sơ yếu lý lịch (CV)", "Danh từ", "이력서를 제출했습니다.", "Tôi đã nộp CV.", true],
          ["면접", "Myeonjeop", "Phỏng vấn", "Danh từ", "내일 회사 면접이 있어요.", "Ngày mai tôi có buổi phỏng vấn công ty.", true],
          ["보고서", "Bogoseo", "Bản báo cáo", "Danh từ", "부장님께 보고서를 드렸어요.", "Tôi đã gửi báo cáo cho trưởng phòng.", true],
          ["회식", "Hoesik", "Liên hoan công ty", "Danh từ", "금요일 저녁에 회식이 있어요.", "Tối thứ Sáu có buổi liên hoan công ty.", true],
        ]),
      },
      {
        id: "tp-3",
        titleVi: "Chủ đề 3: K-Pop, Phim ảnh & Mạng xã hội Hàn Quốc",
        koreanSubtitle: "케이팝과 드라마 유행어",
        descriptionVi: "Từ vựng trẻ trung thường xuất hiện trong show thực tế, K-Drama và idol Hàn Quốc.",
        targetWordCount: 28,
        items: makeVocabList("tp-3", "Chủ đề 3: K-Pop & Phim ảnh", "topik-1", [
          ["대박", "Daebak", "Tuyệt đỉnh / Đỉnh quá", "Thán từ", "와, 정말 대박이에요!", "Ồ, thật sự đỉnh quá!", true],
          ["응원하다", "Eungwonhada", "Cổ vũ, ủng hộ", "Động từ", "항상 응원할게요!", "Tôi sẽ luôn cổ vũ cho bạn!", true],
          ["본방사수", "Bonbangsasu", "Xem trực tiếp tập phát sóng đầu", "Danh từ", "오늘 밤 드라마 본방사수!", "Tối nay nhất định canh xem phim phát sóng!", false],
        ]),
      },
      {
        id: "tp-4",
        titleVi: "Chủ đề 4: Thuê nhà & Sinh hoạt Du học sinh",
        koreanSubtitle: "유학생 자취와 부동산",
        descriptionVi: "Từ vựng tìm phòng trọ 원룸, tiền đặt cọc 보증금, tiền thuê tháng 월세.",
        targetWordCount: 24,
        items: makeVocabList("tp-4", "Chủ đề 4: Thuê nhà & Du học", "topik-2", [
          ["원룸", "Wonnum", "Phòng khép kín (One-room)", "Danh từ", "학교 근처 원룸을 구했어요.", "Tôi đã thuê được phòng 원룸 gần trường.", true],
          ["보증금", "Bojeunggeum", "Tiền đặt cọc", "Danh từ", "보증금이 얼마예요?", "Tiền đặt cọc là bao nhiêu vậy?", false],
          ["월세", "Wolse", "Tiền thuê nhà hàng tháng", "Danh từ", "매달 월세를 내요.", "Mỗi tháng tôi đóng tiền thuê nhà.", false],
        ]),
      },
    ],
  },
];

export const INITIAL_THEORY_COLLECTIONS: TheoryCollectionCard[] =
  RAW_THEORY_COLLECTIONS.map(syncCollectionStats);
