"use client";

import React, { useState } from "react";
import { Milestone, Plus, CheckCircle2, Lock, X, Check, Edit2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Num } from "@/components/shared";

interface MilestoneLevel {
  id: string;
  name: string;
  range: string;
  status: "unlocked" | "locked";
  lessonsCount: number;
  learnersCount: string | number;
}

const INITIAL_LEVELS: MilestoneLevel[] = [
  { id: "lvl-0", name: "Nhập môn Hangul", range: "Bài 1 - 10", status: "unlocked", lessonsCount: 10, learnersCount: 1972 },
  { id: "lvl-1", name: "Sơ cấp 1 (TOPIK 1)", range: "Bài 11 - 35", status: "unlocked", lessonsCount: 25, learnersCount: 1420 },
  { id: "lvl-2", name: "Sơ cấp 2 (TOPIK 2)", range: "Bài 36 - 65", status: "unlocked", lessonsCount: 30, learnersCount: 860 },
  { id: "lvl-3", name: "Trung cấp 3 (TOPIK 3)", range: "Bài 66 - 95", status: "unlocked", lessonsCount: 30, learnersCount: 430 },
  { id: "lvl-4", name: "Trung cấp 4 (TOPIK 4)", range: "Bài 96 - 125", status: "unlocked", lessonsCount: 30, learnersCount: 210 },
  { id: "lvl-5", name: "Cao cấp 5-6 (TOPIK 5-6)", range: "Bài 126 - 160", status: "locked", lessonsCount: 35, learnersCount: 85 },
];

export default function AdminRoadmapPage() {
  const [levels, setLevels] = useState<MilestoneLevel[]>(INITIAL_LEVELS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<MilestoneLevel | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [range, setRange] = useState("");
  const [lessonsCount, setLessonsCount] = useState(20);
  const [status, setStatus] = useState<"unlocked" | "locked">("unlocked");

  const handleOpenAdd = () => {
    setEditingLevel(null);
    setName("");
    setRange(`Bài ${levels.reduce((acc, l) => acc + l.lessonsCount, 1)} - ${levels.reduce((acc, l) => acc + l.lessonsCount, 1) + 20}`);
    setLessonsCount(20);
    setStatus("unlocked");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lvl: MilestoneLevel) => {
    setEditingLevel(lvl);
    setName(lvl.name);
    setRange(lvl.range);
    setLessonsCount(lvl.lessonsCount);
    setStatus(lvl.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingLevel) {
      setLevels((prev) =>
        prev.map((l) =>
          l.id === editingLevel.id
            ? { ...l, name, range, lessonsCount, status }
            : l
        )
      );
    } else {
      const newLvl: MilestoneLevel = {
        id: `lvl-${Date.now()}`,
        name,
        range,
        lessonsCount,
        status,
        learnersCount: 0,
      };
      setLevels((prev) => [...prev, newLvl]);
    }

    setIsModalOpen(false);
  };

  const toggleLock = (id: string) => {
    setLevels((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === "unlocked" ? "locked" : "unlocked" }
          : l
      )
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Content & Curriculum"
        title="TOPIK Roadmap Nodes"
        titleMuted={`· ${levels.length} Levels · ${levels.reduce((acc, l) => acc + l.lessonsCount, 0)} Milestones`}
        description="Sắp xếp và quản lý cây chặng học tập, điều kiện mở khóa bài học, điểm chốt kiểm tra cấp độ và tỷ lệ vượt qua."
        primaryAction={{
          label: "Add Level Milestone",
          icon: Plus,
          onClick: handleOpenAdd,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((lvl, index) => (
          <div
            key={lvl.id}
            className="p-5 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex flex-col justify-between space-y-4 hover:shadow-admin-hover transition-all group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-admin-pill bg-admin-brand-teal/10 text-admin-brand-teal font-semibold text-[10px]">
                  CHẶNG {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => toggleLock(lvl.id)}
                  title="Nhấn để đổi trạng thái khóa/mở"
                  className="cursor-pointer"
                >
                  {lvl.status === "unlocked" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-admin-success font-medium hover:underline">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đang mở
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-admin-text-muted font-medium hover:underline">
                      <Lock className="w-3.5 h-3.5" />
                      Khóa
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-admin-text-primary">
                  {lvl.name}
                </h2>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(lvl)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-admin-text-muted hover:text-admin-brand-teal transition-opacity"
                  title="Chỉnh sửa chặng"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-admin-text-secondary">
                {lvl.range} · {lvl.lessonsCount} bài học lý thuyết & thực hành
              </p>
            </div>

            <div className="pt-3 border-t border-admin-border/50 flex items-center justify-between text-xs">
              <span className="text-admin-text-muted">Học viên đang học</span>
              <span className="font-semibold text-admin-text-primary">
                <Num value={lvl.learnersCount} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Milestone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-admin-surface rounded-admin-card border border-admin-border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-admin-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-admin-brand-teal/10 text-admin-brand-teal flex items-center justify-center">
                  <Milestone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-admin-text-primary">
                    {editingLevel ? "Chỉnh sửa chặng học tập" : "Thêm chặng lộ trình mới"}
                  </h3>
                  <p className="text-[11px] text-admin-text-muted">
                    Quản lý điểm chốt kiến thức và điều kiện mở khóa TOPIK
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-admin-text-placeholder hover:text-admin-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-admin-text-secondary mb-1">
                  Tên chặng học tập *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Trung cấp 3 (TOPIK 3)..."
                  className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-admin-text-secondary mb-1">
                    Phạm vi bài học
                  </label>
                  <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="Bài 1 - 20..."
                    className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                  />
                </div>
                <div>
                  <label className="block font-medium text-admin-text-secondary mb-1">
                    Số lượng bài học
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={lessonsCount}
                    onChange={(e) => setLessonsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-admin-text-secondary mb-1">
                  Trạng thái mở khóa
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "unlocked" | "locked")}
                  className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                >
                  <option value="unlocked">Đang mở (Unlocked)</option>
                  <option value="locked">Khóa (Locked - Yêu cầu hoàn thành chặng trước)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-admin-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-admin-control border border-admin-border text-admin-text-secondary hover:bg-admin-subtle"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-admin-control bg-admin-brand-teal hover:bg-admin-brand-teal/90 text-white font-bold"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingLevel ? "Cập nhật" : "Tạo chặng"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
