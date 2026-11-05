import { CountryOption, ProvinceOption } from "./types";
import { MascotMood } from "./mascot-svg";

export const COUNTRIES_LIST: CountryOption[] = [
  { code: "VN", nameVi: "Việt Nam", nameEn: "Vietnam", flagEmoji: "🇻🇳", dialCode: "+84" },
  { code: "KR", nameVi: "Hàn Quốc", nameEn: "South Korea", flagEmoji: "🇰🇷", dialCode: "+82" },
  { code: "JP", nameVi: "Nhật Bản", nameEn: "Japan", flagEmoji: "🇯🇵", dialCode: "+81" },
  { code: "US", nameVi: "Hoa Kỳ", nameEn: "United States", flagEmoji: "🇺🇸", dialCode: "+1" },
  { code: "AU", nameVi: "Úc", nameEn: "Australia", flagEmoji: "🇦🇺", dialCode: "+61" },
  { code: "CA", nameVi: "Canada", nameEn: "Canada", flagEmoji: "🇨🇦", dialCode: "+1" },
  { code: "TW", nameVi: "Đài Loan", nameEn: "Taiwan", flagEmoji: "🇹🇼", dialCode: "+886" },
  { code: "SG", nameVi: "Singapore", nameEn: "Singapore", flagEmoji: "🇸🇬", dialCode: "+65" },
  { code: "DE", nameVi: "Đức", nameEn: "Germany", flagEmoji: "🇩🇪", dialCode: "+49" },
  { code: "GB", nameVi: "Vương quốc Anh", nameEn: "United Kingdom", flagEmoji: "🇬🇧", dialCode: "+44" },
  { code: "FR", nameVi: "Pháp", nameEn: "France", flagEmoji: "🇫🇷", dialCode: "+33" },
  { code: "TH", nameVi: "Thái Lan", nameEn: "Thailand", flagEmoji: "🇹🇭", dialCode: "+66" },
];

export const VN_PROVINCES_LIST: ProvinceOption[] = [
  { code: "HN", nameVi: "Hà Nội", nameEn: "Ha Noi", region: "north" },
  { code: "SG", nameVi: "TP. Hồ Chí Minh", nameEn: "Ho Chi Minh City", region: "south" },
  { code: "DN", nameVi: "Đà Nẵng", nameEn: "Da Nang", region: "central" },
  { code: "HP", nameVi: "Hải Phòng", nameEn: "Hai Phong", region: "north" },
  { code: "CT", nameVi: "Cần Thơ", nameEn: "Can Tho", region: "south" },
  { code: "BD", nameVi: "Bình Dương", nameEn: "Binh Duong", region: "south" },
  { code: "DNA", nameVi: "Đồng Nai", nameEn: "Dong Nai", region: "south" },
  { code: "BN", nameVi: "Bắc Ninh", nameEn: "Bac Ninh", region: "north" },
  { code: "HD", nameVi: "Hải Dương", nameEn: "Hai Duong", region: "north" },
  { code: "NA", nameVi: "Nghệ An", nameEn: "Nghe An", region: "central" },
  { code: "TH", nameVi: "Thanh Hóa", nameEn: "Thanh Hoa", region: "central" },
  { code: "KH", nameVi: "Khánh Hòa", nameEn: "Khanh Hoa", region: "central" },
  { code: "LD", nameVi: "Lâm Đồng", nameEn: "Lam Dong", region: "central" },
  { code: "VT", nameVi: "Bà Rịa - Vũng Tàu", nameEn: "Ba Ria - Vung Tau", region: "south" },
  { code: "TN", nameVi: "Thái Nguyên", nameEn: "Thai Nguyen", region: "north" },
  { code: "QN", nameVi: "Quảng Ninh", nameEn: "Quang Ninh", region: "north" },
  { code: "BGI", nameVi: "Bắc Giang", nameEn: "Bac Giang", region: "north" },
  { code: "VP", nameVi: "Vĩnh Phúc", nameEn: "Vinh Phuc", region: "north" },
  { code: "TB", nameVi: "Thái Bình", nameEn: "Thai Binh", region: "north" },
  { code: "ND", nameVi: "Nam Định", nameEn: "Nam Dinh", region: "north" },
  { code: "NB", nameVi: "Ninh Bình", nameEn: "Ninh Binh", region: "north" },
  { code: "HT", nameVi: "Hà Tĩnh", nameEn: "Ha Tinh", region: "central" },
  { code: "QB", nameVi: "Quảng Bình", nameEn: "Quang Binh", region: "central" },
  { code: "QT", nameVi: "Quảng Trị", nameEn: "Quang Tri", region: "central" },
  { code: "TTH", nameVi: "Thừa Thiên Huế", nameEn: "Thua Thien Hue", region: "central" },
  { code: "QNA", nameVi: "Quảng Nam", nameEn: "Quang Nam", region: "central" },
  { code: "QNG", nameVi: "Quảng Ngãi", nameEn: "Quang Ngai", region: "central" },
  { code: "BDH", nameVi: "Bình Định", nameEn: "Binh Dinh", region: "central" },
  { code: "PY", nameVi: "Phú Yên", nameEn: "Phu Yen", region: "central" },
  { code: "GL", nameVi: "Gia Lai", nameEn: "Gia Lai", region: "central" },
  { code: "DL", nameVi: "Đắk Lắk", nameEn: "Dak Lak", region: "central" },
  { code: "LA", nameVi: "Long An", nameEn: "Long An", region: "south" },
  { code: "TG", nameVi: "Tiền Giang", nameEn: "Tien Giang", region: "south" },
  { code: "AG", nameVi: "An Giang", nameEn: "An Giang", region: "south" },
  { code: "KG", nameVi: "Kiên Giang", nameEn: "Kien Giang", region: "south" },
  { code: "OTHER", nameVi: "Tỉnh / Thành phố khác", nameEn: "Other Province", region: "south" },
];

export const TIMEZONES_LIST = [
  { value: "Asia/Ho_Chi_Minh", labelVi: "Giờ Việt Nam (GMT+7)", labelEn: "Vietnam Time (GMT+7)" },
  { value: "Asia/Seoul", labelVi: "Giờ Hàn Quốc (GMT+9)", labelEn: "Korea Standard Time (GMT+9)" },
  { value: "Asia/Tokyo", labelVi: "Giờ Nhật Bản (GMT+9)", labelEn: "Japan Standard Time (GMT+9)" },
  { value: "Asia/Bangkok", labelVi: "Giờ Thái Lan / Đông Nam Á (GMT+7)", labelEn: "Indochina Time (GMT+7)" },
  { value: "Asia/Taipei", labelVi: "Giờ Đài Loan (GMT+8)", labelEn: "Taiwan Time (GMT+8)" },
  { value: "Australia/Sydney", labelVi: "Giờ Sydney / Úc (GMT+11)", labelEn: "Australian Eastern Time (GMT+11)" },
  { value: "America/New_York", labelVi: "Giờ Đông Hoa Kỳ (GMT-5)", labelEn: "Eastern Time US (GMT-5)" },
  { value: "America/Los_Angeles", labelVi: "Giờ Tây Hoa Kỳ (GMT-8)", labelEn: "Pacific Time US (GMT-8)" },
  { value: "UTC", labelVi: "Giờ Quốc tế chuẩn (UTC)", labelEn: "Coordinated Universal Time (UTC)" },
];

export interface MascotPreset {
  id: string;
  nameVi: string;
  nameEn: string;
  tag: string;
  mood: MascotMood;
  colorBg: string;
  borderBadge: string;
}

export const MASCOT_AVATARS_GALLERY: MascotPreset[] = [
  { id: "honey-default", nameVi: "Hổ Honey Chào bạn", nameEn: "Honey Greeting", tag: "Cơ bản", mood: "wave", colorBg: "from-amber-100 to-amber-200", borderBadge: "border-amber-400" },
  { id: "honey-study", nameVi: "Hổ Honey Chăm chỉ", nameEn: "Honey Scholar", tag: "Học tập", mood: "study", colorBg: "from-emerald-100 to-teal-200", borderBadge: "border-teal-400" },
  { id: "honey-smart", nameVi: "Hổ Honey Thông thái", nameEn: "Honey Smart Master", tag: "TOPIK 6", mood: "thinking", colorBg: "from-blue-100 to-indigo-200", borderBadge: "border-blue-400" },
  { id: "honey-cheer", nameVi: "Hổ Honey Chúc mừng", nameEn: "Honey Celebration", tag: "Hăng hái", mood: "celebrate", colorBg: "from-rose-100 to-orange-200", borderBadge: "border-rose-400" },
  { id: "honey-lost", nameVi: "Hổ Honey Ngơ ngác", nameEn: "Honey Curious", tag: "Tò mò", mood: "lost", colorBg: "from-purple-100 to-violet-200", borderBadge: "border-purple-400" },
];

export const LEARNING_GOAL_OPTIONS = [
  { id: "study_abroad", labelVi: "Du học Hàn Quốc (D2, D4)", labelEn: "Study abroad in Korea" },
  { id: "labor_export", labelVi: "Xuất khẩu lao động (EPS-TOPIK, E7)", labelEn: "Labor export / Work permit" },
  { id: "work_in_korea", labelVi: "Làm việc tại doanh nghiệp Hàn", labelEn: "Work in Korean corporations" },
  { id: "topik_exam", labelVi: "Luyện thi chứng chỉ TOPIK 1 - 6", labelEn: "Pass TOPIK I - II certifications" },
  { id: "kpop_culture", labelVi: "K-pop, K-drama & Văn hóa Hàn", labelEn: "K-pop, K-drama & Culture" },
  { id: "travel_communication", labelVi: "Du lịch & Giao tiếp thường ngày", labelEn: "Travel & Daily survival" },
  { id: "hobby_interest", labelVi: "Sở thích cá nhân & Rèn luyện trí não", labelEn: "Personal hobby & Brain training" },
];

export const STUDY_TIME_OPTIONS = [
  { id: "morning", labelVi: "Buổi sáng (06:00 - 09:00)", labelEn: "Morning (06:00 - 09:00)" },
  { id: "afternoon", labelVi: "Buổi chiều (13:00 - 17:00)", labelEn: "Afternoon (13:00 - 17:00)" },
  { id: "evening", labelVi: "Buổi tối (19:00 - 22:00)", labelEn: "Evening (19:00 - 22:00)" },
  { id: "night", labelVi: "Đêm muộn (sau 22:00)", labelEn: "Late Night (after 22:00)" },
];

export const HOW_DID_YOU_HEAR_OPTIONS = [
  { id: "facebook", labelVi: "Facebook / Fanpage Tiếng Hàn", labelEn: "Facebook / Korean Learning Page" },
  { id: "tiktok", labelVi: "TikTok video kiến thức", labelEn: "TikTok educational shorts" },
  { id: "google", labelVi: "Tìm kiếm Google", labelEn: "Google Search" },
  { id: "friend", labelVi: "Bạn bè hoặc Thầy cô giới thiệu", labelEn: "Friend or Teacher Referral" },
  { id: "youtube", labelVi: "Kênh Youtube học tiếng Hàn", labelEn: "YouTube channel" },
  { id: "other", labelVi: "Nguồn khác", labelEn: "Other source" },
];
