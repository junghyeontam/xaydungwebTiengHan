# Monorepo Migration Progress Tracker (Source of Truth)

> **Mode**: `CHECKPOINT` (Pause after M-2, M-4, M-6, M-8)  
> **Last Updated**: 2026-11-04T23:01:00+07:00  
> **Active Phase**: `M-8` (`done`) $\rightarrow$ Waiting at **CHECKPOINT 4** before `M-9`

---

## Phase Summary Matrix

| Phase | Title | Status | Date | Git Tag (Before / Done) | Gate Results | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-0** | Repository Audit & Surface Architecture Docs | `done` | 2026-11-04 | `pre-m0-audit` / `m-0-done` | `tsc --noEmit` PASS; Docs complete | Proceed to M-1 |
| **M-1** | Monorepo Skeleton (`pnpm`, `turbo`) & Move to `apps/web` | `done` | 2026-11-04 | `before-m-1` / `m-1-done` | `pnpm install`, `typecheck`, `lint`, `test`, `build` PASS | Proceed to M-2 |
| **M-2** | Extract Shared Packages (`ui`, `content-renderer`, `features`, `auth`, `rbac`, `db`, `i18n`, `config`, `testing`) | `done` | 2026-11-04 | `before-m-2` / `m-2-done` | All 10 workspaces `typecheck`/`lint`/`test` PASS; 0 cycles; `apps/web` build + HTTP 200/403 smoke tests PASS | Approved at Checkpoint 1 |
| **M-3** | Create `apps/admin` (Port 3002) & Transitional Redirects | `done` | 2026-11-04 | `before-m-3` / `m-3-done` | All 11 workspaces `typecheck`/`lint`/`test` PASS; `apps/web` & `apps/admin` builds PASS; `smoke-m3.mjs` 200/308/403 PASS | Proceed to M-4 |
| **M-4** | Create `apps/teach` (Port 3001) & Remove Teacher Routes from Admin | `done` | 2026-11-04 | `before-m-4` / `m-4-done` | All 12 workspaces `typecheck`/`lint`/`test` PASS; `apps/web`, `apps/teach`, `apps/admin` builds PASS; `smoke-m4.mjs` 200/308/403 PASS | Approved at Checkpoint 2 |
| **M-5** | Cross-Subdomain SSO, Surface Guard, Switcher & 403 Pages | `done` | 2026-11-04 | `before-m-5` / `m-5-done` | All 12 workspaces `typecheck`/`lint`/`test`/`build` PASS; `smoke-m5.mjs` SSO cookies + 403 SurfaceDeniedView PASS | Approved at Checkpoint 3 |
| **M-6** | System Area (`/system/**`) with `super_admin`, Re-Auth & 2FA | `done` | 2026-11-04 | `before-m-6` / `m-6-done` | All 12 workspaces `typecheck`/`lint`/`test`/`build` PASS; `smoke-m6.mjs` 11/11 `/system/*` routes + Step-Up Re-Auth <=15m + 15m Read-Only Impersonation PASS | Approved at Checkpoint 3 |
| **M-7** | Enforce Boundaries (ESLint + Bundle Check + Surface RLS) | `done` | 2026-11-04 | `before-m-7` / `m-7-done` | ESLint boundary rules in all 3 apps; pure packages isolation; client bundle secret scan PASS (0 leaks); surface RLS migration added | Proceed to M-8 |
| **M-8** | Deployment Pipelines, Staging/Prod Configs & Runbook | `done` | 2026-11-04 | `before-m-8` / `m-8-done` | `vercel.json` configs; `.env.example` matrices; `.github/workflows/ci.yml`; multi-stage `Dockerfile`; `docs/deployment-runbook.md`; `smoke-m8.mjs` PASS | **CHECKPOINT 4 reached** (Wait for `continue` to start M-9) |
| **M-9** | Full E2E Surface Matrix, API/RLS Tests & Final Hardening | `todo` | - | `before-m-9` / `m-9-done` | Pending | Final Release |

---

## Detailed Phase Logs

### Phase M-0..M-6 (`done`)
- **Tags**: `pre-m0-audit`..`m-6-done`. Extracted shared packages, separated `apps/web`, `apps/teach`, `apps/admin`, wired cross-subdomain SSO, and built the `/system/**` privileged area with Step-Up Re-Auth.

### Phase M-7: Enforce Boundaries (ESLint + Bundle Check + Surface RLS) (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-7`, `m-7-done`
- **Files Moved/Changed**:
  - Configured strict ESLint `no-restricted-imports` in `apps/web/.eslintrc.json`, `apps/teach/.eslintrc.json`, and `apps/admin/.eslintrc.json` preventing any cross-app sibling imports.
  - Enhanced `packages/testing/scripts/check-no-cycles.mjs` with full boundary scanning: 0 cross-app imports across all 3 apps, pure packages (`ui`, `content-renderer`, `features`, `i18n`, `config`) verified never importing `auth`, `db`, `rbac`, or apps, and 0 circular dependencies.
  - Cleansed `@junghyeon/config` and `@junghyeon/db` barrels by splitting client-safe constants from server-only services (`@junghyeon/db/supabase-server`), guaranteeing 0 client bundle secret leaks in `apps/web`.
  - Added `supabase/migrations/20261104010000_surface_boundary_rls_policies.sql` defining Default-Deny surface RLS policies for learner, teacher, admin, and system surfaces.
  - Added `packages/testing/scripts/test-boundaries.mjs` unit tests verifying the 24 role-surface combinations, mandatory 2FA enforcement, and system re-auth expiration.

### Phase M-8: Deployment Pipelines, Staging/Prod Configs & Runbook (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-8`, `m-8-done`
- **Files Moved/Changed**:
  - Created `apps/web/vercel.json`, `apps/teach/vercel.json`, and `apps/admin/vercel.json` with `.next` output and `noindex, nofollow, noarchive` security headers on staff surfaces.
  - Created `apps/web/.env.example`, `apps/teach/.env.example`, and `apps/admin/.env.example` documenting surface variables and strictly forbidden keys.
  - Created `.github/workflows/ci.yml` with parallel typecheck, ESLint, boundary scans, unit tests, and production builds across all 3 apps.
  - Created root multi-stage `Dockerfile` supporting `docker build --build-arg APP_NAME=web|teach|admin`.
  - Created `docs/deployment-runbook.md` with complete DNS, Supabase single-project auth/cookie settings, zero-downtime deployment order, and rollback strategies.
  - Added `packages/testing/scripts/smoke-m8.mjs` and verified all deployment artifacts.
- **Gate Results**:
  - `pnpm -r run typecheck`, `pnpm -r run lint`, `pnpm -r run test`, `pnpm run build` — ALL PASS across all 12 workspaces.
  - `smoke-m8.mjs` — PASS (all deployment configs and runbooks valid).
