import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Bạn là "Trợ lý Honey" - chú hổ con hoạt bát, thông minh và vô cùng đáng yêu của nền tảng học tiếng Hàn JungHyeon (정현).
Slogan của JungHyeon: "Học chắc, nói tự tin."
Nhiệm vụ của bạn:
1. Giải đáp thắc mắc về các khoá học tiếng Hàn từ số 0 đến TOPIK 6.
2. Giải thích ngữ pháp tiếng Hàn, phân biệt các mẫu câu dễ nhầm lẫn (như 은/는 vs 이/가, -아요/어요).
3. Cung cấp thông tin học phí, gói Premium (199k/tháng hoặc trọn đời 1.490k), chính sách học thử 7 ngày miễn phí.
4. Giữ giọng điệu ấm áp, thân thiện, xưng là "Honey", gọi học viên là "bạn" hoặc "bạn học".
5. Nếu học viên cần hỗ trợ chuyên sâu hoặc đăng ký học 1 kèm 1, hướng dẫn học viên bấm nút "Gặp tư vấn viên thật" hoặc để lại số điện thoại.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Tin nhắn không hợp lệ" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // 1. Nếu có API Key của Anthropic Claude, gọi trực tiếp an toàn qua Server
    if (apiKey && apiKey !== "your-anthropic-api-key-here") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...(history || []).map((h: any) => ({
              role: h.role === "user" ? "user" : "assistant",
              content: h.content,
            })),
            { role: "user", content: message },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText =
          data.content?.[0]?.text || "Honey luôn sẵn sàng hỗ trợ bạn!";
        return NextResponse.json({ reply: replyText });
      }
    }

    // 2. Chế độ Trợ lý AI tích hợp sẵn (Knowledge Base chuyên môn cao)
    const lower = message.toLowerCase();
    let smartReply = "";

    if (lower.includes("học phí") || lower.includes("bao nhiêu tiền") || lower.includes("giá")) {
      smartReply =
        "Dạ! Tiếng Hàn JungHyeon có các gói học rất tiết kiệm: Gói Cơ bản miễn phí trọn đời (trải nghiệm Hangul và các bài đầu); Gói Premium chỉ 199.000đ/tháng hoặc gói Trọn đời 1.490.000đ (mở khoá trọn vẹn TOPIK 1-6, không giới hạn thẻ SRS và sửa phát âm AI). Bạn có muốn đăng ký học thử 7 ngày miễn phí không ạ?";
    } else if (lower.includes("ngữ pháp") || lower.includes("là gì") || lower.includes("phân biệt")) {
      if (lower.includes("은/는") || lower.includes("이/가")) {
        smartReply =
          "Về phân biệt 은/는 và 이/가: 은/는 dùng để nhấn mạnh CHỦ ĐỀ câu chuyện hoặc so sánh đối chiếu (ví dụ: 저는 학생이에요 - Nói về bản thân tôi). Còn 이/가 nhấn mạnh chính CHỦ NGỮ thực hiện hành động hoặc dùng với 있다/없다 (ví dụ: 비가 와요 - Trời mưa). Trong bài 1 và bài 2 của Lộ trình Sơ cấp có video giảng giải cực kỳ dễ hiểu đó bạn!";
      } else {
        smartReply =
          "Ngữ pháp tiếng Hàn có cấu trúc ngược với tiếng Việt: Chủ ngữ + Tân ngữ + Động từ (SOV). Đuôi câu thân mật phổ biến nhất là -아요/어요. Bạn đang muốn tìm hiểu cấu trúc ngữ pháp cụ thể nào, hãy nhắn để Honey giải thích chi tiết nhé!";
      }
    } else if (lower.includes("topik") || lower.includes("lộ trình") || lower.includes("mất bao lâu")) {
      smartReply =
        "Để đạt TOPIK 2 (Sơ cấp), thông thường bạn mất khoảng 3 - 4 tháng với 20 phút học mỗi ngày. Để lên TOPIK 4 (đủ điều kiện du học chuyên ngành và đi làm cty Hàn), bạn sẽ mất từ 7 - 9 tháng học theo phương pháp Lặp lại ngắt quãng SRS của JungHyeon. Bạn có thể làm bài 'Kiểm tra trình độ' ở mục Tư vấn để có lộ trình chính xác nhất nhé!";
    } else if (lower.includes("chào") || lower.includes("hello") || lower.includes("hi")) {
      smartReply =
        "Annyeonghaseyo! 👋 Honey chào bạn học nhé! Bạn đang muốn tìm hiểu về khoá học nào, cần Honey giải thích ngữ pháp hay cần tư vấn lộ trình riêng hôm nay?";
    } else {
      smartReply =
        "Honey đã ghi nhận câu hỏi của bạn! Với phương pháp học Spaced Repetition (SRS) kết hợp luyện phát âm và phòng thi TOPIK chuẩn Viện Ngôn ngữ Hàn Quốc, JungHyeon cam kết giúp bạn 'Học chắc, nói tự tin'. Bạn có thể nhấn nút 'Gặp tư vấn viên thật' bên dưới nếu cần chuyên viên gọi điện tư vấn 1 kèm 1 nhé!";
    }

    return NextResponse.json({ reply: smartReply });
  } catch (error) {
    console.error("Lỗi AI Honey Server:", error);
    return NextResponse.json(
      {
        reply:
          "Chào bạn! Honey đang hỗ trợ rất nhiều bạn học viên cùng lúc. Bạn có thể để lại số điện thoại hoặc bấm nút 'Gặp tư vấn viên thật' để được hỗ trợ ngay nhé!",
      },
      { status: 200 }
    );
  }
}
