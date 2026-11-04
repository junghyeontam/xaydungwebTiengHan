"use client";

import React, { useState } from "react";
import { Sliders, Save, CheckCircle2, AlertTriangle, Sparkles, Flame, ShieldAlert, Cpu } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "Hệ thống đang bảo trì định kỳ để nâng cấp máy chủ học tập. Vui lòng quay lại sau ít phút."
  );

  // Feature Flags
  const [aiHoneyLive, setAiHoneyLive] = useState(true);
  const [speechRecognition, setSpeechRecognition] = useState(true);
  const [onlineTopikMock, setOnlineTopikMock] = useState(true);

  // Gamification Multipliers
  const [lessonBonus, setLessonBonus] = useState("1.0");
  const [streakMultiplier, setStreakMultiplier] = useState("1.2");
  const [weekendXp, setWeekendXp] = useState("1.5");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // Simulate/trigger settings update
      await new Promise((r) => setTimeout(r, 600));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Save settings error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="System Administration"
        title="Global System Settings"
        titleMuted="· Engine & Feature Toggles"
        description="Cấu hình chế độ bảo trì, bật/tắt tính năng theo thời gian thực (Feature Flags) và điều chỉnh hệ số thưởng điểm kinh nghiệm XP."
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-admin-pill bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white font-medium text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang áp dụng..." : "Lưu tất cả cấu hình"}
          </button>
        }
      />

      {savedSuccess && (
        <div className="p-3.5 rounded-admin-card bg-admin-success-tint border border-admin-success/30 text-admin-success text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Cấu hình hệ thống đã được đồng bộ thành công vào cơ sở dữ liệu.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Maintenance Mode Card */}
        <div className="rounded-admin-card bg-admin-surface border border-admin-border p-5 shadow-admin-card space-y-4">
          <div className="flex items-center justify-between border-b border-admin-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-admin-brand-coral/10 text-admin-brand-coral flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-admin-text-primary">Chế độ bảo trì hệ thống</h3>
                <p className="text-xs text-admin-text-secondary">
                  Khi kích hoạt, người học sẽ thấy trang thông báo bảo trì, nhưng ban quản trị vẫn truy cập bình thường.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                maintenanceMode ? "bg-admin-brand-coral" : "bg-admin-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {maintenanceMode && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-admin-text-primary">Thông báo bảo trì hiển thị cho học viên</label>
              <textarea
                rows={2}
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-admin-subtle border border-admin-border text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
              />
            </div>
          )}
        </div>

        {/* Feature Flags Card */}
        <div className="rounded-admin-card bg-admin-surface border border-admin-border p-5 shadow-admin-card space-y-4">
          <div className="flex items-center gap-2.5 border-b border-admin-border pb-3">
            <div className="w-7 h-7 rounded-lg bg-admin-brand-teal/10 text-admin-brand-teal flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-admin-text-primary">Feature Flags (Cờ tính năng theo thời gian thực)</h3>
              <p className="text-xs text-admin-text-secondary">Bật hoặc tắt tức thì các dịch vụ AI và module học tập mà không cần deploy lại code.</p>
            </div>
          </div>

          <div className="divide-y divide-admin-border/50">
            {/* Flag 1 */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-admin-text-primary">Trợ lý AI Honey thông minh</span>
                <p className="text-[11px] text-admin-text-secondary">Gợi ý bài tập, giải thích ngữ pháp và động viên học viên khi làm bài.</p>
              </div>
              <button
                type="button"
                onClick={() => setAiHoneyLive(!aiHoneyLive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  aiHoneyLive ? "bg-admin-brand-teal" : "bg-admin-border"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    aiHoneyLive ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Flag 2 */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-admin-text-primary">Nhận diện giọng nói (Speech Recognition)</span>
                <p className="text-[11px] text-admin-text-secondary">Chấm điểm phát âm tiếng Hàn theo độ tương đồng âm thanh.</p>
              </div>
              <button
                type="button"
                onClick={() => setSpeechRecognition(!speechRecognition)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  speechRecognition ? "bg-admin-brand-teal" : "bg-admin-border"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    speechRecognition ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Flag 3 */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-admin-text-primary">Thi thử TOPIK trực tuyến</span>
                <p className="text-[11px] text-admin-text-secondary">Mở cổng phòng thi thử TOPIK I & II có bấm giờ chuẩn Hàn Quốc.</p>
              </div>
              <button
                type="button"
                onClick={() => setOnlineTopikMock(!onlineTopikMock)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  onlineTopikMock ? "bg-admin-brand-teal" : "bg-admin-border"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    onlineTopikMock ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Gamification Settings Card */}
        <div className="rounded-admin-card bg-admin-surface border border-admin-border p-5 shadow-admin-card space-y-4">
          <div className="flex items-center gap-2.5 border-b border-admin-border pb-3">
            <div className="w-7 h-7 rounded-lg bg-admin-brand-yellow/15 text-admin-brand-yellow flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-admin-text-primary">Hệ số thưởng Gamification & XP Multipliers</h3>
              <p className="text-xs text-admin-text-secondary">Cân chỉnh hệ số nhân điểm kinh nghiệm để kích thích học viên duy trì chuỗi Streak.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-admin-text-primary">Hệ số hoàn thành bài học cơ bản</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="5.0"
                value={lessonBonus}
                onChange={(e) => setLessonBonus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary font-num focus:outline-none focus:border-admin-brand-teal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-admin-text-primary">Hệ số duy trì Streak 7+ ngày</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={streakMultiplier}
                onChange={(e) => setStreakMultiplier(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary font-num focus:outline-none focus:border-admin-brand-teal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-admin-text-primary">Hệ số thưởng học cuối tuần (T7, CN)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={weekendXp}
                onChange={(e) => setWeekendXp(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-admin-pill bg-admin-subtle border border-admin-border text-admin-text-primary font-num focus:outline-none focus:border-admin-brand-teal"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
