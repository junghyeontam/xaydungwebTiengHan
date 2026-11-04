# Monorepo Migration Progress Tracker (Source of Truth)

> **Mode**: `CHECKPOINT` (Pause after M-2, M-4, M-6, M-8)  
> **Last Updated**: 2026-11-04T17:44:45+07:00  
> **Active Phase**: `M-6` (`done`) $\rightarrow$ Waiting at **CHECKPOINT 3** before `M-7`

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
| **M-6** | System Area (`/system/**`) with `super_admin`, Re-Auth & 2FA | `done` | 2026-11-04 | `before-m-6` / `m-6-done` | All 12 workspaces `typecheck`/`lint`/`test`/`build` PASS; `smoke-m6.mjs` 11/11 `/system/*` routes + Step-Up Re-Auth <=15m + 15m Read-Only Impersonation PASS | **CHECKPOINT 3 reached** (Wait for `continue` to start M-7) |
| **M-7** | Enforce Boundaries (ESLint + Bundle Check + Surface RLS) | `todo` | - | `before-m-7` / `m-7-done` | Pending | Proceed to M-8 |
| **M-8** | Deployment Pipelines, Staging/Prod Configs & Runbook | `todo` | - | `before-m-8` / `m-8-done` | Pending | **CHECKPOINT 4 after M-8** |
| **M-9** | Full E2E Surface Matrix, API/RLS Tests & Final Hardening | `todo` | - | `before-m-9` / `m-9-done` | Pending | Final Release |

---

## Detailed Phase Logs

### Phase M-0..M-4 (`done`)
- **Tags**: `pre-m0-audit`..`m-4-done`. Extracted 9 workspace packages and separated `apps/web` (`:3000`), `apps/teach` (`:3001`), and `apps/admin` (`:3002`) with 100% git history and `308` permanent redirects.

### Phase M-5: Cross-Subdomain SSO, Surface Guard, Switcher & 403 Pages (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-5`, `m-5-done`
- **Summary**: Added `SurfaceSwitcher` (`Alt+1/2/3/4`) and `SurfaceDeniedView` (`403`) in `@junghyeon/ui`, `/api/auth/sso-session` across `apps/web`, `apps/teach`, and `apps/admin`, mounted `SurfaceSwitcher` in all 3 app headers, and verified SSO cookie matrix with `smoke-m5.mjs`.

### Phase M-6: System Area (`/system/**`) with `super_admin`, Re-Auth & 2FA (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-6`, `m-6-done`
- **Files Moved/Changed**:
  - Created `apps/admin/src/app/[locale]/(admin)/admin/system/layout.tsx` (High-security Red System Control Banner, sub-navigation for all 11 `/system/**` capabilities, and Step-Up Re-Auth modal).
  - Created `apps/admin/src/app/[locale]/(admin)/admin/system/[section]/page.tsx` covering `roles`, `permissions`, `integrations`, `payment-keys`, `feature-flags`, `maintenance`, `backups`, `security-audit`, `audit-log`, `staff`, and `impersonation`, with typed-confirmation danger forms.
  - Created `apps/admin/src/app/api/admin/system/route.ts` enforcing `super_admin` + `2FA` + fresh Step-Up Re-Authentication ($\le 15\text{m}$ via `jh_reauth_ts`) + 15-minute read-only impersonation cookie (`jh_impersonation_target`, `Max-Age=900`) + immutable `recordAuditLog`.
  - Updated `apps/admin/src/middleware.ts` to route all 11 `/system/*` paths to `/[locale]/admin/system/[section]` and enforce `super_admin` + `2FA` at the edge.
  - Added `packages/testing/scripts/smoke-m6.mjs`.
- **Gate Results**:
  - `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm --filter @junghyeon/admin run build` — PASS.
  - `smoke-m4.mjs`, `smoke-m5.mjs`, and `smoke-m6.mjs` — PASS (all 11 `/system/*` routes return `200` for `super_admin` + 2FA, `403` for `admin`/`sales_crm`/`support_agent`/`marketing`/`read_only`/`teacher`/`learner` and `super_admin` without 2FA; `/api/admin/system` POST returns `403 REAUTH_REQUIRED` when re-auth is missing/expired and `200` when fresh $\le 15\text{m}$).
- **Risks & Open TODOs**:
  - Next phase (`M-7`) will enforce automated ESLint cross-app/package boundary rules, client bundle secret/admin-leak scanners on `apps/web`, and Supabase surface-level RLS policies.
