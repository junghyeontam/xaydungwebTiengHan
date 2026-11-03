# Numeral Style Audit & Unification Report

**Date:** 2026-11-02  
**Scope:** Learner site (`src/app/(learner)`, `src/components/*`), Admin portal (`src/app/[locale]/(admin)`, `src/components/admin/*`), and shared layers (`src/lib/*`, `src/components/shared/*`).

---

## 1. Root Causes

### A. Monospace Font & Slashed Zeros (`0̸`)
1. **Windows Default Monospace Behavior (`Consolas` / `ui-monospace`)**:
   - Whenever an element was styled with Tailwind's `font-mono` (e.g. `<span className="font-mono">{lead.phone}</span>`, `<tbody className="font-mono">` in audit-logs, or `<div className="font-mono">` in Topik/shop), the browser fell back to the system monospace font (`Consolas` on Windows).
   - `Consolas` renders digits—particularly the digit zero `0`—with a prominent diagonal slash (`0̸`) by design.
2. **Global Font Feature Settings**:
   - `globals.css` applied broad `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` on `body`.
   - In some typography systems, styling zero flags or inheriting monospace caused digits to lose their proportional lining appearance.
3. **Improper Use of `tabular-nums` on Non-Aligned Text**:
   - In `AdminAnalyticsPage` and `AdminSidebar`, KPI cards used `tabular-nums` on large promotional display digits (`$124,860.40`, `$48,210`). Proportional lining numbers should be used instead so digits look tight, balanced, and natural. Tabular nums are strictly reserved for table cells, chart axes, countdown timers, and aligned badge counters.

### B. Mixed and Non-Standard Number Formats
1. **Hardcoded Strings vs. Dynamic Localized Formatting**:
   - Hardcoded values like `"14,250"` (comma in Vietnamese context where period `.` should be used: `"14.250"`), `"48.5M ₫"` (English suffix "M" mixed with Vietnamese currency symbol "₫" where `"48,5 tr ₫"` or `"48,5 triệu"` should be used), and `"1.9k"` (English "k" instead of `"1.900"` or `"1,9 nghìn"`).
2. **Missing Vietnamese Phone Formatter**:
   - Leads and contact lists displayed raw strings like `"0988 112 233"` or unspaced `"0988112233"`, wrapped in `font-mono`.
3. **Ad-hoc Inline Currency Formatting**:
   - Direct `.toLocaleString("vi-VN")` or manual string concatenation like `${val} đ` or `VND` instead of the single source of truth (`formatCurrencyVND` and `<Price>`).

---

## 2. Inventory of Occurrences

| Category | File | Line(s) | Existing Usage | Unification Plan |
|---|---|---|---|---|
| **KPI / Stats** | `src/app/[locale]/(admin)/admin/page.tsx` | 208, 227, 242 | Hardcoded `"14,250"`, `"48.5M ₫"`, `"78.4%"` | Replace with `<Num value={14250} />`, `<Price amount={48500000} compact size="kpi" />`, `<Percent value={0.784} />` |
| **KPI / Analytics** | `src/app/[locale]/(admin)/admin/analytics/page.tsx` | 32, 49 | `tabular-nums text-3xl font-semibold` | Replace with `<Num>` / `<Price>` with proportional lining font |
| **Phone Numbers** | `src/app/[locale]/(admin)/admin/page.tsx` | 362 | `className="font-mono text-muted-foreground text-[11px]"` | Replace with `<Phone phone={lead.phone} />` (Sans font, 4-3-3 spaced) |
| **Phone Numbers** | `src/app/[locale]/(admin)/admin/sales/leads/page.tsx` | 42 | `className="py-3.5 px-4 font-mono text-admin-brand-teal"` | Replace with `<Phone phone={l.phone} />` |
| **Phone Numbers** | `src/components/ui/FloatingActions.tsx` | 207 | `className="text-[11px] text-muted-foreground font-mono"` | Replace with `<Phone phone="0901 234 567" />` |
| **Sidebar Badges** | `src/components/admin/AdminSidebar.tsx` | 106, 173, 406 | `count: "1.2k"`, `badge: "1.9k"` | Replace with `<Count count={1900} variant="sidebar" />` (`1.900` tabular sans) |
| **Notification Badges** | `src/components/admin/NotificationBell.tsx` | 132, 174 | Hardcoded badge & relative timestamps | Wrap in `<Count>` and use `formatDuration` |
| **Audit Logs** | `src/app/[locale]/(admin)/admin/audit-logs/page.tsx` | 99, 112 | `<tbody className="font-mono">`, `.toLocaleString("vi-VN")` | Remove `font-mono` from `<tbody>`; format timestamps using `formatDate` & `formatTime`; KEEP `font-mono` ONLY on JSON diff block (line 171) |
| **Audit Logs (Home)** | `src/app/[locale]/(admin)/admin/page.tsx` | 433 | `className="... font-mono shrink-0"` | Remove `font-mono`, use `formatDuration` / `formatTime` |
| **Checkout Prices** | `src/components/shop/CheckoutModal.tsx` | 217, 229, 241 | `font-mono font-bold text-foreground` for bank account & amount | Use `.num-tabular` sans for account number; use `<Price>` for amount and button |
| **TOPIK Exam** | `src/app/(learner)/topik/page.tsx` | 363, 381, 495 | `font-mono` on timer, question index, and points | Use `.num-tabular` sans for countdown timer; use `<Num>` for scores and points |
| **Learner Profile** | `src/app/(learner)/profile/page.tsx` | 417 | `font-mono` on joined date / stats | Remove `font-mono`, use `formatDate` |
| **Lesson Header** | `src/components/lesson/LessonHeader.tsx` | 45 | `<span className="text-junghyeon-teal font-mono shrink-0">` | Replace with `<Num>` in primary sans |
| **Study Session** | `src/components/srs/StudySession.tsx` | 182 | `font-mono` on hotkey numbers | Use primary UI sans font |

### Monospace Retained (Allowed by Spec)
- `src/app/[locale]/(admin)/admin/audit-logs/page.tsx`: Line 171 (Raw JSON state diff viewer).
- `src/app/[locale]/(admin)/admin/sales/orders/page.tsx`: Line 45 (Order UUID/Code `ord-8821`).
- `src/app/[locale]/(admin)/admin/health/page.tsx`: System config keys (`NEXT_PUBLIC_SUPABASE_URL`) and database migration IDs.
- `src/components/srs/CreateDeckModal.tsx`: Line 234 (Raw flashcard CSV/JSON bulk import textarea).

---

## 3. Implementation Steps

1. **Global Styles & Tokens (`src/app/globals.css`, `src/styles/globals.css`, `src/styles/admin-tokens.css`)**:
   - Set body defaults:
     ```css
     font-variant-numeric: lining-nums;
     font-feature-settings: "lnum" 1, "onum" 0, "zero" 0, "ss01" 0;
     ```
   - Provide utilities:
     - `.num` (proportional lining, no-slash zero, nowrap)
     - `.num-tabular` (tabular lining, no-slash zero, nowrap)
     - `.num-kpi` (32px–36px, font-weight 600, letter-spacing -0.02em)
   - Ensure Recharts and chart SVG elements inherit primary font family without monospace fallback.

2. **Formatting Layer (`src/lib/format.ts`)**:
   - `formatNumber(14250, locale)`: `14.250` (vi) / `14,250` (en).
   - `formatCompact(value, options)`: Handles currency and counts without `"N"`. `48.500.000` -> `"48,5 triệu"`, `1.900` -> `"1.900"` (or `"1,9 nghìn"` if forced compact).
   - `formatCurrencyVND(amount, options)`: `"1.490.000 ₫"` / `"1,490,000 VND"`; compact: `"48,5 tr ₫"`.
   - `formatPercent(value, locale)`: `0.784` -> `"78,4%"` (vi) / `"78.4%"` (en).
   - `formatDelta(delta, locale)`: `+12,8%` / `-5,2%`.
   - `formatPhoneVN(phone)`: `"0988 112 233"` in sans font.
   - `formatDate`, `formatTime`, `formatDuration`: Localized with non-breaking spaces.

3. **Components (`src/components/shared/*`)**:
   - Build/refactor `<Num>`, `<Price>`, `<Percent>`, `<Delta>`, `<Phone>`, `<Count>`.
   - Add ESLint rules restricting raw `.toLocaleString()` and `.toFixed()` outside `src/lib/format.ts`.

4. **Sweep & Verification**:
   - Update all identified locations.
   - Add unit test suite `scripts/test-numeral-format.mjs` verifying all outputs in `vi` and `en`.
   - Run Playwright test verifying font computed styles and `lining-nums`.
   - Add a dev-only `/_design` "Numerals" showcase section.
