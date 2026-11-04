# Monorepo Migration Progress Tracker (Source of Truth)

> **Mode**: `CHECKPOINT` (All Checkpoints Complete!)  
> **Last Updated**: 2026-11-04T23:38:00+07:00  
> **Active Phase**: `M-9` (`done`) $\rightarrow$ **Monorepo Migration 100% COMPLETE**

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
| **M-8** | Deployment Pipelines, Staging/Prod Configs & Runbook | `done` | 2026-11-04 | `before-m-8` / `m-8-done` | `vercel.json` configs; `.env.example` matrices; `.github/workflows/ci.yml`; multi-stage `Dockerfile`; `docs/deployment-runbook.md`; `smoke-m8.mjs` PASS | Approved at Checkpoint 4 |
| **M-9** | Full E2E Surface Matrix, API/RLS Tests & Final Hardening | `done` | 2026-11-04 | `before-m-9` / `m-9-done` | `matrix-e2e.mjs` 69/69 assertions PASS; all 3 apps production build PASS; 0 bundle leaks | **Monorepo Migration Complete** |

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

### Phase M-9: Full E2E Surface Matrix, API/RLS Tests & Final Hardening (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-9`, `m-9-done`
- **Files Moved/Changed**:
  - Created `packages/testing/scripts/matrix-e2e.mjs` executing 69 assertions across:
    1. 11-Persona $\times$ 4-Surface Access Matrix (44 tests verifying HTTP 200 vs HTTP 403 with `surface-denied-403`).
    2. Transitional 308 redirects (`web/admin/*` $\rightarrow$ admin, `admin/admin/teaching/*` $\rightarrow$ teach, `admin/admin/publishing` $\rightarrow$ teach).
    3. API role boundary enforcement (Learner mutation block, Sales CRM publish block, Content Editor drafting vs publisher requirement).
    4. Dual-Control (Two-Person Rule): verified self-approval is rejected with HTTP 403 `TWO_PERSON_RULE_VIOLATION`, while independent administrator approval succeeds.
    5. PII Masking: verified Sales CRM & Marketing receive masked email/phone (`***`) and hidden revenue (`-1`), while Super Admin receives unmasked records.
    6. System Area Step-Up Re-Auth & 15m Impersonation: verified missing/expired (>15m) re-auth is blocked with 403 `REAUTH_REQUIRED`, fresh re-auth (<=15m) succeeds, and impersonation issues `jh_impersonation_target` cookie with `Max-Age=900`.
    7. Audit Log Immutability: verified audit logs cannot be updated or deleted (strictly append-only ledger), and learner access is blocked with 403.
    8. Seed Data Verification: verified roadmap curriculum, lesson drafts, and learner directory render correctly across all 3 surfaces.
  - Hardened `apps/teach/src/middleware.ts` and `apps/admin/src/middleware.ts` to default unauthenticated requests to `"guest"` and enforce Default-Deny on staff APIs and surfaces.
- **Gate Results**:
  - `pnpm -r run typecheck` — PASS across all 12 workspaces.
  - `pnpm -r run lint` — PASS across all 12 workspaces (0 cross-app imports, 0 cycles, 0 bundle leaks).
  - `pnpm -r run test` — PASS across all 12 workspaces.
  - `pnpm run build` — PASS across `apps/web`, `apps/teach`, `apps/admin`.
  - `node packages/testing/scripts/matrix-e2e.mjs` — **69 / 69 PASSED (100%)**.
