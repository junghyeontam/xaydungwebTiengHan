"use client";

import React from "react";
import { FolderKanban, Volume2, FileText, Image as ImageIcon } from "lucide-react";

const MEDIA_ASSETS = [
  {
    id: "med-1",
    name: "topik1-lesson1-self-intro-seoul-female.mp3",
    type: "Audio phát âm chuẩn Seoul",
    size: "1.4 MB",
    icon: Volume2,
  },
  {
    id: "med-2",
    name: "topik1-grammar-conjugation-cheatsheet.pdf",
    type: "Tài liệu PDF Bảng chia đuôi câu",
    size: "2.8 MB",
    icon: FileText,
  },
  {
    id: "med-3",
    name: "hangul-vowel-mouth-diagram.svg",
    type: "Minh họa khẩu hình nguyên âm Hangul",
    size: "420 KB",
    icon: ImageIcon,
  },
];

export default function TeacherMediaLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-admin-text-primary flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-brand-primary" />
          <span>Thư viện Học liệu (Media Library)</span>
        </h1>
        <p className="text-xs text-admin-text-secondary mt-1">
          Quản lý tệp âm thanh phát âm tiếng Hàn, hình ảnh minh họa và tài liệu PDF đính kèm bài giảng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MEDIA_ASSETS.map((asset) => {
          const Icon = asset.icon;
          return (
            <div
              key={asset.id}
              className="p-5 rounded-card bg-admin-surface border border-admin-border shadow-xs space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-admin-text-primary truncate">{asset.name}</div>
              <div className="text-[11px] text-admin-text-secondary">{asset.type}</div>
              <div className="text-[11px] text-admin-text-muted num">{asset.size}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
