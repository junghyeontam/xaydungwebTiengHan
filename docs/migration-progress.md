# Monorepo Migration Progress Tracker (Source of Truth)

> **Mode**: `CHECKPOINT` (Pause after M-2, M-4, M-6, M-8)  
> **Last Updated**: 2026-11-04T14:52:00+07:00  
> **Active Phase**: `M-1` $\rightarrow$ `M-2`

---

## Phase Summary Matrix

| Phase | Title | Status | Date | Git Tag (Before / Done) | Gate Results | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-0** | Repository Audit & Surface Architecture Docs | `done` | 2026-11-04 | `pre-m0-audit` / `m-0-done` | `tsc --noEmit` PASS; Docs complete | Proceed to M-1 |
| **M-1** | Monorepo Skeleton (`pnpm`, `turbo`) & Move to `apps/web` | `in-progress` | 2026-11-04 | `before-m-1` / `m-1-done` | Running M-1 verification gates | Verify M-1 gates & start M-2 |
| **M-2** | Extract Shared Packages (`ui`, `content-renderer`, `features`, `auth`, `rbac`, `db`, `i18n`, `config`) | `todo` | - | `before-m-2` / `m-2-done` | Pending | **CHECKPOINT 1 after M-2** |
| **M-3** | Create `apps/admin` (Port 3002) & Transitional Redirects | `todo` | - | `before-m-3` / `m-3-done` | Pending | Proceed to M-4 |
| **M-4** | Create `apps/teach` (Port 3001) & Remove Teacher Routes from Admin | `todo` | - | `before-m-4` / `m-4-done` | Pending | **CHECKPOINT 2 after M-4** |
| **M-5** | Cross-Subdomain SSO, Surface Guard, Switcher & 403 Pages | `todo` | - | `before-m-5` / `m-5-done` | Pending | Proceed to M-6 |
| **M-6** | System Area (`/system/**`) with `super_admin`, Re-Auth & 2FA | `todo` | - | `before-m-6` / `m-6-done` | Pending | **CHECKPOINT 3 after M-6** |
| **M-7** | Enforce Boundaries (ESLint + Bundle Check + Surface RLS) | `todo` | - | `before-m-7` / `m-7-done` | Pending | Proceed to M-8 |
| **M-8** | Deployment Pipelines, Staging/Prod Configs & Runbook | `todo` | - | `before-m-8` / `m-8-done` | Pending | **CHECKPOINT 4 after M-8** |
| **M-9** | Full E2E Surface Matrix, API/RLS Tests & Final Hardening | `todo` | - | `before-m-9` / `m-9-done` | Pending | Final Release |

---

## Detailed Phase Logs

### Phase M-0: Repository Audit & Architecture Docs (`done`)
- **Date**: 2026-11-04
- **Git Tags**: `pre-m0-audit`, `m-0-done`
- **Files Created**: `docs/surfaces.md`, `docs/architecture.md`, `docs/auth-sso.md`, `docs/deployment.md`.
- **Gate Results**: `npx tsc --noEmit` (PASS, 0 errors).
- **Open Decisions Recorded**:
  - Placeholder domains (`junghyeon.com`, `teach.junghyeon.com`, `admin.junghyeon.com`) configured via `@junghyeon/config`.
  - `read_only` role requires mandatory 2FA on staff surfaces.
  - Unclear files remain in `apps/web` with documented notes.
  - Teacher Studio split occurs in Phase M-4.
