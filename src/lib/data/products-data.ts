export interface ProductItem {
  id: string;
  type: "subscription" | "course" | "book";
  title: string;
  badge?: string;
  description: string;
  originalPrice: number;
  price: number;
  unit: string;
  features: string[];
  isPopular?: boolean;
}

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: "sub-monthly",
    type: "subscription",
    title: "Gói Hội viên Premium (1 Tháng)",
    badge: "Linh hoạt",
    description: "Trải nghiệm trọn vẹn toàn bộ tính năng cao cấp không giới hạn.",
    originalPrice: 299000,
    price: 199000,
    unit: "/tháng",
    features: [
      "Mở khoá toàn bộ bài học từ Hangul đến TOPIK 6",
      "Không giới hạn số lượng thẻ ôn tập SRS",
      "Luyện phát âm giọng chuẩn Seoul cùng AI Speech",
      "Truy cập toàn bộ kho đề thi thử TOPIK có bấm giờ",
      "Trợ lý AI Honey hỗ trợ giải đáp 24/7",
    ],
  },
  {
    id: "sub-lifetime",
    type: "subscription",
    title: "Gói Hội viên VIP Trọn Đời (Khuyên dùng)",
    badge: "Tiết kiệm 75%",
    description: "Đầu tư một lần duy nhất, học trọn đời không phát sinh phụ phí.",
    originalPrice: 3500000,
    price: 1490000,
    unit: "trọn đời",
    isPopular: true,
    features: [
      "Toàn bộ đặc quyền của gói Premium vĩnh viễn",
      "Tặng kèm bộ Flashcard giấy 500 từ gửi tận nhà",
      "Hỗ trợ 1 kèm 1 cùng giảng viên Thạc sĩ qua Zalo",
      "Cam kết đỗ TOPIK (hoàn tiền nếu không đỗ)",
      "Cập nhật miễn phí các đề thi TOPIK mới nhất hàng năm",
    ],
  },
  {
    id: "course-topik1-2",
    type: "course",
    title: "Khoá Video Chuyên sâu Sơ cấp (TOPIK 1 - 2)",
    badge: "Khoá học bán chạy",
    description: "45 bài giảng video chất lượng 4K do Giảng viên ĐHQG giảng dạy.",
    originalPrice: 1200000,
    price: 890000,
    unit: "/khoá",
    features: [
      "45 bài giảng chi tiết từng nét chữ và cấu trúc câu",
      "Tài liệu PDF bài tập và file âm thanh đi kèm",
      "Bài tập trắc nghiệm chấm điểm tự động",
      "Chứng chỉ hoàn thành khoá học JungHyeon",
    ],
  },
  {
    id: "book-combo",
    type: "book",
    title: "Bộ Giáo trình Tiếng Hàn JungHyeon (In màu)",
    badge: "Sách in giấy",
    description: "Sách giáo trình thiết kế độc quyền, in màu cao cấp kèm mã quét Audio.",
    originalPrice: 650000,
    price: 450000,
    unit: "/bộ 2 cuốn",
    features: [
      "Sách Ngữ pháp & Bài tập thực hành Sơ cấp",
      "Sổ tay 1.200 từ vựng bỏ túi có hình minh hoạ",
      "Mã QR quét nghe giọng đọc chuẩn từng trang",
      "Miễn phí vận chuyển toàn quốc (Freeship)",
    ],
  },
];
