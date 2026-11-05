"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Badge } from "@/components/shared/Badge";
import { RotateCcw, ArrowLeft, CheckCircle2, ShieldCheck, Clock, CreditCard } from "lucide-react";

export default function RefundPolicyPage() {
  const { locale } = useI18n();
  const isEn = locale === "en";

  return (
    <div className="min-h-screen bg-brand-bg py-10 sm:py-14 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? "Back to Home" : "Về Trang chủ"}</span>
        </Link>

        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-brand-border">
          <Badge variant="tint">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>{isEn ? "Payment & Refund Policy" : "Chính sách Thanh toán & Hoàn tiền"}</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            {isEn ? "Payment & 7-Day Refund Policy" : "Chính sách Thanh toán & Hoàn tiền 7 ngày"}
          </h1>
          <p className="text-xs text-brand-muted">
            {isEn ? "Committed to learner satisfaction • Two-person approval control" : "Cam kết bảo vệ quyền lợi học viên • Quy trình phê duyệt minh bạch"}
          </p>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl bg-white dark:bg-brand-surface border border-brand-border p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-brand-body">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              <span>1. {isEn ? "100% 7-Day Money-Back Guarantee" : "Cam kết hoàn tiền 100% trong 7 ngày đầu"}</span>
            </h2>
            <p>
              {isEn
                ? "We want every learner to experience the best Korean education. If you find our methodology unsuited to your learning style within 7 days of VIP purchase, we will refund 100% of your tuition with no questions asked."
                : "JungHyeon mong muốn mang lại trải nghiệm học tập tốt nhất cho bạn. Nếu trong vòng 7 ngày kể từ ngày kích hoạt gói VIP, bạn cảm thấy phương pháp giảng dạy không phù hợp với bản thân, chúng tôi cam kết hoàn lại 100% học phí mà không gây bất kỳ phiền hà nào."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-primary" />
              <span>2. {isEn ? "Supported Payment Methods" : "Phương thức thanh toán được hỗ trợ"}</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-secondary">
              <li>{isEn ? "VietQR / PayOS instant bank transfer (auto-activated within 30 seconds)." : "Chuyển khoản ngân hàng 24/7 qua mã VietQR / PayOS (Kích hoạt khóa học tự động trong 30 giây)."}</li>
              <li>{isEn ? "Domestic ATM cards & Napas payment gateway." : "Thẻ ATM nội địa kết nối cổng thanh toán Napas."}</li>
              <li>{isEn ? "MoMo QR wallet payment." : "Ví điện tử MoMo QR."}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>3. {isEn ? "Refund Processing & Timeline" : "Quy trình xử lý hoàn tiền"}</span>
            </h2>
            <p>
              {isEn
                ? "Refund requests are processed via a strict two-person control workflow (Counselor proposes → Administrator confirms). Once approved, funds are transferred back to your original bank account within 2 to 3 business days."
                : "Yêu cầu hoàn tiền được kiểm soát chặt chẽ qua quy trình 2 bước độc lập (Chuyên viên tư vấn đề xuất → Quản trị viên vận hành phê duyệt). Sau khi phê duyệt thành công, tiền sẽ được hoàn trả trực tiếp về tài khoản ngân hàng của học viên trong vòng 2 - 3 ngày làm việc."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-success" />
              <span>4. {isEn ? "How to Submit a Refund Request" : "Cách thức gửi yêu cầu hoàn tiền"}</span>
            </h2>
            <p>
              {isEn
                ? "Please email support@junghyeon.vn with subject '[Refund Request] Your Name - Order ID' or message our 24/7 student hotline 0988 123 456."
                : "Học viên chỉ cần gửi email tới support@junghyeon.vn với tiêu đề '[Yêu cầu hoàn tiền] Họ tên - Mã đơn hàng' hoặc nhắn tin qua Zalo Hỗ trợ 0988 123 456. Chuyên viên sẽ tiếp nhận và phản hồi trong vòng tối đa 2 giờ làm việc."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
