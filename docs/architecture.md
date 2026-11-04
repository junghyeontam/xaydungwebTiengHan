# Turborepo Multi-Surface Monorepo Architecture

> **Project**: Tiếng Hàn JungHyeon  
> **Architecture Pattern**: 3 Isolated Next.js 14 App Router Surfaces + 9 Shared Workspace Packages + 1 Unified Supabase Backend

---

## 1. High-Level Topology (Mermaid Diagram)

```mermaid
flowchart TD
  subgraph Clients["User & Staff Browsers"]
    L["Learners & Guests"]
    T["Teachers, Editors & Publishers"]
    A["Back-Office Ops (Admin, CRM, Support, Marketing)"]
    SA["Super Administrators"]
  end

  subgraph Apps["Deployable Next.js 14 Surfaces (apps/*)"]
    WEB["apps/web\njunghyeon.com (Port 3000)\nLearner & Guest Experience"]
    TEACH["apps/teach\nteach.junghyeon.com (Port 3001)\nTeacher Studio & Publishing"]
    ADMIN["apps/admin\nadmin.junghyeon.com (Port 3002)\nBack-Office Operations"]
    SYS["apps/admin (/system/**)\nadmin.junghyeon.com/system\nSuper Admin Governance"]
  end

  subgraph Packages["Shared Workspace Packages (packages/*)"]
    UI["@junghyeon/ui\nDesign Tokens & Components"]
    CR["@junghyeon/content-renderer\nLesson, Vocab & Grammar Views"]
    FEAT["@junghyeon/features\nSM-2 SRS, Formatters, Zod Schemas"]
    RBAC["@junghyeon/rbac\nPermissions, Role->Surface Map, Nav Manifests"]
    AUTH["@junghyeon/auth\nSupabase SSR, SSO Cookie, Surface Guard"]
    DB["@junghyeon/db\nTyped Queries & Supabase Types"]
    I18N["@junghyeon/i18n\nvi/en Dictionaries & Glossary"]
    CFG["@junghyeon/config\nBrand, Env Validators, ESLint Boundaries"]
  end

  subgraph Supabase["Shared Supabase Project (Single Source of Truth)"]
    SBAUTH["Supabase Auth\nShared auth.users & Custom JWT Claims"]
    PG["PostgreSQL + Surface-Aware RLS\nhas_permission() & in_surface()"]
    RT["Supabase Realtime\nLesson Review & Queue Events"]
    ST["Supabase Storage\nAvatars & Lesson Media"]
  end

  L --> WEB
  T --> TEACH
  A --> ADMIN
  SA --> ADMIN
  SA --> SYS
  SA --> TEACH
  SA --> WEB

  WEB --> UI & CR & FEAT & RBAC & AUTH & DB & I18N & CFG
  TEACH --> UI & CR & FEAT & RBAC & AUTH & DB & I18N & CFG
  ADMIN --> UI & CR & FEAT & RBAC & AUTH & DB & I18N & CFG

  AUTH --> SBAUTH
  DB --> PG & RT & ST
  TEACH -. "HMAC Signed Webhook\nPOST /api/revalidate" .-> WEB
  ADMIN -. "HMAC Signed Webhook\nPOST /api/revalidate" .-> WEB
```

---

## 2. Package Dependency Graph & Strict Import Boundaries

```mermaid
graph TD
  subgraph Deployable_Apps["Deployable Apps (No Cross-App Imports)"]
    W["apps/web"]
    T["apps/teach"]
    A["apps/admin"]
  end

  subgraph Stateful_Packages["Stateful & Infrastructure Packages"]
    AUTH["@junghyeon/auth"]
    DB["@junghyeon/db"]
    RBAC["@junghyeon/rbac"]
  end

  subgraph Pure_Packages["Pure & Framework-Agnostic Packages"]
    CR["@junghyeon/content-renderer"]
    UI["@junghyeon/ui"]
    FEAT["@junghyeon/features"]
    I18N["@junghyeon/i18n"]
    CFG["@junghyeon/config"]
  end

  W --> AUTH & DB & RBAC & CR & UI & FEAT & I18N & CFG
  T --> AUTH & DB & RBAC & CR & UI & FEAT & I18N & CFG
  A --> AUTH & DB & RBAC & CR & UI & FEAT & I18N & CFG

  AUTH --> DB & RBAC & CFG
  DB --> RBAC & FEAT & CFG
  CR --> UI & FEAT & I18N
  UI --> FEAT & CFG
```

### Enforced Boundary Rules (`eslint-plugin-boundaries` + CI Bundle Gate)
1. **No Cross-App Imports**: `apps/web`, `apps/teach`, and `apps/admin` can **never** import from one another.
2. **Pure Package Isolation**: `@junghyeon/ui`, `@junghyeon/content-renderer`, and `@junghyeon/features` must **never** import from `@junghyeon/auth`, `@junghyeon/db`, or any `apps/*`.
3. **Zero Leakage to Learner Bundle**:
   - `apps/web` and `apps/teach` bundles are scanned in CI for forbidden module identifiers and strings (`revenue`, `refund-approval`, `payment-keys`, `impersonation`, `roles-matrix`, `SUPABASE_SERVICE_ROLE_KEY`).
   - All financial reconciliation, refund approvals, role matrix mutations, and payment gateway keys live exclusively inside `apps/admin`.

---

## 3. Cross-Surface Event & Revalidation Architecture

Apps never call each other's internal code or share in-memory state. All cross-surface workflows flow through **PostgreSQL + Supabase Realtime** and **HMAC-signed webhooks**:

```mermaid
sequenceDiagram
  participant Teacher as Teacher (apps/teach)
  participant DB as Supabase Postgres (RLS)
  participant Publisher as Publisher (apps/teach)
  participant Web as Learner Site (apps/web)

  Teacher->>DB: INSERT/UPDATE lesson (status = 'in_review')
  DB-->>Publisher: Realtime notification on review_queue
  Publisher->>DB: Approve & publish lesson (status = 'published')
  DB->>DB: Append immutable row to audit_logs (surface = 'teach')
  Publisher->>Web: POST /api/revalidate (HMAC-SHA256 signature, tags: ['roadmap', 'lesson:<slug>'])
  Web->>Web: Verify HMAC & revalidateTag('roadmap', 'lesson:<slug>')
```

---

## 4. Database & Surface-Aware Row-Level Security (RLS)

1. **`surface_type` Enum**: `('web', 'teach', 'admin', 'system')`.
2. **`role_surfaces` Table**: Maps each `CanonicalRole` to its permitted surfaces (`default-deny`).
3. **RLS Helper Functions**:
   - `public.current_surface()`: Reads the request surface claim/header validated against `role_surfaces`.
   - `public.in_surface(target_surface surface_type)`: Returns `true` only if the authenticated user's role is permitted on `target_surface`.
   - `public.has_permission(resource text, action text)`: Evaluates whether the caller's active role grants `resource:action` on the current surface.
   - `public.is_super_admin()`: Returns `true` only for active `super_admin` accounts.
4. **Defense-in-Depth**: Even if a `teacher` extracts their valid JWT and queries Supabase REST/PostgREST directly for `orders`, `leads`, or `payment_settings`, PostgreSQL RLS rejects the query because `teacher` lacks both the surface grant (`admin`/`system`) and the permission grant.
