"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/shared/Button";

export default function LearnerAuthPage() {
  const { user, setAuthModalOpen } = useAuth();

  return (
    <div className="min-h-[75vh] bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-brand-border shadow-card text-center space-y-5">
        <div className="space-y-1.5">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
            Tài khoản Học viên JungHyeon
          </span>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            {user ? `Xin chào, ${user.fullName}` : "Đăng nhập & Đồng bộ Lộ trình"}
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary">
            {user
              ? "Tài khoản của bạn đã được kết nối. Tiếp tục học tập hoặc quản lý hồ sơ cá nhân."
              : "Đăng nhập để lưu tiến độ học TOPIK 1–6, chuỗi Streak và bộ thẻ Flashcard SRS."}
          </p>
        </div>

        {user ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full">
                Vào lộ trình học
              </Button>
            </Link>
            <Link href="/profile" className="w-full sm:w-auto">
              <Button variant="secondary" size="md" className="w-full">
                Hồ sơ cá nhân
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => setAuthModalOpen(true, "login")}
            >
              Đăng nhập ngay
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => setAuthModalOpen(true, "register")}
            >
              Tạo tài khoản mới
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
