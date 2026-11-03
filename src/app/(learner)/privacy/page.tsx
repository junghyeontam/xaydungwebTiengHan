"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Badge } from "@/components/shared/Badge";
import { ShieldCheck, ArrowLeft, Lock, Eye, Database, Bell } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>{isEn ? "Legal & Data Security" : "Pháp lý & An toàn thông tin"}</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            {isEn ? "Privacy Policy" : "Chính sách Bảo mật Thông tin"}
          </h1>
          <p className="text-xs text-brand-muted">
            {isEn ? "Last updated: November 01, 2026 • Effective version: v2.1" : "Cập nhật lần cuối: Ngày 01/11/2026 • Phiên bản hiệu lực: v2.1"}
          </p>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl bg-white dark:bg-brand-surface border border-brand-border p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-brand-body">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-primary" />
              <span>1. {isEn ? "Purpose of Data Collection" : "Mục đích thu thập thông tin cá nhân"}</span>
            </h2>
            <p>
              {isEn
                ? "Tiếng Hàn JungHyeon collects personal information (full name, email, phone number, learning goals) solely to provide customized Korean learning experiences, sync spaced-repetition progress across devices, issue official course certifications, and provide study counseling support."
                : "Hệ thống Tiếng Hàn JungHyeon thu thập các thông tin cá nhân (Họ tên, Email, Số điện thoại, Mục tiêu học tập) nhằm mục đích cung cấp lộ trình học cá nhân hóa, đồng bộ tiến độ ôn tập ngắt quãng SRS trên các thiết bị, cấp chứng nhận hoàn thành khóa học và liên hệ hỗ trợ giải đáp chuyên môn."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-primary" />
              <span>2. {isEn ? "Scope of Collected Information" : "Phạm vi thông tin thu thập"}</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-secondary">
              <li>{isEn ? "Account identification: Full name, login email, profile avatar." : "Thông tin định danh: Họ và tên, địa chỉ email, ảnh đại diện."}</li>
              <li>{isEn ? "Consultation contacts: Vietnamese phone number provided in registration forms." : "Thông tin liên hệ tư vấn: Số điện thoại học viên nhập trong các form đăng ký."}</li>
              <li>{isEn ? "Learning metrics: Flashcard SRS intervals, pronunciation test scores, and XP." : "Dữ liệu học tập: Tiến độ ôn tập SRS, điểm số phát âm AI, thời gian học và điểm XP."}</li>
              <li>{isEn ? "We do NOT store plain-text payment card data. Payments are securely tokenized via verified payment gateways (PayOS, VietQR, SePay)." : "Chúng tôi KHÔNG lưu trữ thông tin thẻ ngân hàng của học viên. Mọi giao dịch được xử lý mã hóa qua các cổng thanh toán bảo mật chuẩn ngân hàng (PayOS, VietQR, SePay)."}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-primary" />
              <span>3. {isEn ? "Information Security & Access Control" : "Bảo mật thông tin & Kiểm soát truy cập"}</span>
            </h2>
            <p>
              {isEn
                ? "We implement strict Role-Based Access Control (RBAC). Only authorized support staff and teachers assigned to your classes may access learning records. All personal contact details are masked by default across operational interfaces."
                : "Hệ thống áp dụng chuẩn phân quyền nghiêm ngặt (RBAC). Chỉ những nhân sự được phân công trực tiếp mới có quyền xem thông tin hỗ trợ học viên. Số điện thoại và email được mã hóa che giấu (Masked PII) theo mặc định trên toàn bộ giao diện quản trị để phòng ngừa rò rỉ dữ liệu."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-primary" />
              <span>4. {isEn ? "Learner Rights & Contact" : "Quyền lợi học viên & Yêu cầu chỉnh sửa"}</span>
            </h2>
            <p>
              {isEn
                ? "You have the right to request access, correction, or deletion of your personal account data at any time by contacting our student support desk via email: support@junghyeon.vn or hotline: 0988 123 456."
                : "Học viên có quyền yêu cầu trích xuất, chỉnh sửa hoặc xóa vĩnh viễn dữ liệu tài khoản bất cứ lúc nào bằng cách gửi yêu cầu tới Ban Hỗ trợ Học viên qua email: support@junghyeon.vn hoặc Hotline 0988 123 456."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
