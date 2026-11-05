"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Eye,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  Tag,
  Users,
  Crown,
  Layers,
  Settings,
  Flame,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Num,
  Price,
  Percent,
  Delta,
  Phone,
  Count,
  Button,
  Badge,
  Chip,
  ProgressBar,
  ProBadge,
  Card,
  BrandLogo,
  SectionHeading,
  StatBand,
  UnderlineTabs,
  FeaturePanel,
  MockupFrame,
  LevelBadge,
  ScoreDisplay,
  ScrollHintButton,
} from "@/components/shared";
import {
  formatNumber,
  formatCompact,
  formatCurrencyVND,
  formatPercent,
  formatDelta,
  formatPhoneVN,
  formatDate,
  formatTime,
  formatDuration,
} from "@/lib/format";
import { BRAND_CONFIG, PalettePreset } from "@/config/brand";

export default function AdminStyleGuidePage() {
  const [activeTab, setActiveTab] = useState<
    "presets" | "typography" | "numerals" | "components" | "signature" | "cards"
  >("presets");
  const [activePreset, setActivePreset] = useState<PalettePreset>("ocean");
  const [signatureTab, setSignatureTab] = useState("speaking");
  const [toggleState, setToggleState] = useState(true);
  const [inputText, setInputText] = useState("");

  const handlePresetChange = (preset: PalettePreset) => {
    setActivePreset(preset);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme-preset", preset);
    }
  };

  const oceanColors = [
    { name: "Background", token: "--bg", hex: "#FFFFFF" },
    { name: "Subtle Surface", token: "--surface", hex: "#F7F9FC" },
    { name: "Tint Panel", token: "--tint-panel", hex: "#E8F1FC" },
    { name: "Tint Panel Hover", token: "--tint-panel-hover", hex: "#DCEAFB" },
    { name: "Heading Navy", token: "--heading", hex: "#1B2A6B" },
    { name: "Body Text", token: "--body", hex: "#2B3445" },
    { name: "Secondary Text", token: "--secondary", hex: "#5B6577" },
    { name: "Hairline Border", token: "--border", hex: "#E6EAF1" },
    { name: "Primary Blue", token: "--primary", hex: "#2347B5" },
    { name: "Bright Blue", token: "--primary-bright", hex: "#3B6FE0" },
    { name: "Light Frame", token: "--frame", hex: "#BFD9F7" },
    { name: "Gold (PRO)", token: "--gold", hex: "#F5B93A" },
    { name: "Coral (CTA)", token: "--coral", hex: "#E8604C" },
    { name: "Success", token: "--success", hex: "#1F9D6B" },
    { name: "Warning", token: "--warning", hex: "#E39B1B" },
    { name: "Danger", token: "--danger", hex: "#D64545" },
  ];

  const forestColors = [
    { name: "Background", token: "--bg", hex: "#FAF7F2" },
    { name: "Subtle Surface", token: "--surface", hex: "#F3EFE6" },
    { name: "Tint Panel", token: "--tint-panel", hex: "#E6F5F2" },
    { name: "Tint Panel Hover", token: "--tint-panel-hover", hex: "#D5EDE9" },
    { name: "Heading Pine", token: "--heading", hex: "#12302F" },
    { name: "Body Text", token: "--body", hex: "#203837" },
    { name: "Secondary Text", token: "--secondary", hex: "#4D6664" },
    { name: "Hairline Border", token: "--border", hex: "#DCE8E6" },
    { name: "Primary Teal", token: "--primary", hex: "#3DBBA8" },
    { name: "Bright Teal", token: "--primary-bright", hex: "#45D1BD" },
    { name: "Light Frame", token: "--frame", hex: "#BEE3DC" },
    { name: "Gold (PRO)", token: "--gold", hex: "#F5B93A" },
    { name: "Coral (CTA)", token: "--coral", hex: "#E8604C" },
    { name: "Success", token: "--success", hex: "#1F9D6B" },
    { name: "Warning", token: "--warning", hex: "#E39B1B" },
    { name: "Danger", token: "--danger", hex: "#D64545" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Page Header */}
      <AdminPageHeader
        category="Design System"
        title="Living Style Guide"
        titleMuted="· Modern White SaaS Tokens & Shared UI"
        description="Universal design system for the learner site and admin portal: tokens, typography, lining numerals, responsive buttons, badges, and card containers."
        primaryAction={{
          label: "Open ⌘K Palette",
          icon: Search,
          onClick: () => {
            window.dispatchEvent(new CustomEvent("open-admin-command-palette"));
          },
        }}
      />

      {/* Preset Live Switcher Bar */}
      <div className="p-4 rounded-card bg-brand-surface border border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-brand-primary" />
          <div>
            <h2 className="text-sm font-bold text-brand-navy">Active Palette Preset</h2>
            <p className="text-xs text-brand-secondary">
              Centralized in <code className="text-brand-primary font-mono text-[11px]">config/brand.ts</code> and <code className="text-brand-primary font-mono text-[11px]">src/styles/tokens.css</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePresetChange("ocean")}
            className={`px-3 py-1.5 rounded-control text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePreset === "ocean"
                ? "bg-brand-primary text-white shadow-xs"
                : "bg-brand-bg text-brand-secondary border border-brand-border hover:text-brand-navy"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#2347B5] border border-white" />
            Ocean (Default White & Navy)
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("forest")}
            className={`px-3 py-1.5 rounded-control text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePreset === "forest"
                ? "bg-[#3DBBA8] text-white shadow-xs"
                : "bg-brand-bg text-brand-secondary border border-brand-border hover:text-brand-navy"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#3DBBA8] border border-white" />
            Forest (Heritage Teal & Green)
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-brand-border pb-px overflow-x-auto">
        {[
          { id: "presets", label: "Palette Presets & Tokens" },
          { id: "typography", label: "Typography & Korean" },
          { id: "numerals", label: "Lining Numerals" },
          { id: "components", label: "Buttons & Badges" },
          { id: "signature", label: "Signature UI Components" },
          { id: "cards", label: "Cards & Surfaces" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-brand-primary text-brand-primary bg-brand-tint/40 font-bold"
                : "border-transparent text-brand-secondary hover:text-brand-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Presets & Tokens */}
      {activeTab === "presets" && (
        <div className="space-y-6">
          <Card variant="standard" padding="md" className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-brand-navy">
                {activePreset === "ocean" ? "Ocean Preset Tokens (Active)" : "Forest Preset Tokens (Active)"}
              </h2>
              <p className="text-xs text-brand-secondary">
                Soft hairline borders (#E6EAF1), soft shadows (max 0 8px 24px rgba(20,32,80,.06)), and pure white background.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {(activePreset === "ocean" ? oceanColors : forestColors).map((c) => (
                <div
                  key={c.name}
                  className="p-2.5 rounded-control border border-brand-border bg-brand-bg flex flex-col gap-1.5 shadow-2xs"
                >
                  <div
                    className="w-full h-10 rounded-lg border border-brand-border shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <p className="text-xs font-bold text-brand-navy truncate">{c.name}</p>
                    <p className="text-[10px] font-mono text-brand-muted">{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Typography */}
      {activeTab === "typography" && (
        <div className="space-y-6">
          <Card variant="standard" padding="md" className="space-y-6">
            <h2 className="text-sm font-bold text-brand-navy">
              Typography Scale & Hierarchy
            </h2>

            <div className="space-y-6 divide-y divide-brand-border">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-brand-muted">
                  Section Headline (40-48px Desktop, Navy #1B2A6B)
                </span>
                <p className="text-4xl font-extrabold text-brand-navy tracking-tight">
                  Học chắc, <span className="text-brand-primary">nói tự tin</span>.
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-mono text-brand-muted">
                  Big Stat Number (56-72px Weight 700, Proportional Lining Numbers)
                </span>
                <p className="text-5xl font-bold num text-brand-navy tracking-tight">
                  <Num value={14250} /> <span className="text-2xl text-brand-primary font-semibold">+</span>
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-mono text-brand-muted">
                  Korean Proverb (Noto Sans KR, Semibold)
                </span>
                <p className="font-korean text-xl font-semibold text-brand-primary">
                  시작이 반이다 — Bắt đầu là đã hoàn thành một nửa chặng đường.
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-mono text-brand-muted">
                  Body Text (16px / 1.6 Line-Height)
                </span>
                <p className="text-base text-brand-body leading-relaxed max-w-2xl">
                  Lộ trình tinh gọn từ con số 0 đến TOPIK 6. Ghi nhớ sâu với thuật toán Spaced Repetition (SRS), luyện nói phát âm chuẩn Seoul và game hoá sinh động cùng chú hổ Honey.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Lining Numerals */}
      {activeTab === "numerals" && (
        <div className="space-y-6">
          <Card variant="standard" padding="md" className="space-y-4">
            <h2 className="text-sm font-bold text-brand-navy">
              Lining Figures & Formatters (Zero Monospace Rule)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface text-brand-muted">
                    <th className="py-2.5 px-3 font-semibold">Helper / Component</th>
                    <th className="py-2.5 px-3 font-semibold">Input</th>
                    <th className="py-2.5 px-3 font-semibold">Vietnamese (VI)</th>
                    <th className="py-2.5 px-3 font-semibold">English (EN)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-brand-body">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-brand-primary">&lt;Price&gt; (VIP Plan)</td>
                    <td className="py-3 px-3 text-brand-muted">1490000</td>
                    <td className="py-3 px-3"><Price amount={1490000} locale="vi" size="sm" /></td>
                    <td className="py-3 px-3"><Price amount={1490000} locale="en" size="sm" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-brand-primary">&lt;Num&gt; (Learners)</td>
                    <td className="py-3 px-3 text-brand-muted">14250</td>
                    <td className="py-3 px-3 font-semibold"><Num value={14250} locale="vi" /></td>
                    <td className="py-3 px-3 font-semibold"><Num value={14250} locale="en" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-brand-primary">&lt;Percent&gt;</td>
                    <td className="py-3 px-3 text-brand-muted">0.784</td>
                    <td className="py-3 px-3"><Percent value={0.784} locale="vi" /></td>
                    <td className="py-3 px-3"><Percent value={0.784} locale="en" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-brand-primary">&lt;Delta&gt;</td>
                    <td className="py-3 px-3 text-brand-muted">+0.128</td>
                    <td className="py-3 px-3"><Delta value={0.128} locale="vi" /></td>
                    <td className="py-3 px-3"><Delta value={0.128} locale="en" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-brand-primary">&lt;Phone&gt;</td>
                    <td className="py-3 px-3 text-brand-muted">&quot;0988112233&quot;</td>
                    <td className="py-3 px-3 font-semibold text-brand-primary" colSpan={2}>
                      <Phone phone="0988112233" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Buttons & Badges */}
      {activeTab === "components" && (
        <div className="space-y-6">
          {/* Button Showcase */}
          <Card variant="standard" padding="md" className="space-y-4">
            <h2 className="text-sm font-bold text-brand-navy">
              Buttons & Action Hierarchy
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md">
                Primary Blue (Default)
              </Button>
              <Button variant="cta" size="md">
                Coral CTA (Purchase/Enroll)
              </Button>
              <Button variant="secondary" size="md">
                Secondary White Outline
              </Button>
              <Button variant="ghost" size="md">
                Ghost Action
              </Button>
              <Button variant="primary" size="md" loading>
                Loading State
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled State
              </Button>
            </div>
          </Card>

          {/* Badges & Chips */}
          <Card variant="standard" padding="md" className="space-y-4">
            <h2 className="text-sm font-bold text-brand-navy">
              Badges & Status Chips
            </h2>
            <div className="flex flex-wrap items-center gap-2.5">
              <ProBadge size="md" variant="pill" />
              <ProBadge size="sm" variant="pill" />
              <ProBadge size="md" variant="icon" />
              <Badge variant="tint">Tint Primary</Badge>
              <Badge variant="free">Free Tier</Badge>
              <Badge variant="success">Published</Badge>
              <Badge variant="warning">In Review</Badge>
              <Badge variant="danger">Archived</Badge>
              <Badge variant="neutral">Draft</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Signature UI Components */}
      {activeTab === "signature" && (
        <div className="space-y-8">
          {/* Section Heading Showcase */}
          <Card variant="standard" padding="md" className="space-y-4">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              1. SectionHeading Component
            </h3>
            <div className="py-4 border rounded-card bg-brand-surface/40 p-6">
              <SectionHeading
                eyebrow={<Badge variant="tint">Tính năng nổi bật</Badge>}
                title="Trải nghiệm tính năng <hl>độc quyền</hl> của JungHyeon"
                subtitle="Hệ thống học tiếng Hàn thông minh với công nghệ phản hồi phát âm chuẩn Seoul và phòng luyện thi TOPIK chuẩn quốc tế."
              />
            </div>
          </Card>

          {/* StatBand Showcase */}
          <Card variant="standard" padding="md" className="space-y-4">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              2. StatBand Component (40px Tint Container with Animated Lining Numbers)
            </h3>
            <StatBand
              stats={[
                { value: 120, suffix: "+", label: "Bài học Ngữ pháp", sublabel: "Từ sơ cấp đến cao cấp" },
                { value: 4500, suffix: "+", label: "Từ vựng cốt lõi", sublabel: "Kèm âm thanh bản ngữ" },
                { value: 14250, suffix: "+", label: "Học viên tin chọn", sublabel: "Toàn quốc & du học sinh" },
                { value: 98, suffix: "%", label: "Tỉ lệ đỗ TOPIK", sublabel: "Cam kết đầu ra chuẩn" },
              ]}
            />
          </Card>

          {/* UnderlineTabs & FeaturePanel Showcase */}
          <Card variant="standard" padding="md" className="space-y-4">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              3. UnderlineTabs & FeaturePanel & MockupFrame
            </h3>
            <UnderlineTabs
              activeTab={signatureTab}
              onChange={setSignatureTab}
              tabs={[
                { id: "speaking", label: "Phòng luyện nói AI", isPro: true },
                { id: "writing", label: "Sửa bài viết TOPIK" },
                { id: "srs", label: "Thẻ Flashcard SRS" },
                { id: "honey", label: "Trợ lý hổ Honey", badge: <Badge variant="free" size="sm">Mới</Badge> },
              ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 items-stretch">
              <FeaturePanel
                variant="tint"
                isPro={signatureTab === "speaking"}
                eyebrow="Độc quyền JungHyeon"
                title={
                  signatureTab === "speaking"
                    ? "Luyện phát âm chuẩn Seoul với AI"
                    : signatureTab === "writing"
                    ? "Chấm chữa bài viết TOPIK 54 chi tiết"
                    : signatureTab === "srs"
                    ? "Thuật toán ghi nhớ vĩnh viễn Spaced Repetition"
                    : "Học cùng chú hổ Honey 24/7"
                }
                description="Được thiết kế dựa trên giáo trình của Viện Ngôn ngữ Seoul, giúp bạn sửa khẩu hình và phản xạ hội thoại tự nhiên."
                bullets={[
                  { title: "Nhận diện giọng nói chuẩn ngữ điệu Seoul", isPro: true },
                  { title: "Phản hồi từng âm tiết chưa chuẩn xác trong 0.5s" },
                  { title: "Lưu lịch sử tiến bộ và biểu đồ phát âm cá nhân" },
                ]}
                ctaText="Trải nghiệm ngay"
                ctaHref="/pronunciation"
              />

              <MockupFrame title="Phòng Luyện Phát Âm • JungHyeon AI">
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-brand-tint border border-brand-frame mx-auto flex items-center justify-center text-2xl font-bold text-brand-primary">
                    안녕하세요
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-brand-navy">Annyeonghaseyo</p>
                    <p className="text-xs text-brand-muted">Xin chào (Trang trọng)</p>
                  </div>
                  <div className="flex justify-center gap-6 pt-2">
                    <ScoreDisplay score={192} maxScore={200} label="Điểm phát âm" />
                    <LevelBadge level="6" label="Level" progressPercent={75} showRing />
                  </div>
                </div>
              </MockupFrame>
            </div>
          </Card>

          {/* LevelBadge, ScoreDisplay & ScrollHintButton */}
          <Card variant="standard" padding="md" className="space-y-4">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              4. LevelBadge, ScoreDisplay & ScrollHintButton
            </h3>
            <div className="flex flex-wrap items-center gap-8 py-3">
              <div className="flex items-center gap-4">
                <LevelBadge level="1" label="TOPIK" size="sm" />
                <LevelBadge level="3" label="TOPIK" size="md" />
                <LevelBadge level="6" label="TOPIK" size="lg" progressPercent={85} showRing />
              </div>

              <div className="h-10 w-px bg-brand-border" />

              <ScoreDisplay score={184} maxScore={200} label="TOPIK II Điểm Thi Thử" />

              <div className="h-10 w-px bg-brand-border" />

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-brand-secondary">Scroll Down Hint:</span>
                <ScrollHintButton />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Cards & Surfaces */}
      {activeTab === "cards" && (
        <div className="space-y-8">
          {/* Card Style Rules Showcase */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              Card Style Rules (Airy Modern SaaS Architecture)
            </h3>
            <p className="text-xs text-brand-secondary">
              Structure comes from background tints, spacing and soft shadows, not from thick black lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Default Surface Card */}
            <Card variant="surface" padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-navy">Default Card</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-bg text-brand-muted font-medium">
                  Surface Fill #F7F9FC
                </span>
              </div>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Filled surface #F7F9FC with NO border. Used as primary content cards and nested panels to eliminate visual noise.
              </p>
            </Card>

            {/* 2. Outline Card */}
            <Card variant="outline" padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-navy">Outline Card</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-surface text-brand-muted font-medium">
                  Hairline #E6EAF1
                </span>
              </div>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Pure white card with a 1px hairline in --color-border and very soft shadow (0 1px 2px rgba(20,32,80,.04)). Never thick black lines.
              </p>
            </Card>

            {/* 3. Selected / Active Card */}
            <Card variant="selected" padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary" />
                  Selected / Active Card
                </span>
                <Chip variant="tint" size="xs">Active</Chip>
              </div>
              <p className="text-xs text-brand-body leading-relaxed">
                Tint fill #E3F0FF + 1.5px primary border + dot/check indicator. No outer glow or harsh outlines.
              </p>
            </Card>

            {/* 4. Growth / Success Card */}
            <Card variant="growth" padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F9D6B] dark:text-[#2CD693]">
                  Growth & Achievement
                </span>
                <Chip variant="growth" size="xs">+35 XP</Chip>
              </div>
              <p className="text-xs text-brand-body leading-relaxed">
                Green tint #E8F6F1 fill for positive feedback, plant stages, and successful milestone completions.
              </p>
            </Card>

            {/* 5. Inactive / Locked Card */}
            <Card variant="locked" padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-muted flex items-center gap-1.5">
                  <span className="text-xs">🔒</span>
                  Locked Milestone
                </span>
                <span className="text-[10px] text-brand-muted font-medium">800-1500 XP</span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                Reduced opacity (60%), muted typography, lock icon, and NO change in border weight.
              </p>
            </Card>

            {/* 6. Interactive Hover Card */}
            <Card variant="interactive" padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-navy">Interactive Hover</span>
                <span className="text-[10px] text-brand-primary font-semibold">Hover me →</span>
              </div>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Raises 2px (-translate-y-0.5) on hover with soft shadow. Supports 2px focus-visible ring for full keyboard accessibility.
              </p>
            </Card>
          </div>

          {/* Progress Bars & Chips Showcase */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              ProgressBar & Chip Primitives
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="surface" padding="md" className="space-y-4">
                <h4 className="text-xs font-bold text-brand-navy">10px Rounded Progress Bars</h4>
                <div className="space-y-3">
                  <ProgressBar value={65} variant="teal" showLabel label="Tiến độ Cây con (Teal to Emerald)" />
                  <ProgressBar value={40} variant="primary" showLabel label="Lộ trình TOPIK 1 (Cobalt Primary)" />
                  <ProgressBar value={85} variant="gold" showLabel label="Huy hiệu Chăm chỉ (Gold XP)" />
                </div>
              </Card>

              <Card variant="surface" padding="md" className="space-y-4">
                <h4 className="text-xs font-bold text-brand-navy">Tint Chips & Micro-Badges</h4>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <Chip variant="gold" size="sm">+20 XP</Chip>
                  <Chip variant="growth" size="sm">+35 XP Tưới nước</Chip>
                  <Chip variant="tint" size="sm">Cây JungHyeon</Chip>
                  <Chip variant="coral" size="sm">Còn 315 XP nữa!</Chip>
                  <Chip variant="surface" size="sm">Level 3: Cây con</Chip>
                  <Chip variant="outline" size="sm">Hairline Tag</Chip>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
