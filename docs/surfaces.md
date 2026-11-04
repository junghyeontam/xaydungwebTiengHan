# Surface Architecture & Full Repository Audit (Phase M-0)

> **Status**: Phase M-0 Audit Complete (Zero code edits to existing application)  
> **Architecture**: Turborepo + `pnpm` Monorepo with 3 isolated Next.js 14 App Router deployments (`apps/web`, `apps/teach`, `apps/admin`) sharing 1 Supabase backend.

---

## 1. Canonical Surfaces Overview

| Surface ID | Workspace Path | Production Domain (`TODO: confirm final DNS`) | Local Dev Origin | Primary Audience | Indexing & Robots |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`web`** | `apps/web` | `junghyeon.com` | `http://localhost:3000` | Learners (`learner`) & Guests (`anon`), plus staff previewing learner site | Indexable (`index, follow`, `sitemap.xml`) |
| **`teach`** | `apps/teach` | `teach.junghyeon.com` | `http://localhost:3001` | `teacher`, `content_editor`, `publisher`, `super_admin` | Strictly `noindex, nofollow`, `robots.txt: Disallow: /` |
| **`admin`** | `apps/admin` | `admin.junghyeon.com` | `http://localhost:3002` | `admin`, `sales_crm`, `support_agent`, `marketing`, `read_only`, `super_admin` | Strictly `noindex, nofollow`, `robots.txt: Disallow: /` |
| **`system`** | `apps/admin/src/app/[locale]/(system)/system` | `admin.junghyeon.com/system/*` | `http://localhost:3002/system` | **`super_admin` ONLY** (requires 2FA + 10-min fresh re-auth) | Strictly `noindex, nofollow` + optional Cloudflare Access / IP allowlist |

---

## 2. Role $\rightarrow$ Surface Access Matrix (`packages/rbac/src/surfaces.ts`)

Default policy is **DEFAULT-DENY**. A valid authenticated session on a surface where the user's role is `DENY` immediately renders a dedicated **403 Surface Access Denied** screen with *"Switch Account"* and *"Request Access"* actions (never a redirect loop or blank screen).

| Role Identifier | `apps/web` (`junghyeon.com`) | `apps/teach` (`teach.junghyeon.com`) | `apps/admin` (`admin.junghyeon.com`) | `apps/admin` (`/system/**`) | Mandatory 2FA (TOTP) | Idle Timeout |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `guest` (Unauthenticated) | **ALLOW** (Public routes) | **DENY** ($\rightarrow$ `/login`) | **DENY** ($\rightarrow$ `/login`) | **DENY** ($\rightarrow$ `/login`) | N/A | N/A |
| `learner` | **ALLOW** | **DENY (403)** | **DENY (403)** | **DENY (403)** | Optional | 30 days |
| `teacher` | **ALLOW** | **ALLOW** | **DENY (403)** | **DENY (403)** | **REQUIRED** | 30 min |
| `content_editor` | **ALLOW** | **ALLOW** | **DENY (403)** | **DENY (403)** | **REQUIRED** | 30 min |
| `publisher` | **ALLOW** | **ALLOW** | **DENY (403)** | **DENY (403)** | **REQUIRED** | 30 min |
| `admin` | **ALLOW** | **DENY (403)** | **ALLOW** | **DENY (403)** | **REQUIRED** | 30 min |
| `sales_crm` | **ALLOW** | **DENY (403)** | **ALLOW** | **DENY (403)** | **REQUIRED** | 30 min |
| `support_agent` | **ALLOW** | **DENY (403)** | **ALLOW** | **DENY (403)** | **REQUIRED** | 30 min |
| `marketing` | **ALLOW** | **DENY (403)** | **ALLOW** | **DENY (403)** | **REQUIRED** | 30 min |
| `read_only` | **ALLOW** | **DENY (403)** | **ALLOW** | **DENY (403)** | Configurable (`TODO: confirm read_only 2FA policy`) | 30 min |
| `super_admin` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** (Re-auth $\le 10\text{m}$) | **REQUIRED** | 15 min in `/system` |

---

## 3. Complete Route Audit & Target App Mapping

### 3.1 Learner Routes $\rightarrow$ `apps/web`

| Current File Path (`src/app/...`) | Current URL | Target App & Route (`apps/web/src/app/...`) | Notes / Action in Migration |
| :--- | :--- | :--- | :--- |
| `src/app/layout.tsx` | `/` (Root layout) | `apps/web/src/app/layout.tsx` | Consumes `@junghyeon/ui` tokens & `@junghyeon/i18n` |
| `src/app/not-found.tsx` | `/*` (404) | `apps/web/src/app/not-found.tsx` | Shared 404 pattern per surface |
| `src/app/robots.ts` | `/robots.txt` | `apps/web/src/app/robots.ts` | Allows indexing on `web`; `teach` & `admin` get `Disallow: /` |
| `src/app/sitemap.ts` | `/sitemap.xml` | `apps/web/src/app/sitemap.ts` | Only in `apps/web` |
| `src/app/(learner)/layout.tsx` | `/` | `apps/web/src/app/(learner)/layout.tsx` | Learner shell (Header, BottomNav, Honey assistant) |
| `src/app/(learner)/page.tsx` | `/` | `apps/web/src/app/(learner)/page.tsx` | Learner home & marketing landing |
| `src/app/(learner)/roadmap/page.tsx` | `/roadmap` | `apps/web/src/app/(learner)/roadmap/page.tsx` | TOPIK 1–6 roadmap & 3-tier theory library |
| *(New dedicated alias)* | `/theory` | `apps/web/src/app/(learner)/theory/page.tsx` | Direct entry to 3-tier Grammar & Vocabulary theory |
| `src/app/(learner)/lessons/[slug]/page.tsx` | `/lessons/[slug]` | `apps/web/src/app/(learner)/lessons/[slug]/page.tsx` | Uses `@junghyeon/content-renderer` |
| `src/app/(learner)/review/page.tsx` | `/review` | `apps/web/src/app/(learner)/review/page.tsx` | SM-2 SRS flashcard review session |
| `src/app/(learner)/pronunciation/page.tsx` | `/pronunciation` | `apps/web/src/app/(learner)/pronunciation/page.tsx` | AI speech & pronunciation studio |
| `src/app/(learner)/topik/page.tsx` | `/topik` | `apps/web/src/app/(learner)/topik/page.tsx` | TOPIK mock exam room |
| `src/app/(learner)/consultation/page.tsx` | `/consultation` | `apps/web/src/app/(learner)/consulting/page.tsx` | Standardize route to `/consulting` (redirect `/consultation` $\rightarrow$ `/consulting`) |
| `src/app/(learner)/products/page.tsx` | `/products` | `apps/web/src/app/(learner)/shop/page.tsx` | Standardize route to `/shop` (redirect `/products` $\rightarrow$ `/shop`) |
| `src/app/(learner)/profile/page.tsx` | `/profile` | `apps/web/src/app/(learner)/profile/page.tsx` | Learner profile view mode |
| `src/app/(learner)/profile/settings/layout.tsx` | `/profile/settings` | `apps/web/src/app/(learner)/profile/settings/layout.tsx` | Desktop 2-column sticky `ProfileSummaryCard` + `SettingsNav` |
| `src/app/(learner)/profile/settings/page.tsx` | `/profile/settings` | `apps/web/src/app/(learner)/profile/settings/page.tsx` | Redirects to `/profile/settings/personal` |
| `src/app/(learner)/profile/settings/personal/page.tsx` | `/profile/settings/personal` | `apps/web/src/app/(learner)/profile/settings/personal/page.tsx` | Personal & contact section cards |
| `src/app/(learner)/profile/settings/learning/page.tsx` | `/profile/settings/learning` | `apps/web/src/app/(learner)/profile/settings/learning/page.tsx` | TOPIK goals & study preferences |
| `src/app/(learner)/profile/settings/account/page.tsx` | `/profile/settings/account` | `apps/web/src/app/(learner)/profile/settings/account/page.tsx` | Password, OAuth providers, active sessions |
| `src/app/(learner)/profile/settings/notifications/page.tsx` | `/profile/settings/notifications` | `apps/web/src/app/(learner)/profile/settings/notifications/page.tsx` | Instant auto-save notification switches |
| `src/app/(learner)/profile/settings/privacy/page.tsx` | `/profile/settings/privacy` | `apps/web/src/app/(learner)/profile/settings/privacy/page.tsx` | Privacy toggles, JSON export, 14-day account deletion |
| `src/app/(learner)/contact/page.tsx` | `/contact` | `apps/web/src/app/(learner)/contact/page.tsx` | Contact page |
| `src/app/(learner)/privacy/page.tsx` | `/privacy` | `apps/web/src/app/(learner)/privacy/page.tsx` | Privacy policy |
| `src/app/(learner)/terms/page.tsx` | `/terms` | `apps/web/src/app/(learner)/terms/page.tsx` | Terms of service |
| `src/app/(learner)/refund/page.tsx` | `/refund` | `apps/web/src/app/(learner)/refund/page.tsx` | Refund policy page |

### 3.2 Teacher Studio Routes $\rightarrow$ `apps/teach`

| Current File Path (`src/app/...`) | Current URL | Target App & Route (`apps/teach/src/app/[locale]/...`) | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `src/app/[locale]/(admin)/admin/teaching/layout.tsx` | `/admin/teaching/*` | `apps/teach/src/app/[locale]/layout.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/teaching/lessons/page.tsx` | `/admin/teaching/lessons` | `apps/teach/src/app/[locale]/page.tsx` (Role Home) & `/lessons/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/teaching/lessons/new/page.tsx` | `/admin/teaching/lessons/new` | `apps/teach/src/app/[locale]/lessons/new/page.tsx` & `/lessons/[id]/edit/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/teaching/vocabulary/page.tsx` | `/admin/teaching/vocabulary` | `apps/teach/src/app/[locale]/banks/vocabulary/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/teaching/grammar/page.tsx` | `/admin/teaching/grammar` | `apps/teach/src/app/[locale]/banks/grammar/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/teaching/roadmap/page.tsx` | `/admin/teaching/roadmap` | `apps/teach/src/app/[locale]/roadmap-planner/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/teaching/feedback/page.tsx` | `/admin/teaching/feedback` | `apps/teach/src/app/[locale]/review-feedback/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/publishing/page.tsx` | `/admin/publishing` | `apps/teach/src/app/[locale]/review-feedback/queue/page.tsx` | `publisher`, `super_admin` |
| `src/app/[locale]/(admin)/admin/teaching/analytics/page.tsx` | `/admin/teaching/analytics` | `apps/teach/src/app/[locale]/analytics/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |
| *(New route in M-4)* | N/A | `apps/teach/src/app/[locale]/classes/page.tsx` | `teacher`, `super_admin` (Assigned classes only) |
| *(New route in M-4)* | N/A | `apps/teach/src/app/[locale]/grading/page.tsx` | `teacher`, `super_admin` |
| *(New route in M-4)* | N/A | `apps/teach/src/app/[locale]/media/page.tsx` | `teacher`, `content_editor`, `publisher`, `super_admin` |

### 3.3 Back-Office Operations Routes $\rightarrow$ `apps/admin`

| Current File Path (`src/app/...`) | Current URL | Target App & Route (`apps/admin/src/app/[locale]/...`) | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `src/app/[locale]/(admin)/admin/layout.tsx` | `/admin/*` | `apps/admin/src/app/[locale]/(ops)/layout.tsx` | `admin`, `sales_crm`, `support_agent`, `marketing`, `read_only`, `super_admin` |
| `src/app/[locale]/(admin)/admin/page.tsx` | `/admin` | `apps/admin/src/app/[locale]/(ops)/page.tsx` | Role-dispatched home dashboard |
| `src/app/[locale]/(admin)/admin/learners/page.tsx` | `/admin/learners` | `apps/admin/src/app/[locale]/(ops)/learners/page.tsx` | `admin`, `support_agent`, `sales_crm` (masked), `super_admin` |
| `src/app/[locale]/(admin)/admin/sales/orders/page.tsx` | `/admin/sales/orders` | `apps/admin/src/app/[locale]/(ops)/sales/orders/page.tsx` | `admin`, `sales_crm`, `super_admin` |
| `src/app/[locale]/(admin)/admin/sales/leads/page.tsx` | `/admin/sales/leads` | `apps/admin/src/app/[locale]/(ops)/leads/page.tsx` & `/appointments/page.tsx` | `admin`, `sales_crm`, `super_admin` |
| *(Extracted from learners/leads)* | N/A | `apps/admin/src/app/[locale]/(ops)/support/page.tsx` | `admin`, `support_agent`, `super_admin` |
| `src/app/[locale]/(admin)/admin/marketing/banners/page.tsx` | `/admin/marketing/banners` | `apps/admin/src/app/[locale]/(ops)/banners/page.tsx` & `/campaigns/page.tsx` | `admin`, `marketing`, `super_admin` |
| `src/app/[locale]/(admin)/admin/marketing/coupons/page.tsx` | `/admin/marketing/coupons` | `apps/admin/src/app/[locale]/(ops)/coupons/page.tsx` | `admin`, `marketing`, `super_admin` |
| `src/app/[locale]/(admin)/admin/analytics/page.tsx` | `/admin/analytics` | `apps/admin/src/app/[locale]/(ops)/analytics/page.tsx` & `/reports/page.tsx` | `admin`, `marketing`, `read_only`, `super_admin` |
| `src/app/[locale]/(admin)/admin/content/lessons/page.tsx` | `/admin/content/*` | `apps/admin/src/app/[locale]/(ops)/content-health/page.tsx` | `admin`, `read_only`, `super_admin` |
| `src/app/[locale]/(admin)/admin/settings/page.tsx` | `/admin/settings` | `apps/admin/src/app/[locale]/(ops)/settings/page.tsx` | Basic operational settings (`admin`, `super_admin`) |
| `src/app/[locale]/(admin)/admin/login/page.tsx` | `/admin/login` | `apps/admin/src/app/[locale]/login/page.tsx` (and `apps/teach/src/app/[locale]/login/page.tsx`) | Staff sign-in surface |
| `src/app/[locale]/(admin)/admin/2fa/page.tsx` | `/admin/2fa` | `apps/admin/src/app/[locale]/2fa/page.tsx` (and `apps/teach/src/app/[locale]/2fa/page.tsx`) | Staff TOTP verification |
| `src/app/[locale]/(admin)/admin/unauthorized/page.tsx` | `/admin/unauthorized` | `apps/*/src/app/[locale]/forbidden/page.tsx` | 403 surface access denied page |

### 3.4 System Area Routes $\rightarrow$ `apps/admin` (`/system/**` — `super_admin` ONLY)

| Current File Path (`src/app/...`) | Current URL | Target Route (`apps/admin/src/app/[locale]/(system)/system/...`) | Security Gate |
| :--- | :--- | :--- | :--- |
| `src/app/[locale]/(admin)/admin/settings/roles/page.tsx` | `/admin/settings/roles` | `/system/roles` & `/system/permissions` | `super_admin` + 2FA + Re-auth ($\le 10\text{m}$) |
| `src/app/[locale]/(admin)/admin/settings/staff/page.tsx` | `/admin/settings/staff` | `/system/staff` | `super_admin` + 2FA + Re-auth ($\le 10\text{m}$) |
| `src/app/[locale]/(admin)/admin/audit-logs/page.tsx` & `settings/audit-log/page.tsx` | `/admin/audit-logs` | `/system/audit-log` | `super_admin` + 2FA + Re-auth ($\le 10\text{m}$) |
| `src/app/[locale]/(admin)/admin/health/page.tsx` | `/admin/health` | `/system/security-audit` & `/system/backups` | `super_admin` + 2FA + Re-auth ($\le 10\text{m}$) |
| *(Extracted from `admin/settings/page.tsx`)* | `/admin/settings` | `/system/integrations`, `/system/payment-keys`, `/system/feature-flags`, `/system/maintenance`, `/system/impersonation` | `super_admin` + 2FA + Re-auth ($\le 10\text{m}$) |

---

## 4. API Routes Audit & Target App Mapping

| Current API Route | HTTP Methods | Target App & Path | Allowed Surface & Roles |
| :--- | :--- | :--- | :--- |
| `src/app/api/ai/honey/route.ts` | `POST` | `apps/web/src/app/api/ai/honey/route.ts` | `web` (`learner`, `guest` rate-limited) |
| `src/app/api/analytics/route.ts` | `POST` | `apps/web/src/app/api/analytics/route.ts` | `web` (Learner telemetry ingestion) |
| `src/app/api/leads/route.ts` | `POST` | `apps/web/src/app/api/leads/route.ts` | `web` (Public consultation form submission) |
| `src/app/api/orders/route.ts` | `POST` | `apps/web/src/app/api/orders/route.ts` | `web` (`learner` checkout initiation) |
| `src/app/api/revalidate/route.ts` | `POST` | `apps/web/src/app/api/revalidate/route.ts` | `web` (HMAC-signed webhook from `teach`/`admin` publish events) |
| `src/app/api/admin/content/route.ts` | `GET, POST, PATCH` | `apps/teach/src/app/api/content/route.ts` | `teach` (`teacher`, `content_editor`, `publisher`, `super_admin`) |
| `src/app/api/admin/orders/route.ts` | `GET, PATCH` | `apps/admin/src/app/api/orders/route.ts` | `admin` (`admin`, `sales_crm`, `super_admin`) |
| `src/app/api/admin/leads/route.ts` | `GET, PATCH` | `apps/admin/src/app/api/leads/route.ts` | `admin` (`admin`, `sales_crm`, `super_admin`) |
| `src/app/api/admin/marketing/route.ts` | `GET, POST, PATCH` | `apps/admin/src/app/api/marketing/route.ts` | `admin` (`admin`, `marketing`, `super_admin`) |
| `src/app/api/admin/audit/route.ts` | `GET, POST` | `apps/admin/src/app/api/system/audit/route.ts` | `admin (/system)` (`super_admin` for full query) |
| `src/app/api/admin/cron/route.ts` | `GET, POST` | `apps/admin/src/app/api/system/cron/route.ts` | `admin (/system)` (Signed cron / `super_admin`) |

---

## 5. Components, Features & Libraries Extraction Map (`packages/*`)

### 5.1 `packages/ui` (`@junghyeon/ui`)
Pure design system components and CSS tokens (Zero imports from `auth`, `db`, or `apps/*`):
- `src/styles/tokens.css`, `src/styles/globals.css`, `src/styles/admin-tokens.css`
- `src/components/shared/Badge.tsx`, `BrandLogo.tsx`, `Button.tsx`, `Card.tsx`, `Chip.tsx`, `Count.tsx`, `Delta.tsx`, `FeaturePanel.tsx`, `LevelBadge.tsx`, `MascotHoney.tsx`, `MockupFrame.tsx`, `Num.tsx`, `Percent.tsx`, `Phone.tsx`, `Price.tsx`, `ProBadge.tsx`, `ProgressBar.tsx`, `ScrollHintButton.tsx`, `ScrollReveal.tsx`, `SectionHeading.tsx`, `StatBand.tsx`, `TopAnnouncementBanner.tsx`, `UnderlineTabs.tsx`
- `src/components/admin/StatCard.tsx` (generic metric card without restricted business logic)
- `src/lib/utils.ts` (`cn` helper)

### 5.2 `packages/content-renderer` (`@junghyeon/content-renderer`)
Shared learner content renderers used by `apps/web` AND by live preview panes in `apps/teach` & `apps/admin`:
- `src/components/lesson/LessonTheory.tsx`, `LessonExercises.tsx`, `LessonHeader.tsx`
- `src/components/roadmap/RoadmapNodeMap.tsx`, `RoadmapTheoryLibrary.tsx`, `LessonPreviewModal.tsx`
- New granular exports: `BlockRenderer`, `LessonTimelineCard`, `LevelCard`, `CollectionCard`, `VocabularyRow`, `GrammarPointView`

### 5.3 `packages/features` (`@junghyeon/features`)
Pure domain logic, formatters, SM-2 algorithm, and Zod schemas:
- `src/lib/format.ts` (lining figures `tabular-nums`, Vietnamese date `dd/MM/yyyy`, currency formatters)
- `src/lib/srs/sm2.ts` (SM-2 spaced repetition algorithm)
- `src/features/profile/completeness.ts`, `mascot-svg.ts`, `reference-data.ts`, `schemas.ts`, `types.ts`
- `src/features/analytics/tracker.ts` & `src/types/analytics.types.ts`
- `src/lib/utils/speech.ts` (Web Speech API Korean TTS wrapper)

### 5.4 `packages/rbac` (`@junghyeon/rbac`)
Canonical permission registry, role $\rightarrow$ surface map, navigation manifests, field policies, and PII masking:
- `src/features/rbac/registry.ts`
- `src/features/auth-rbac/permissions.ts`, `types.ts`
- `src/lib/utils/masking.ts` (`maskEmail`, `maskPhone`, `maskPaymentKey`)
- New modules: `surfaces.ts` (Role $\rightarrow$ Surface matrix), `nav-manifests.ts` (per-surface sidebar & command palette manifests), `home-manifests.ts` (role home widget manifests)

### 5.5 `packages/auth` (`@junghyeon/auth`)
Supabase SSR clients, cross-subdomain SSO cookie configuration, middleware surface guards, step-up re-auth, and 2FA verifiers:
- `src/lib/supabase/client.ts` & `src/lib/supabase.ts`
- `src/features/auth-rbac/require-permission.ts`
- `src/features/auth-rbac/AdminAuthContext.tsx` & `src/lib/context/AuthContext.tsx`
- New modules: `sso-cookie.ts`, `surface-middleware.ts`, `reauth.ts`, `impersonation.ts`

### 5.6 `packages/db` (`@junghyeon/db`)
Generated Supabase types, typed query helpers, and repository-level data services:
- `src/types/database.types.ts`, `src/types/admin.types.ts`
- `src/lib/data/lessons-data.ts`, `placement-test-data.ts`, `products-data.ts`, `roadmap-data.ts`, `theory-collections-data.ts`
- `src/lib/services/theory-storage-service.ts`
- `src/features/audit/audit-service.ts`

### 5.7 `packages/i18n` (`@junghyeon/i18n`)
- `messages/vi.json`, `messages/en.json` (split into shared + per-surface namespaces `web`, `teach`, `admin`)
- `src/lib/i18n/I18nContext.tsx`, `src/lib/i18n/translations.ts`
- `docs/glossary.md`

### 5.8 `packages/config` (`@junghyeon/config`)
- `config/brand.ts`
- Shared `tsconfig.base.json`, `tailwind.preset.ts`, `eslint-preset.js` (with `eslint-plugin-boundaries`), and per-app Zod environment validators (`env.web.ts`, `env.teach.ts`, `env.admin.ts`).

### 5.9 App-Exclusive Modules (Never in Shared Packages!)
- **`apps/web` only**: `Header.tsx`, `Footer.tsx`, `BottomNavigation.tsx`, `HeroSection.tsx`, `FeaturesBlock.tsx`, `JungHyeonTreeBlock.tsx`, `PricingPreviewBlock.tsx`, `QuickConsultationBlock.tsx`, `RoadmapSummaryBlock.tsx`, `TestimonialsBlock.tsx`, `FaqBlock.tsx`, `ContinueLearningBlock.tsx`, `HoneyChatbot.tsx`, `PlacementTestModal.tsx`, `CheckoutModal.tsx`, `StudySession.tsx`, `CreateDeckModal.tsx`, `ProfileSummaryCard.tsx`, `SectionCard.tsx`, `SettingsNav.tsx`, `StickySaveBar.tsx`, `AvatarCropModal.tsx`, `MascotGalleryModal.tsx`.
- **`apps/teach` only**: `src/features/teacher-studio/teacher-service.ts`, `src/features/teacher-studio/types.ts`, `src/features/content-publishing/content-service.ts` (authoring/review workflow), Teacher Studio shell & class/grading views.
- **`apps/admin` only**: `src/features/sales/orders-service.ts` (revenue & refund approval), `src/features/crm/leads-service.ts`, `src/features/marketing/marketing-service.ts`, `AdminSidebar.tsx`, `AdminHeader.tsx`, `AdminCommandPalette.tsx`, and all `/system/**` modules (role matrix editor, payment key vault, feature flags, impersonation).

---

## 6. Environment Variables Audit & Per-App Scoping

Each app validates its environment at build/startup via Zod (`packages/config/src/env.*.ts`). **Build fails if a forbidden secret is present in `apps/web` or `apps/teach`.**

| Environment Variable | `apps/web` | `apps/teach` | `apps/admin` | Security Classification & Rule |
| :--- | :---: | :---: | :---: | :--- |
| `NEXT_PUBLIC_SURFACE` | `"web"` | `"teach"` | `"admin"` | Build-time constant identifying current surface |
| `NEXT_PUBLIC_WEB_URL` | Required | Required | Required | Used for cross-surface switcher links |
| `NEXT_PUBLIC_TEACH_URL` | Required | Required | Required | Used for cross-surface switcher links |
| `NEXT_PUBLIC_ADMIN_URL` | Required | Required | Required | Used for cross-surface switcher links |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Required | Required | Shared Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | Required | Required | Public anon key (enforced by RLS) |
| `SSO_COOKIE_DOMAIN` | `.junghyeon.com` | `.junghyeon.com` | `.junghyeon.com` | `.localhost` in local dev |
| `ANTHROPIC_API_KEY` | Server-only | Server-only | Optional | Used by `/api/ai/honey` on `web` and AI authoring assist on `teach` |
| `REVALIDATION_SECRET` | Server-only (Verify) | Server-only (Sign) | Server-only (Sign) | HMAC secret for `POST /api/revalidate` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Allowed | **FORBIDDEN** | Allowed | Client checkout initiator on `web` |
| `SUPABASE_SERVICE_ROLE_KEY` | **FORBIDDEN** | **FORBIDDEN** | **Server-only** | Narrowly scoped admin/system RPCs only |
| `SEPAY_API_KEY` | **FORBIDDEN** | **FORBIDDEN** | **Server-only** | Payment reconciliation & webhook verification |
| `PAYOS_CLIENT_ID` / `API_KEY` / `CHECKSUM_KEY` | **FORBIDDEN** | **FORBIDDEN** | **Server-only** | Payment gateway credentials |
| `STRIPE_SECRET_KEY` | **FORBIDDEN** | **FORBIDDEN** | **Server-only** | Payment refunds & secret operations |
| `TELEGRAM_BOT_TOKEN` / `CHAT_ID` | **FORBIDDEN** | **FORBIDDEN** | **Server-only** | Ops alerts |
| `RESEND_API_KEY` | Server-only (Transactional) | Server-only | Server-only | Email notifications |
| `ADMIN_BOOTSTRAP_EMAIL` | **FORBIDDEN** | **FORBIDDEN** | **Server-only** | Super admin bootstrap |
| `ADMIN_REQUIRE_2FA` | **FORBIDDEN** | Required (`true`) | Required (`true`) | Enforces TOTP on staff surfaces |
| `ADMIN_DEV_PERSONA` | **FORBIDDEN** | **FORBIDDEN** | Dev-only (`false` in prod) | Guarded by `NODE_ENV !== 'production'` + `super_admin` |

---

## 7. Open Decisions (`TODO:` Markers)

- `TODO(dns)`: Finalize production root domain (`junghyeon.com` vs `junghyeon.vn` vs `junghyeon.edu.vn`) for `SSO_COOKIE_DOMAIN`.
- `TODO(rbac-2fa)`: Confirm whether `read_only` executive observer accounts require mandatory TOTP 2FA on `admin.junghyeon.com` or allow SSO-only read access.
- `TODO(zero-trust)`: Decide whether to place `admin.junghyeon.com/system/*` behind Cloudflare Access / static IP allowlist in addition to application-level `super_admin` + TOTP + 10-minute re-authentication.
