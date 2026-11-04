# Monorepo Migration Progress Tracker (Source of Truth)

> **Mode**: `CHECKPOINT` (Pause after M-2, M-4, M-6, M-8)  
> **Last Updated**: 2026-11-04T16:40:30+07:00  
> **Active Phase**: `M-4` (`done`) $\rightarrow$ Waiting at **CHECKPOINT 2** before `M-5`

---

## Phase Summary Matrix

| Phase | Title | Status | Date | Git Tag (Before / Done) | Gate Results | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-0** | Repository Audit & Surface Architecture Docs | `done` | 2026-11-04 | `pre-m0-audit` / `m-0-done` | `tsc --noEmit` PASS; Docs complete | Proceed to M-1 |
| **M-1** | Monorepo Skeleton (`pnpm`, `turbo`) & Move to `apps/web` | `done` | 2026-11-04 | `before-m-1` / `m-1-done` | `pnpm install`, `typecheck`, `lint`, `test`, `build` PASS | Proceed to M-2 |
| **M-2** | Extract Shared Packages (`ui`, `content-renderer`, `features`, `auth`, `rbac`, `db`, `i18n`, `config`, `testing`) | `done` | 2026-11-04 | `before-m-2` / `m-2-done` | All 10 workspaces `typecheck`/`lint`/`test` PASS; 0 cycles; `apps/web` build + HTTP 200/403 smoke tests PASS | Approved at Checkpoint 1 |
| **M-3** | Create `apps/admin` (Port 3002) & Transitional Redirects | `done` | 2026-11-04 | `before-m-3` / `m-3-done` | All 11 workspaces `typecheck`/`lint`/`test` PASS; `apps/web` & `apps/admin` builds PASS; `smoke-m3.mjs` 200/308/403 PASS | Proceed to M-4 |
| **M-4** | Create `apps/teach` (Port 3001) & Remove Teacher Routes from Admin | `done` | 2026-11-04 | `before-m-4` / `m-4-done` | All 12 workspaces `typecheck`/`lint`/`test` PASS; `apps/web`, `apps/teach`, `apps/admin` builds PASS; `smoke-m4.mjs` 200/308/403 PASS | **CHECKPOINT 2 reached** (Wait for `continue` to start M-5) |
| **M-5** | Cross-Subdomain SSO, Surface Guard, Switcher & 403 Pages | `todo` | - | `before-m-5` / `m-5-done` | Pending | Proceed to M-6 |
| **M-6** | System Area (`/system/**`) with `super_admin`, Re-Auth & 2FA | `todo` | - | `before-m-6` / `m-6-done` | Pending | **CHECKPOINT 3 after M-6** |
| **M-7** | Enforce Boundaries (ESLint + Bundle Check + Surface RLS) | `todo` | - | `before-m-7` / `m-7-done` | Pending | Proceed to M-8 |
| **M-8** | Deployment Pipelines, Staging/Prod Configs & Runbook | `todo` | - | `before-m-8` / `m-8-done` | Pending | **CHECKPOINT 4 after M-8** |
| **M-9** | Full E2E Surface Matrix, API/RLS Tests & Final Hardening | `todo` | - | `before-m-9` / `m-9-done` | Pending | Final Release |

---

## Detailed Phase Logs

### Phase M-0: Repository Audit & Architecture Docs (`done`)
- **Date**: 2026-11-04 | **Tags**: `pre-m0-audit`, `m-0-done`
- **Summary**: Created `docs/surfaces.md`, `docs/architecture.md`, `docs/auth-sso.md`, `docs/deployment.md`.

### Phase M-1: Monorepo Skeleton & Move to `apps/web` (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-1`, `m-1-done`
- **Summary**: Configured `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`; moved root app into `apps/web` via `git mv` (100% history preserved); added canonical learner routes (`/theory`, `/shop`, `/consulting`, `/auth`).

### Phase M-2: Extract Shared Packages (`packages/*`) (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-2`, `m-2-done`
- **Summary**: Extracted 9 workspace packages (`config`, `i18n`, `features`, `ui`, `rbac`, `db`, `auth`, `content-renderer`, `testing`); verified 0 circular dependencies and passed `smoke-m2.mjs`.

### Phase M-3: Create `apps/admin` (Port 3002) & Transitional Redirects (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-3`, `m-3-done`
- **Files Moved/Changed**:
  - Scaffolded `apps/admin` (`@junghyeon/admin`, port `3002`, `noindex, nofollow`, `robots.txt: Disallow: /`).
  - Moved `/[locale]/(admin)/admin/**`, `/api/admin/**`, and `src/components/admin/**` from `apps/web` to `apps/admin` via `git mv` (100% git rename history preserved).
  - Added canonical top-level rewrites in `apps/admin/src/middleware.ts` (`/learners`, `/sales/orders`, `/leads`, `/appointments`, `/support`, `/campaigns`, `/banners`, `/coupons`, `/analytics`, `/reports`, `/content-health`, `/settings`, `/system/**`).
  - Added transitional `308` permanent redirects from `apps/web/admin/*` to `NEXT_PUBLIC_ADMIN_URL` in `apps/web/src/middleware.ts`.
- **Gate Results**: All 11 workspaces passed `typecheck`/`lint`/`test`; `apps/web` (`:3000`) and `apps/admin` (`:3002`) production builds and `smoke-m3.mjs` passed.

### Phase M-4: Create `apps/teach` (Port 3001) & Remove Teacher Routes from Admin (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-4`, `m-4-done`
- **Files Moved/Changed**:
  - Scaffolded `apps/teach` (`@junghyeon/teach`, port `3001`, `noindex, nofollow`, `robots.txt: Disallow: /`).
  - Moved `teaching/**` and `publishing/**` from `apps/admin` to `apps/teach` via `git mv`.
  - Configured canonical Teacher Studio routes in `apps/teach` (`/`, `/lessons`, `/lessons/new`, `/lessons/[id]/edit`, `/banks/vocabulary`, `/banks/grammar`, `/roadmap-planner`, `/review-feedback`, `/classes`, `/grading`, `/analytics`, `/media`).
  - Removed Teacher Studio navigation items from `apps/admin/src/components/admin/AdminSidebar.tsx` and added `308` permanent redirects in `apps/admin/src/middleware.ts` from `/admin/teaching/*` and `/admin/publishing` to `NEXT_PUBLIC_TEACH_URL`.
- **Gate Results**:
  - `pnpm install`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` (all 12 workspaces) — PASS (0 errors).
  - Production builds for `apps/web`, `apps/teach`, `apps/admin` — PASS.
  - Three-Surface HTTP Smoke Test (`smoke-m4.mjs`) — PASS (`apps/web` `:3000` 8/8 routes `200`; `apps/teach` `:3001` 12/12 Studio routes `200` + `403` for `learner`, `sales_crm`, `support_agent`, `marketing`, `read_only`; `apps/admin` `:3002` 10/10 back-office & `/system` routes `200` + `308` redirect on `/admin/teaching/lessons` + `403` for `teacher`).
- **Risks & Open TODOs**:
  - Next phase (`M-5`) will wire Cross-Subdomain SSO cookies (`Domain=.junghyeon.com` in prod, host-only in localhost), Surface Guard middleware, the multi-surface Top-bar Surface Switcher (`packages/ui/SurfaceSwitcher`), and dedicated `403 Surface Denied` pages across all three apps.
