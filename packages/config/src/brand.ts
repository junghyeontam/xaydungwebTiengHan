/**
 * brand.ts - Central brand configuration for "JungHyeon Korean" (Tiếng Hàn JungHyeon)
 * Updating information here updates the brand properties across the entire application.
 */

export type PalettePreset = "ocean" | "forest";

export const BRAND_CONFIG = {
  name: "Tiếng Hàn JungHyeon",
  shortName: "JungHyeon",
  koreanName: "정현",
  sloganVi: "Học chắc, nói tự tin.",
  sloganEn: "Solid Learning, Confident Speaking.",
  descriptionVi:
    "Nền tảng học tiếng Hàn toàn diện từ số 0 đến TOPIK 6 dành riêng cho người Việt. Học theo lộ trình khoa học, ghi nhớ đỉnh cao với Flashcard SRS và game hoá thú vị.",
  descriptionEn:
    "Comprehensive Korean learning platform from beginner to TOPIK 6 tailored for Vietnamese learners. Smart spaced repetition (SRS) and gamified learning.",

  /**
   * Active palette preset:
   * - "ocean" (default): Clean pure white #FFFFFF + deep navy headings #1B2A6B + primary blue #2347B5 + gold #F5B93A
   * - "forest": Heritage JungHyeon deep pine green #12302F + emerald teal #3DBBA8 + gentle cream #FAF7F2
   */
  palettePreset: "ocean" as PalettePreset,

  // Mascot symbol
  mascot: {
    name: "Honey",
    title: "JungHyeon Baby Tiger",
    description: "A cute study companion helping you conquer Korean daily!",
    koreanTitle: "아기 호랑이 허니",
  },

  // Contact and support details
  contact: {
    hotline: "0988.123.456",
    hotlineDisplay: "0988 123 456",
    email: "contact@junghyeon.edu.vn",
    supportEmail: "support@junghyeon.edu.vn",
    zaloUrl: "https://zalo.me/0988123456",
    messengerUrl: "https://m.me/tienganhjunghyeon",
    facebookUrl: "https://facebook.com/tienganhjunghyeon",
    youtubeUrl: "https://youtube.com/@tienganhjunghyeon",
    tiktokUrl: "https://tiktok.com/@tienganhjunghyeon",
    address: "Tầng 5, Tòa nhà Công Nghệ, Quận Cầu Giấy, Hà Nội",
    workingHours: "08:00 - 21:30 (Thứ 2 - Chủ Nhật)",
  },

  // Palettes
  palettes: {
    ocean: {
      name: "Ocean (Clean Modern White & Navy)",
      bg: "#FFFFFF",
      surface: "#F7F9FC",
      tintPanel: "#E3F0FF",
      tintGrowth: "#E8F6F1",
      tintPanelHover: "#D8EAFF",
      heading: "#1B2A6B",
      body: "#2B3445",
      secondary: "#5B6577",
      muted: "#8A93A5",
      border: "#E6EAF1",
      borderStrong: "#D3DAE6",
      primary: "#1E44A8",
      primaryBright: "#325FD8",
      frame: "#D5E5FA",
      gold: "#F5B93A",
      coral: "#E8604C",
    },
    forest: {
      name: "Forest (Heritage JungHyeon Pine & Teal)",
      bg: "#FAF7F2",
      surface: "#F3EFE6",
      tintPanel: "#E6F5F2",
      tintGrowth: "#E2F2ED",
      tintPanelHover: "#D5EDE9",
      heading: "#12302F",
      body: "#203837",
      secondary: "#4D6664",
      muted: "#7E9694",
      border: "#DCE8E6",
      borderStrong: "#C5D9D6",
      primary: "#3DBBA8",
      primaryBright: "#45D1BD",
      frame: "#BEE3DC",
      gold: "#F5B93A",
      coral: "#E8604C",
    },
  },

  // Highlighted performance statistics
  stats: {
    grammarLessons: 120,
    vocabularyCount: "4,500+",
    hangulLetters: 40,
    topikLevels: "1 - 6",
    activeLearners: "25,000+",
    passRateTopik: "94.8%",
  },

  // Footer copyright
  copyright: "© JungHyeon Korean. All rights reserved.",
  organization: "JungHyeon Education & Technology JSC",
};
