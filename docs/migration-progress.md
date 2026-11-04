# Nhật Ký Theo Dõi Tiến Độ Di Chuyển Monorepo (Nguồn Chân Lý)

> **Chế độ**: `CHECKPOINT` (Toàn bộ các điểm kiểm tra đã hoàn thành!)  
> **Cập nhật lần cuối**: 2026-11-04T23:38:00+07:00  
> **Giai đoạn hiện tại**: `M-9` (`done`) $\rightarrow$ **Quá trình di chuyển Monorepo ĐÃ HOÀN THÀNH 100%**

---

## Bảng Tổng Hợp Tiến Độ Các Giai Đoạn

| Giai đoạn | Tiêu đề | Trạng thái | Ngày | Git Tag (Trước / Hoàn thành) | Kết quả Kiểm định (Gate Results) | Bước tiếp theo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-0** | Kiểm toán mã nguồn & Tài liệu kiến trúc các Surface | `done` | 2026-11-04 | `pre-m0-audit` / `m-0-done` | `tsc --noEmit` ĐẠT; Hoàn thành tài liệu kiến trúc | Tiến hành M-1 |
| **M-1** | Khung Monorepo (`pnpm`, `turbo`) & Di chuyển mã nguồn sang `apps/web` | `done` | 2026-11-04 | `before-m-1` / `m-1-done` | `pnpm install`, `typecheck`, `lint`, `test`, `build` ĐẠT | Tiến hành M-2 |
| **M-2** | Bóc tách 9 Package Dùng Chung (`ui`, `content-renderer`, `features`, `auth`, `rbac`, `db`, `i18n`, `config`, `testing`) | `done` | 2026-11-04 | `before-m-2` / `m-2-done` | Toàn bộ 10 workspace `typecheck`/`lint`/`test` ĐẠT; 0 vòng lặp phụ thuộc; Build `apps/web` + smoke test HTTP 200/403 ĐẠT | Đã duyệt tại Checkpoint 1 |
| **M-3** | Khởi tạo ứng dụng `apps/admin` (Cổng 3002) & Cấu hình chuyển hướng chuyển tiếp | `done` | 2026-11-04 | `before-m-3` / `m-3-done` | Toàn bộ 11 workspace `typecheck`/`lint`/`test` ĐẠT; Build `apps/web` & `apps/admin` ĐẠT; `smoke-m3.mjs` 200/308/403 ĐẠT | Tiến hành M-4 |
| **M-4** | Khởi tạo ứng dụng `apps/teach` (Cổng 3001) & Tách tuyến đường Giảng viên khỏi Admin | `done` | 2026-11-04 | `before-m-4` / `m-4-done` | Toàn bộ 12 workspace `typecheck`/`lint`/`test` ĐẠT; Build `apps/web`, `apps/teach`, `apps/admin` ĐẠT; `smoke-m4.mjs` 200/308/403 ĐẠT | Đã duyệt tại Checkpoint 2 |
| **M-5** | Đăng nhập một lần liên tên miền con (SSO), Surface Guard, Bộ chuyển đổi & Trang 403 | `done` | 2026-11-04 | `before-m-5` / `m-5-done` | Toàn bộ 12 workspace `typecheck`/`lint`/`test`/`build` ĐẠT; `smoke-m5.mjs` kiểm tra cookie SSO + `SurfaceDeniedView` 403 ĐẠT | Đã duyệt tại Checkpoint 3 |
| **M-6** | Khu vực Hệ thống (`/system/**`) cho `super_admin`, Xác thực lại (Re-Auth) & 2FA | `done` | 2026-11-04 | `before-m-6` / `m-6-done` | Toàn bộ 12 workspace `typecheck`/`lint`/`test`/`build` ĐẠT; `smoke-m6.mjs` 11/11 tuyến đường `/system/*` + Xác thực lại $\le$ 15 phút + Giả lập quyền chỉ đọc 15 phút ĐẠT | Đã duyệt tại Checkpoint 3 |
| **M-7** | Thiết lập ranh giới bảo mật (ESLint + Kiểm tra Bundle + RLS cho từng Surface) | `done` | 2026-11-04 | `before-m-7` / `m-7-done` | Luật ESLint chống nhập chéo app; cô lập package thuần; quét mã bí mật bundle client ĐẠT (0 rò rỉ); thêm migration RLS phân tách surface | Tiến hành M-8 |
| **M-8** | Quy trình Triển khai, Ma trận Biến môi trường & Sổ tay vận hành (Runbook) | `done` | 2026-11-04 | `before-m-8` / `m-8-done` | Cấu hình `vercel.json`; ma trận biến môi trường `.env.example`; `.github/workflows/ci.yml`; `Dockerfile` đa tầng; `docs/deployment-runbook.md`; `smoke-m8.mjs` ĐẠT | Đã duyệt tại Checkpoint 4 |
| **M-9** | Ma trận Kiểm thử E2E Toàn diện, Kiểm tra API/RLS & Đóng gói hoàn tất | `done` | 2026-11-04 | `before-m-9` / `m-9-done` | `matrix-e2e.mjs` 69/69 kiểm thử ĐẠT; build sản xuất cả 3 app ĐẠT; 0 rò rỉ bundle | **Hoàn tất Di chuyển Monorepo** |

---

## Nhật Ký Chi Tiết Từng Giai Đoạn

### Giai đoạn M-0..M-6 (`done`)
- **Git Tags**: `pre-m0-audit`..`m-6-done`. Bóc tách các package dùng chung, phân chia độc lập `apps/web`, `apps/teach`, `apps/admin`, kết nối SSO giữa các subdomain và xây dựng phân vùng đặc quyền `/system/**` với cơ chế Xác thực lại từng bước (Step-Up Re-Auth).

### Giai đoạn M-7: Thiết lập ranh giới bảo mật (ESLint + Kiểm tra Bundle + RLS Surface) (`done`)
- **Ngày**: 2026-11-04 | **Git Tags**: `before-m-7`, `m-7-done`
- **Tập tin đã di chuyển / chỉnh sửa**:
  - Cấu hình quy tắc ESLint nghiêm ngặt `no-restricted-imports` trong `apps/web/.eslintrc.json`, `apps/teach/.eslintrc.json`, và `apps/admin/.eslintrc.json` ngăn chặn tuyệt đối việc import chéo giữa các app anh em.
  - Nâng cấp `packages/testing/scripts/check-no-cycles.mjs` với cơ chế quét ranh giới toàn diện: 0 import chéo giữa 3 app, đảm bảo các package thuần (`ui`, `content-renderer`, `features`, `i18n`, `config`) không bao giờ import các module đặc quyền (`auth`, `db`, `rbac`) hoặc các app, và 0 phụ thuộc vòng lặp (circular dependencies).
  - Làm sạch các barrel export của `@junghyeon/config` và `@junghyeon/db` bằng cách tách hằng số an toàn phía client khỏi dịch vụ phía server (`@junghyeon/db/supabase-server`), đảm bảo 0 rò rỉ mã bí mật server (`SUPABASE_SERVICE_ROLE_KEY`) trong bundle JavaScript phía client của `apps/web`.
  - Bổ sung `supabase/migrations/20261104010000_surface_boundary_rls_policies.sql` định nghĩa các chính sách Row Level Security theo nguyên tắc Default-Deny cho từng surface: học viên, giáo viên, quản trị viên và hệ thống.
  - Thêm bộ kiểm thử đơn vị `packages/testing/scripts/test-boundaries.mjs` xác minh 24 tổ hợp vai trò - surface, bắt buộc kích hoạt 2FA và thời hạn hết hiệu lực của phiên re-auth hệ thống.

### Giai đoạn M-8: Quy trình Triển khai, Ma trận Môi trường & Sổ tay vận hành (`done`)
- **Ngày**: 2026-11-04 | **Git Tags**: `before-m-8`, `m-8-done`
- **Tập tin đã di chuyển / chỉnh sửa**:
  - Khởi tạo `apps/web/vercel.json`, `apps/teach/vercel.json`, và `apps/admin/vercel.json` cấu hình đầu ra `.next` cùng tiêu đề bảo mật `noindex, nofollow, noarchive` cho các bề mặt nội bộ.
  - Khởi tạo `apps/web/.env.example`, `apps/teach/.env.example`, và `apps/admin/.env.example` liệt kê rõ biến môi trường được phép và các khóa bí mật bị nghiêm cấm trên từng app.
  - Khởi tạo `.github/workflows/ci.yml` chạy song song kiểm tra typecheck, ESLint, quét ranh giới, unit test và build production cho toàn bộ 3 ứng dụng.
  - Khởi tạo `Dockerfile` đa tầng tại thư mục gốc hỗ trợ `docker build --build-arg APP_NAME=web|teach|admin`.
  - Khởi tạo `docs/deployment-runbook.md` hướng dẫn cấu hình DNS, cài đặt auth/cookie Supabase đơn dự án, quy trình triển khai không gián đoạn (zero-downtime) và kế hoạch rollback khi có sự cố.
  - Bổ sung `packages/testing/scripts/smoke-m8.mjs` và xác minh toàn bộ tài nguyên triển khai hợp lệ.
- **Kết quả Kiểm định**:
  - `pnpm -r run typecheck`, `pnpm -r run lint`, `pnpm -r run test`, `pnpm run build` — TẤT CẢ ĐỀU ĐẠT trên toàn bộ 12 workspace.
  - `smoke-m8.mjs` — ĐẠT (toàn bộ cấu hình triển khai và runbook hợp lệ).

### Giai đoạn M-9: Ma trận Kiểm thử E2E Toàn diện, Kiểm tra API/RLS & Hoàn tất Đóng gói (`done`)
- **Ngày**: 2026-11-04 | **Git Tags**: `before-m-9`, `m-9-done`
- **Tập tin đã di chuyển / chỉnh sửa**:
  - Khởi tạo `packages/testing/scripts/matrix-e2e.mjs` thực thi 69 khẳng định kiểm thử (assertions) bao quát:
    1. Ma trận truy cập 11 Vai trò (Personas) $\times$ 4 Bề mặt (Surfaces) (44 kiểm thử xác minh HTTP 200 cho phép vs HTTP 403 bị từ chối kèm thẻ nhận diện `surface-denied-403`).
    2. Chuyển hướng vĩnh viễn mã 308 cho các đường dẫn cũ (`web/admin/*` $\rightarrow$ admin, `admin/admin/teaching/*` $\rightarrow$ teach, `admin/admin/publishing` $\rightarrow$ teach).
    3. Thực thi ranh giới vai trò trên API (chặn thao tác chỉnh sửa của Học viên, chặn xuất bản trực tiếp của Sales CRM, cho phép Biên tập viên tạo nháp nhưng chặn xuất bản nếu thiếu vai trò Publisher).
    4. Cơ chế Kiểm soát Kép (Quy tắc Hai Người - Two-Person Rule): xác minh người đề xuất hoàn tiền không thể tự duyệt (bị chặn HTTP 403 `TWO_PERSON_RULE_VIOLATION`), trong khi Quản trị viên độc lập duyệt thành công.
    5. Ẩn Dữ liệu Cá nhân Nhạy cảm (PII Masking): xác minh Sales CRM & Marketing nhận email/SĐT đã bị ẩn (`***`) cùng doanh thu bị che (`-1`), trong khi Super Admin xem đầy đủ dữ liệu gốc.
    6. Khu vực Hệ thống - Xác thực lại từng bước (Step-Up Re-Auth) & Giả lập quyền 15 phút: xác minh phiên re-auth bị thiếu hoặc quá hạn (> 15 phút) bị từ chối với 403 `REAUTH_REQUIRED`, phiên re-auth còn mới ($\le$ 15 phút) thành công, và tính năng giả lập quyền cấp cookie `jh_impersonation_target` với `Max-Age=900` ở chế độ chỉ đọc.
    7. Tính Bất biến của Nhật ký Kiểm toán: xác minh nhật ký chỉ có thể ghi thêm (append-only ledger), không thể cập nhật hoặc xóa, và tài khoản học viên bị chặn 403 khi cố truy cập.
    8. Xác minh Dữ liệu Khởi tạo (Seed Data): kiểm tra dữ liệu lộ trình, bài giảng và danh bạ học viên hiển thị chính xác trên cả 3 bề mặt.
  - Gia cố `apps/teach/src/middleware.ts` và `apps/admin/src/middleware.ts` tự động gán vai trò `"guest"` cho các yêu cầu chưa xác thực để áp dụng triệt để nguyên tắc Default-Deny trên các API và giao diện nội bộ.
- **Kết quả Kiểm định**:
  - `pnpm -r run typecheck` — ĐẠT trên toàn bộ 12 workspace.
  - `pnpm -r run lint` — ĐẠT trên toàn bộ 12 workspace (0 import chéo, 0 phụ thuộc vòng lặp, 0 rò rỉ mã bí mật client).
  - `pnpm -r run test` — ĐẠT trên toàn bộ 12 workspace.
  - `pnpm run build` — ĐẠT trên cả 3 ứng dụng `apps/web`, `apps/teach`, `apps/admin`.
  - `node packages/testing/scripts/matrix-e2e.mjs` — **69 / 69 KIỂM THỬ ĐẠT (100%)**.
