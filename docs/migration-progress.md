# Monorepo Migration Progress Tracker (Source of Truth)

> **Mode**: `CHECKPOINT` (Pause after M-2, M-4, M-6, M-8)  
> **Last Updated**: 2026-11-04T17:32:30+07:00  
> **Active Phase**: `M-6` (`in-progress`) $\rightarrow$ **CHECKPOINT 3 after M-6**

---

## Phase Summary Matrix

| Phase | Title | Status | Date | Git Tag (Before / Done) | Gate Results | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-0** | Repository Audit & Surface Architecture Docs | `done` | 2026-11-04 | `pre-m0-audit` / `m-0-done` | `tsc --noEmit` PASS; Docs complete | Proceed to M-1 |
| **M-1** | Monorepo Skeleton (`pnpm`, `turbo`) & Move to `apps/web` | `done` | 2026-11-04 | `before-m-1` / `m-1-done` | `pnpm install`, `typecheck`, `lint`, `test`, `build` PASS | Proceed to M-2 |
| **M-2** | Extract Shared Packages (`ui`, `content-renderer`, `features`, `auth`, `rbac`, `db`, `i18n`, `config`, `testing`) | `done` | 2026-11-04 | `before-m-2` / `m-2-done` | All 10 workspaces `typecheck`/`lint`/`test` PASS; 0 cycles; `apps/web` build + HTTP 200/403 smoke tests PASS | Approved at Checkpoint 1 |
| **M-3** | Create `apps/admin` (Port 3002) & Transitional Redirects | `done` | 2026-11-04 | `before-m-3` / `m-3-done` | All 11 workspaces `typecheck`/`lint`/`test` PASS; `apps/web` & `apps/admin` builds PASS; `smoke-m3.mjs` 200/308/403 PASS | Proceed to M-4 |
| **M-4** | Create `apps/teach` (Port 3001) & Remove Teacher Routes from Admin | `done` | 2026-11-04 | `before-m-4` / `m-4-done` | All 12 workspaces `typecheck`/`lint`/`test` PASS; `apps/web`, `apps/teach`, `apps/admin` builds PASS; `smoke-m4.mjs` 200/308/403 PASS | Approved at Checkpoint 2 |
| **M-5** | Cross-Subdomain SSO, Surface Guard, Switcher & 403 Pages | `done` | 2026-11-04 | `before-m-5` / `m-5-done` | All 12 workspaces `typecheck`/`lint`/`test`/`build` PASS; `smoke-m5.mjs` SSO cookies + 403 SurfaceDeniedView PASS | Proceed to M-6 |
| **M-6** | System Area (`/system/**`) with `super_admin`, Re-Auth & 2FA | `in-progress` | 2026-11-04 | `before-m-6` / `m-6-done` | Pending | **CHECKPOINT 3 after M-6** |
| **M-7** | Enforce Boundaries (ESLint + Bundle Check + Surface RLS) | `todo` | - | `before-m-7` / `m-7-done` | Pending | Proceed to M-8 |
| **M-8** | Deployment Pipelines, Staging/Prod Configs & Runbook | `todo` | - | `before-m-8` / `m-8-done` | Pending | **CHECKPOINT 4 after M-8** |
| **M-9** | Full E2E Surface Matrix, API/RLS Tests & Final Hardening | `todo` | - | `before-m-9` / `m-9-done` | Pending | Final Release |

---

## Detailed Phase Logs

### Phase M-0..M-4 (`done`)
- **Tags**: `pre-m0-audit`..`m-4-done`. Extracted 9 workspace packages and separated `apps/web` (`:3000`), `apps/teach` (`:3001`), and `apps/admin` (`:3002`) with 100% git history and `308` permanent redirects.

### Phase M-5: Cross-Subdomain SSO, Surface Guard, Switcher & 403 Pages (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-5`, `m-5-done`
- **Files Moved/Changed**:
  - Added `SurfaceSwitcher.tsx` and `SurfaceDeniedView.tsx` in `@junghyeon/ui` (`packages/ui/src/`).
  - Enhanced `@junghyeon/auth` (`packages/auth/src/sso-cookie.ts`) with `SSO_2FA_COOKIE`, `IMPERSONATION_COOKIE`, and `buildSsoSessionSnapshot`.
  - Added `/api/auth/sso-session` routes across `apps/web`, `apps/teach`, and `apps/admin` with shared cookie attributes (`Path=/`, `SameSite=lax`, `HttpOnly`, configurable `Domain`).
  - Mounted `SurfaceSwitcher` in `apps/web` (`Header.tsx`), `apps/teach` (`AdminHeader.tsx`), and `apps/admin` (`AdminHeader.tsx`).
  - Upgraded `/unauthorized` (`403`) pages across all 3 apps to render `SurfaceDeniedView` (`data-testid="surface-denied-403"`).
- **Gate Results**:
  - `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build` (all 12 workspaces) — PASS.
  - `smoke-m4.mjs` and `smoke-m5.mjs` — PASS (verified SSO cookie attributes, cross-surface cookie access for `learner`, `teacher`, `sales_crm`, `admin`, `super_admin`, and HTTP `403` `surface-denied-403` rendering).
