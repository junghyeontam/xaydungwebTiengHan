"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Badge } from "@/components/shared/Badge";
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

export default function TermsOfServicePage() {
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
            <FileText className="w-3.5 h-3.5 mr-1" />
            <span>{isEn ? "Terms of Use" : "Điều khoản & Điều kiện Sử dụng"}</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            {isEn ? "Terms of Service" : "Điều khoản Sử dụng Dịch vụ"}
          </h1>
          <p className="text-xs text-brand-muted">
            {isEn ? "Last updated: November 01, 2026 • Effective version: v2.1" : "Cập nhật lần cuối: Ngày 01/11/2026 • Phiên bản hiệu lực: v2.1"}
          </p>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl bg-white dark:bg-brand-surface border border-brand-border p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-brand-body">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy">
              1. {isEn ? "Acceptance of Terms" : "Chấp thuận điều khoản sử dụng"}
            </h2>
            <p>
              {isEn
                ? "By accessing or using the Tiếng Hàn JungHyeon website, mobile applications, or digital learning materials, you agree to comply with and be bound by these Terms of Service. If you do not agree, please discontinue using the service."
                : "Khi truy cập và sử dụng nền tảng Tiếng Hàn JungHyeon (bao gồm website, ứng dụng học tập và toàn bộ tài liệu giảng dạy số), học viên mặc nhiên đồng ý tuân thủ các quy định được nêu trong Điều khoản này. Trường hợp không đồng ý, vui lòng ngừng sử dụng dịch vụ."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy">
              2. {isEn ? "Account Responsibilities & Usage" : "Quy định tài khoản học viên"}
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-secondary">
              <li>{isEn ? "Each VIP membership account is personal and strictly non-transferable." : "Mỗi tài khoản học viên VIP chỉ cấp quyền sử dụng cho một cá nhân duy nhất và không được phép chuyển nhượng, chia sẻ tài khoản cho bên thứ ba."}</li>
              <li>{isEn ? "Simultaneous active sessions are monitored to prevent automated credential sharing or scraping." : "Hệ thống tự động phát hiện và cảnh báo các hành vi đăng nhập bất thường cùng lúc từ nhiều địa chỉ IP khác nhau nhằm bảo vệ tính toàn vẹn của khóa học."}</li>
              <li>{isEn ? "Learners must maintain truthful registration details to ensure valid certificate issuance." : "Học viên chịu trách nhiệm cung cấp họ tên và số điện thoại chính xác để đảm bảo quyền lợi cấp chứng nhận tốt nghiệp khóa học."}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy">
              3. {isEn ? "Intellectual Property Rights" : "Bản quyền nội dung & Sở hữu trí tuệ"}
            </h2>
            <p>
              {isEn
                ? "All curriculum content, audio voice recordings, grammar explanations, interactive exercise databases, and the Mascot Honey persona are exclusive intellectual property of Tiếng Hàn JungHyeon. Reproduction, distribution, or commercial re-sale without prior written consent is strictly prohibited."
                : "Toàn bộ bài giảng ngữ pháp, âm thanh phát âm bản xứ, cơ sở dữ liệu bài tập trắc nghiệm và hình ảnh chú hổ Honey thuộc quyền sở hữu trí tuệ độc quyền của Tiếng Hàn JungHyeon. Mọi hành vi sao chép, trích xuất dữ liệu tự động (scraping) hoặc phân phối lại vì mục đích thương mại mà không có sự đồng ý bằng văn bản đều cấu thành vi phạm pháp luật."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy">
              4. {isEn ? "Lifetime Access Guarantee" : "Cam kết quyền lợi Gói VIP Trọn đời"}
            </h2>
            <p>
              {isEn
                ? "The 'Lifetime VIP' membership guarantees perpetual access to all current 120+ TOPIK lessons, AI speech practice, and all future curriculum updates with zero hidden recurring fees."
                : "Gói 'Hội viên VIP Trọn đời' cam kết quyền truy cập vĩnh viễn vào toàn bộ 120+ bài giảng TOPIK, phòng luyện phát âm AI, và toàn bộ các bài học mới được bổ sung trong tương lai mà không phát sinh thêm bất kỳ chi phí định kỳ nào."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
