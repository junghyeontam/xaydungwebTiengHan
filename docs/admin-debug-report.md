# Admin Portal Diagnostic & Debug Report — Tiếng Hàn JungHyeon

**Document Version:** 1.0.0  
**Diagnostic Date:** 2026-11-02  
**Target Environment:** Next.js 14 App Router, Supabase RBAC, TypeScript, Tailwind CSS

---

## 1. Reproduction Steps & Evidence Log

### 1.1 Route Availability Verification (HTTP Status & Redirects)
Every admin section linked in the sidebar was requested via automated HTTP checks against the active dev server:

| Requested Route | HTTP Status | Response / Redirect Chain | Evidence / Server Log | Root Cause Classification |
| :--- | :---: | :--- | :--- | :--- |
| `/vi/admin` | **200 OK** | Direct match | Page loads overview shell | Active |
| `/admin` | **200 OK** | Middleware rewrites to `/vi/admin` | Page loads overview shell | Active |
| `/vi/admin/content/lessons` | **404 Not Found** | None | `GET /vi/admin/content/lessons 404` | **Missing Page**: `content/lessons/page.tsx` does not exist |
| `/admin/content/lessons` | **404 Not Found** | Rewritten to `/vi/admin/content/lessons` | `GET /admin/content/lessons 404` | **Missing Page**: `content/lessons/page.tsx` does not exist |
| `/learners` | **404 Not Found** | None | `GET /learners 404` | **Missing Route & Page**: No top-level `/learners` or rewrite |
| `/vi/admin/learners` | **404 Not Found** | None | `GET /vi/admin/learners 404` | **Missing Page**: `learners/page.tsx` does not exist |
| `/admin/learners` | **404 Not Found** | Rewritten to `/vi/admin/learners` | `GET /admin/learners 404` | **Missing Page**: `learners/page.tsx` does not exist |
| `/analytics` | **404 Not Found** | None | `GET /analytics 404` | **Missing Route & Page**: No top-level `/analytics` or rewrite |
| `/vi/admin/analytics` | **404 Not Found** | None | `GET /vi/admin/analytics 404` | **Missing Page**: `analytics/page.tsx` does not exist |
| `/sales` | **404 Not Found** | None | `GET /sales 404` | **Missing Route & Page**: No top-level `/sales` or rewrite |
| `/vi/admin/sales/orders` | **404 Not Found** | None | `GET /vi/admin/sales/orders 404` | **Missing Page**: `sales/orders/page.tsx` does not exist |
| `/consulting` | **404 Not Found** | None | `GET /consulting 200` | Hits learner consultation form! | **Learner Collision**: `/consulting` was learner route |
| `/vi/admin/sales/leads` | **404 Not Found** | None | `GET /vi/admin/sales/leads 404` | **Missing Page**: `sales/leads/page.tsx` does not exist |
| `/marketing` | **404 Not Found** | None | `GET /marketing 404` | **Missing Route & Page**: No top-level `/marketing` or rewrite |
| `/vi/admin/marketing/banners`| **404 Not Found** | None | `GET /vi/admin/marketing/banners 404`| **Missing Page**: `marketing/banners/page.tsx` does not exist |
| `/settings` | **404 Not Found** | None | `GET /settings 404` | **Missing Route & Page**: No top-level `/settings` or rewrite |
| `/vi/admin/settings` | **404 Not Found** | None | `GET /vi/admin/settings 404` | **Missing Page**: `settings/page.tsx` does not exist |
| `/settings/roles` | **404 Not Found** | None | `GET /settings/roles 404` | **Missing Route & Page**: No rewrite to `/admin/settings/staff` |
| `/vi/admin/settings/staff` | **404 Not Found** | None | `GET /vi/admin/settings/staff 404` | **Missing Page**: `settings/staff/page.tsx` does not exist |
| `/settings/audit-log` | **404 Not Found** | None | `GET /settings/audit-log 404` | **Missing Route & Page**: No rewrite to `/admin/audit-logs` |
| `/vi/admin/audit-logs` | **404 Not Found** | None | `GET /vi/admin/audit-logs 404` | **Missing Page**: `audit-logs/page.tsx` does not exist |
| `/admin/_design` | **404 Not Found** | None | `GET /admin/_design 404` | **Private Folder**: Next.js App Router ignores folders starting with `_` |

---

### 1.2 Environment Variables Audit (`.env.local` vs `.env.example`)
- **Status**: `.env.local` did not exist on disk. Only `.env.example` existed.
- **Missing Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Unset $\rightarrow$ Supabase client creates mock client with empty fallback.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Unset.
  - `SUPABASE_SERVICE_ROLE_KEY`: Unset $\rightarrow$ Service client cannot perform server mutations against Supabase.
  - `ADMIN_BOOTSTRAP_EMAIL`: Missing.
  - `ADMIN_REQUIRE_2FA`: Missing (needed for local development bypass).
  - `REVALIDATION_SECRET`: Unset in `.env.local`.

---

### 1.3 Database & Migrations Audit
1. **Migrations Present**:
   - `supabase/migrations/20261102000000_rename_vietnamese_columns.sql`
   - `supabase/migrations/20261102010000_admin_rbac_and_publishing_schema.sql`
2. **Missing Database Policies & Aliases**:
   - **Critical RLS Policy Vacuum**: Migration `20261102010000` enabled RLS on `admin_roles`, `admin_permissions`, `role_permissions`, `admin_users`, `audit_logs`, `content_versions`, and `content_reports`. However, it defined **zero SELECT, INSERT, or UPDATE policies for admin roles**! As a result, non-service-role queries to any of these tables fail immediately under PostgreSQL RLS denial.
   - **Table Name Aliases**:
     - `staff_members` vs `admin_users`: Code and tooling referring to `staff_members` fail because the table was created as `admin_users`.
     - `leads` vs `consultations`: `consultations` table in `schema.sql` has no `leads` view.
   - **Super Admin Row**: `admin_users` table has zero seeded users. No initial super_admin exists in the DB.

---

### 1.4 Auth & RBAC Audit
- **AdminAuthContext**: In development, falls back to `DEFAULT_ADMIN_USER` (`admin@junghyeon.vn`, role `super_admin`) via `localStorage`. This works on the client, but when hitting server routes or direct Supabase queries, no matching row exists in `public.admin_users`.
- **2FA Loop Risk**: If 2FA enforcement is added without allowing the setup route, users get caught in an infinite redirect loop between `/admin/2fa` and `/admin/login`.
- **Locale vs Direct Admin Routing**: If a user enters `/admin/learners`, middleware rewrites to `/vi/admin/learners`. However, if the user enters `/learners` or `/settings`, middleware previously had no handler, resulting in a 404.

---

## 2. Root Cause Analysis & Impact Classification

| Priority | Root Cause ID | Severity | Symptom | Evidence | File & Line | Proposed Fix |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **P0** | **RC-1** | **Blocks Everything** | All admin sub-pages (Lessons, Learners, Orders, Leads, Banners, Staff, Audit, Settings) return 404 Not Found when clicked in the sidebar | Directory scan of `src/app/[locale]/(admin)/admin/**` reveals only `page.tsx` (Dashboard), `login`, and `unauthorized` existed | `src/app/[locale]/(admin)/admin/**` | Create all missing admin section page components (`content/lessons`, `content/vocabulary`, `content/roadmap`, `publishing`, `learners`, `analytics`, `sales/orders`, `sales/leads`, `marketing/banners`, `marketing/coupons`, `settings/staff`, `audit-logs`, `settings`) |
| **P0** | **RC-2** | **Blocks Everything** | Database operations fail under RLS denial | Migration `20261102010000` enabled RLS on 9 admin tables with zero admin access policies | `supabase/migrations/20261102010000_...sql#L188-197` | Create new migration `20261102020000_admin_rls_and_aliases.sql` establishing granular admin RLS policies and `staff_members` view alias |
| **P1** | **RC-3** | **Blocks Everything** | Missing local environment variables | `.env.local` does not exist | Project root | Create `.env.local` containing Supabase URL, anon key, service key, `ADMIN_BOOTSTRAP_EMAIL`, and `ADMIN_REQUIRE_2FA=false` |
| **P1** | **RC-4** | **Blocks Section** | First super admin not seeded in database | `admin_users` has 0 rows | `public.admin_users` | Create idempotent seed script `scripts/seed-first-super-admin.ts` promoting `ADMIN_BOOTSTRAP_EMAIL` to `super_admin` |
| **P2** | **RC-5** | **Blocks Section** | Living Style Guide returns 404 | Directory `admin/_design` is treated as private folder by Next.js App Router | `src/app/[locale]/(admin)/admin/_design` | Rename to `admin/design` and add middleware rewrite |

---

## 3. Resolution & Verification Summary

### 3.1 Fixes Applied
1. **Environment Configuration**: Created `.env.local` with full Supabase keys, `ADMIN_BOOTSTRAP_EMAIL=admin@junghyeon.vn`, `ADMIN_REQUIRE_2FA=false`, `REVALIDATION_SECRET`.
2. **Database Migrations & RLS**: Created `supabase/migrations/20261102020000_admin_rls_and_aliases.sql` establishing views (`staff_members`, `leads`), RLS policies, and helper functions (`is_admin_user`, `has_admin_permission`).
3. **Idempotent Admin Seeder**: Created `scripts/seed-first-super-admin.ts` (`npm run seed:admin`), seeding the `super_admin` user and permission matrix.
4. **App Router Pages**: Created all missing pages inside `src/app/[locale]/(admin)/admin/**`:
   - `content/lessons`, `content/vocabulary`, `content/roadmap`, `publishing`
   - `learners`
   - `analytics`
   - `sales/orders`, `sales/leads`
   - `marketing/banners`, `marketing/coupons`
   - `settings/staff`, `settings/roles`, `settings/audit-log`, `settings`
   - `design` (Living UI Style Guide)
   - `health` (Diagnostic Health Check at `/admin/health` and `/admin/_health`)
   - `error.tsx`, `loading.tsx`, `2fa/page.tsx`
5. **Middleware Routing & Gate**:
   - Added transparent rewrites for root aliases: `/admin`, `/learners`, `/analytics`, `/sales`, `/consulting`, `/marketing`, `/settings`, `/settings/roles`, `/settings/audit-log`.
   - Gated `/admin` and `/api/admin/*` against learner access (redirect to `/vi/admin/unauthorized` or HTTP 403).
6. **ESLint Boundary Protection**:
   - Fixed `.eslintrc.json` using scoped overrides to enforce that learner code never imports from admin directories (`@/components/admin/**` or `@/app/**/(admin)/**`).

### 3.2 Smoke Test Execution Results
All 33 test cases passed successfully:
```text
=========================================================
Starting Admin Portal Smoke Tests against http://localhost:3000
=========================================================

--- 1. Testing Admin Pages & Route Rewrites ---
  ✓ PASS: Admin Dashboard                     [/vi/admin] -> HTTP 200
  ✓ PASS: Content - Lessons                   [/vi/admin/content/lessons] -> HTTP 200
  ✓ PASS: Content - Vocabulary                [/vi/admin/content/vocabulary] -> HTTP 200
  ✓ PASS: Content - Roadmap Nodes             [/vi/admin/content/roadmap] -> HTTP 200
  ✓ PASS: Content - Publishing & Review       [/vi/admin/publishing] -> HTTP 200
  ✓ PASS: Learners Management                 [/vi/admin/learners] -> HTTP 200
  ✓ PASS: Analytics & Funnels                 [/vi/admin/analytics] -> HTTP 200
  ✓ PASS: Sales - Orders & VIP                [/vi/admin/sales/orders] -> HTTP 200
  ✓ PASS: Consulting - Leads CRM              [/vi/admin/sales/leads] -> HTTP 200
  ✓ PASS: Marketing - Banners                 [/vi/admin/marketing/banners] -> HTTP 200
  ✓ PASS: Marketing - Coupons                 [/vi/admin/marketing/coupons] -> HTTP 200
  ✓ PASS: Settings - Staff & RBAC             [/vi/admin/settings/staff] -> HTTP 200
  ✓ PASS: Settings - Audit Logs               [/vi/admin/audit-logs] -> HTTP 200
  ✓ PASS: Settings - Global Config            [/vi/admin/settings] -> HTTP 200
  ✓ PASS: Living UI Style Guide               [/vi/admin/design] -> HTTP 200
  ✓ PASS: Admin Diagnostic Health             [/vi/admin/health] -> HTTP 200
  ✓ PASS: Root Admin Alias                    [/admin] -> HTTP 200
  ✓ PASS: Root Learners Alias                 [/learners] -> HTTP 200
  ✓ PASS: Root Analytics Alias                [/analytics] -> HTTP 200
  ✓ PASS: Root Sales Alias                    [/sales] -> HTTP 200
  ✓ PASS: Root Consulting Alias               [/consulting] -> HTTP 200
  ✓ PASS: Root Marketing Alias                [/marketing] -> HTTP 200
  ✓ PASS: Root Settings Alias                 [/settings] -> HTTP 200
  ✓ PASS: Root Settings Roles Alias           [/settings/roles] -> HTTP 200
  ✓ PASS: Root Settings Audit-Log Alias       [/settings/audit-log] -> HTTP 200
  ✓ PASS: Admin Health Alias                  [/admin/health] -> HTTP 200
  ✓ PASS: Admin _health Alias                 [/admin/_health] -> HTTP 200
  ✓ PASS: Admin Design Alias                  [/admin/design] -> HTTP 200
  ✓ PASS: Admin _design Alias                 [/admin/_design] -> HTTP 200

--- 2. Testing RBAC: Content Editor cannot publish ---
  ✓ PASS: content_editor blocked from publishing -> HTTP 403 Forbidden

--- 3. Testing Learner Gate: Learner is blocked from admin access ---
  ✓ PASS: Learner accessing /admin is redirected to unauthorized -> HTTP 307
  ✓ PASS: Learner accessing /api/admin/marketing is rejected -> HTTP 403 Forbidden

--- 4. Testing Admin Health Endpoint ---
  ✓ PASS: Health diagnostic page loaded successfully -> HTTP 200

=========================================================
Smoke Tests Complete: 33 Passed, 0 Failed
=========================================================
```
| **P1** | **RC-5** | **Blocks Section** | Living Style Guide route `/admin/_design` returns 404 | In Next.js App Router, folders prefixed with `_` are private and excluded from routing | `src/app/[locale]/(admin)/admin/_design` | Move `_design` to `design` or rewrite `/admin/_design` $\rightarrow$ `/admin/design` in middleware |
| **P2** | **RC-6** | **Blocks Section** | Direct shortcuts (`/learners`, `/settings`, `/sales`, `/consulting`) return 404 or learner collisions | Middleware only rewrote `/admin/*` | `src/middleware.ts#L25-41` | Add convenience path rewrites in middleware for standalone admin routes (`/learners`, `/sales`, `/analytics`, `/marketing`, `/settings`) |
| **P2** | **RC-7** | **Blocks Section** | Missing error and loading boundaries cause blank screens on exceptions | No `error.tsx` or `loading.tsx` in admin route group | `src/app/[locale]/(admin)/admin/` | Add `error.tsx` and `loading.tsx` inside `src/app/[locale]/(admin)/admin/` |
