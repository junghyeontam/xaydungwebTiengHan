# JungHyeon Korean — System Architecture & Admin Boundary Specification

## 1. Overview & Separation Boundaries

The Tiếng Hàn JungHyeon web platform follows a strict architectural boundary separation between the **Learner Experience** and the **Admin Management Portal**.

```
                           ┌────────────────────────┐
                           │      PostgreSQL        │
                           │   (Supabase + RLS)     │
                           └───────────┬────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
      ┌─────────▼──────────┐                       ┌──────────▼─────────┐
      │   Learner Web App  │                       │    Admin Portal    │
      │ src/app/(learner)  │                       │ src/app/[locale]/  │
      │                    │                       │   (admin)/admin    │
      └─────────┬──────────┘                       └──────────┬─────────┘
                │                                             │
                └───────────────┐             ┌───────────────┘
                                │             │
                          ┌─────▼─────────────▼─────┐
                          │      Shared Layers      │
                          │  - src/lib              │
                          │  - src/types            │
                          │  - src/features         │
                          │  - src/components/shared│
                          └─────────────────────────┘
```

### Strict ESLint Rules
Learner code and shared layers are forbidden by ESLint (`no-restricted-imports`) from importing anything from `(admin)` or `src/components/admin`.
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": [
              "@/app/**/(admin)/**",
              "**/src/app/**/(admin)/**",
              "@/components/admin/**",
              "**/src/components/admin/**"
            ],
            "message": "Learner code and shared layers must never import from admin folders."
          }
        ]
      }
    ]
  }
}
```

---

## 2. Deployment Models

### Option A: Unified Domain (Default / Recommended)
- Both learner and admin applications run within the same Next.js App Router project.
- Learner paths: `/`, `/roadmap`, `/lessons/[slug]`, `/review`, `/topik`, `/consultation`, `/products`, `/profile`
- Admin paths: `/[locale]/admin/**` (default `/vi/admin`), with automatic rewrite from `/admin` handled by `src/middleware.ts`.
- **Advantages**: Single deployment pipeline, shared build cache, zero cross-origin cookie or authentication complications.

### Option B: Dedicated Subdomain (`admin.<domain>`)
- The admin portal can be exposed on a custom subdomain such as `admin.junghyeon.vn`.
- In `src/middleware.ts`, when `req.nextUrl.hostname === 'admin.junghyeon.vn'`, requests to `/` are rewritten to `/vi/admin`, and `/:path*` is rewritten to `/vi/admin/:path*`.
- Dedicated environment variables:
  - `NEXT_PUBLIC_ADMIN_BASE_URL=https://admin.junghyeon.vn`
  - `ADMIN_SESSION_COOKIE_DOMAIN=.junghyeon.vn`
- RLS and cookie security flags can be isolated to the subdomain.

---

## 3. Database Single Source of Truth & Zero-Downtime Publishing Cycle

Learners and administrators operate against the same Supabase database with distinct access privileges:

1. **Draft vs Published Separation**:
   - Learner-facing routes query rows where `status = 'published'` and use `published_version_id`.
   - Content editors write to `content_versions` with status `'draft'` or `'in_review'`.
   - Edits never affect the learner experience until approved and published.

2. **Publish & Secured Revalidation**:
   - When a publisher clicks **Publish**, an atomic database transaction promotes the version to `'published'`.
   - The publisher triggers `POST /api/revalidate` with a cryptographically signed header `x-revalidate-secret`.
   - The endpoint invokes Next.js `revalidatePath` and `revalidateTag` for:
     - `/lessons/[slug]`
     - `/roadmap`
     - `/sitemap.xml`
     - `content:lessons`
     - `stats:home`
   - Cache invalidates instantly with zero downtime.

3. **Audit Trail**:
   - Every admin write, version promotion, rollback, lead assignment, or setting change logs an entry in `audit_logs` containing `actor_id`, `action`, `resource_type`, `resource_id`, `before_state`, and `after_state`.

---

## 4. Shared Layers
Only four layers may be shared across the boundary:
1. `src/lib`: Database clients (`supabase.ts`), utility helpers (`utils.ts`).
2. `src/types`: TypeScript schema types (`database.types.ts`, `admin.types.ts`).
3. `src/features/<domain>`: Pure business logic (SRS algorithms, XP calculations, lesson rendering pipeline).
4. `src/components/shared`: Theme controls, branding (`BrandLogo.tsx`), mascot assets (`MascotHoney.tsx`), and content preview shells.
