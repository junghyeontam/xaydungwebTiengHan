# Monorepo Migration Progress Tracker (Source of Truth)

> **Mode**: `CHECKPOINT` (Pause after M-2, M-4, M-6, M-8)  
> **Last Updated**: 2026-11-04T16:04:30+07:00  
> **Active Phase**: `M-2` (`done`) $\rightarrow$ Waiting at **CHECKPOINT 1** before `M-3`

---

## Phase Summary Matrix

| Phase | Title | Status | Date | Git Tag (Before / Done) | Gate Results | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-0** | Repository Audit & Surface Architecture Docs | `done` | 2026-11-04 | `pre-m0-audit` / `m-0-done` | `tsc --noEmit` PASS; Docs complete | Proceed to M-1 |
| **M-1** | Monorepo Skeleton (`pnpm`, `turbo`) & Move to `apps/web` | `done` | 2026-11-04 | `before-m-1` / `m-1-done` | `pnpm install`, `typecheck`, `lint`, `test`, `build` PASS | Proceed to M-2 |
| **M-2** | Extract Shared Packages (`ui`, `content-renderer`, `features`, `auth`, `rbac`, `db`, `i18n`, `config`, `testing`) | `done` | 2026-11-04 | `before-m-2` / `m-2-done` | All 10 workspaces `typecheck`/`lint`/`test` PASS; 0 cycles; `apps/web` build + HTTP 200/403 smoke tests PASS | **CHECKPOINT 1 reached** (Wait for `continue` to start M-3) |
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
- **Date**: 2026-11-04 | **Tags**: `pre-m0-audit`, `m-0-done`
- **Summary**: Created `docs/surfaces.md`, `docs/architecture.md`, `docs/auth-sso.md`, `docs/deployment.md`.

### Phase M-1: Monorepo Skeleton & Move to `apps/web` (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-1`, `m-1-done`
- **Summary**: Configured `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`; moved root app into `apps/web` via `git mv` (100% history preserved); added canonical learner routes (`/theory`, `/shop`, `/consulting`, `/auth`).

### Phase M-2: Extract Shared Packages (`packages/*`) (`done`)
- **Date**: 2026-11-04 | **Tags**: `before-m-2`, `m-2-done`
- **Packages Extracted**:
  1. `@junghyeon/config` (`brand.ts`, `urls.ts`, `env.ts`)
  2. `@junghyeon/i18n` (`vi.json`, `en.json`, `translations.ts`, `I18nContext.tsx`)
  3. `@junghyeon/features` (`format.ts`, `sm2.ts`, `speech.ts`, `profile/*`, curriculum data models)
  4. `@junghyeon/ui` (`utils.ts`, `tokens.css`, `admin-tokens.css`, 22 shared UI components)
  5. `@junghyeon/rbac` (`registry.ts`, `permissions.ts`, `types.ts`, `masking.ts`, `surfaces.ts` Role $\rightarrow$ Surface matrix)
  6. `@junghyeon/db` (`database.types.ts`, `admin.types.ts`, `analytics.types.ts`, `supabase.ts`, `audit-service.ts`, data & storage services)
  7. `@junghyeon/auth` (`client.ts`, `sso-cookie.ts`, `surface-guard.ts`, `require-permission.ts`)
  8. `@junghyeon/content-renderer` (`LessonTheory`, `LessonExercises`, `LessonHeader`, `RoadmapTheoryLibrary`, `LessonPreviewModal`)
  9. `@junghyeon/testing` (`personas.ts`, `scripts/check-no-cycles.mjs`, `scripts/smoke-m2.mjs`)
- **Gate Results**:
  - `pnpm install` — PASS
  - `pnpm run typecheck` (all 10 workspaces) — PASS (0 errors)
  - `pnpm run lint` & `check-no-cycles.mjs` — PASS (0 circular dependencies, 0 boundary violations)
  - `pnpm run test` — PASS
  - `pnpm --filter @junghyeon/web run build` — PASS (38 static/dynamic routes compiled)
  - HTTP Smoke Test (`smoke-m2.mjs`) — PASS (`/`, `/roadmap`, `/theory`, `/lessons/beginner-1-lesson-3-ayo-eoyo-endings`, `/review`, `/profile`, `/shop`, `/auth`, `/vi/admin/login`, `/vi/admin/teaching/lessons` all return `200`; unauthorized `/api/admin/orders` GET & POST return `403`).
- **Risks & Open TODOs**:
  - Next phase (`M-3`) will scaffold `apps/admin` on port `3002`, move back-office routes from `apps/web`, and install 308 permanent redirects from `apps/web/admin/*` to `NEXT_PUBLIC_ADMIN_URL`.
