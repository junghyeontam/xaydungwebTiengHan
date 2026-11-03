# 🔑 Hướng dẫn tạo Google OAuth Client ID cho Tiếng Hàn JungHyeon

Tài liệu này hướng dẫn chi tiết từng bước tạo **Google OAuth 2.0 Client ID** trên Google Cloud Console và cấu hình vào **Supabase Auth** để người dùng có thể đăng nhập 1 chạm bằng tài khoản Google.

---

## Bước 1: Tạo dự án trên Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Đăng nhập tài khoản Google của bạn.
3. Nhấp vào menu chọn dự án ở góc trên bên trái -> Chọn **New Project (Dự án mới)**.
4. Đặt tên dự án: `Tieng Han JungHyeon` -> Nhấn **Create**.

---

## Bước 2: Cấu hình OAuth Consent Screen (Màn hình đồng ý OAuth)

1. Tại thanh menu bên trái, vào **APIs & Services (API & Dịch vụ)** -> **OAuth consent screen (Màn hình đồng ý OAuth)**.
2. Chọn loại người dùng: **External (Bên ngoài)** -> Nhấn **Create**.
3. Điền thông tin ứng dụng:
   - **App name**: `Tiếng Hàn JungHyeon`
   - **User support email**: Chọn email của bạn
   - **App logo**: Tải logo JungHyeon nếu có
   - **Developer contact information**: Nhập email quản trị viên
4. Nhấn **Save and Continue (Lưu và tiếp tục)**.
5. Ở phần **Scopes (Phạm vi)**: Bấm **Add or Remove Scopes**, tích chọn:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
   -> Bấm **Update** -> Bấm **Save and Continue**.
6. Ở phần **Test users (Người dùng thử nghiệm)**: Bạn có thể thêm email của mình để thử nghiệm, sau đó bấm **Save and Continue** -> **Back to Dashboard**.
7. Khi sẵn sàng chạy chính thức: Bấm nút **Publish App (Xuất bản ứng dụng)** để mọi người dùng đều đăng nhập được.

---

## Bước 3: Tạo OAuth 2.0 Client ID

1. Vào mục **Credentials (Thông tin xác thực)** tại menu bên trái.
2. Nhấp **Create Credentials (Tạo thông tin xác thực)** -> Chọn **OAuth client ID**.
3. Tại mục **Application type**: Chọn **Web application**.
4. **Name**: `JungHyeon Web Client`.
5. **Authorized JavaScript origins (Nguồn gốc JavaScript được uỷ quyền)**:
   - Thêm: `http://localhost:3000` (để test cục bộ)
   - Thêm: `https://your-domain.vercel.app` (domain Vercel chính thức của bạn)
   - Thêm: `https://<your-supabase-project-id>.supabase.co`
6. **Authorized redirect URIs (URI chuyển hướng được uỷ quyền)**:
   - Điền URL callback từ Supabase:
     ```text
     https://<your-supabase-project-id>.supabase.co/auth/v1/callback
     ```
     *(Lấy URL này trong Supabase Dashboard -> Authentication -> Providers -> Google)*
7. Nhấn **Create**.
8. Một cửa sổ hiện ra cung cấp:
   - **Client ID** (dạng `xxxxxx.apps.googleusercontent.com`)
   - **Client Secret** (dạng `GOCSPX-xxxxxx`)
   -> Hãy sao chép 2 khoá này để cấu hình ở bước tiếp theo.

---

## Bước 4: Kích hoạt Google Provider trong Supabase Dashboard

1. Mở trang quản trị [Supabase Dashboard](https://supabase.com/dashboard).
2. Chọn dự án của bạn -> Chọn **Authentication** ở thanh bên trái.
3. Chọn thẻ **Providers** -> Tìm đến **Google**.
4. Bật công tắc **Enable Google provider**.
5. Dán:
   - **Client ID (for OAuth)**: Dán mã Client ID vừa lấy từ Google Console.
   - **Client Secret**: Dán mã Client Secret vừa lấy từ Google Console.
6. Sao chép dòng **Callback URL (for OAuth)** trong Supabase để kiểm tra xem đã khớp với dòng bạn nhập ở Bước 3.6 trên Google Console chưa.
7. Nhấn **Save**.

---

## Bước 5: Cấu hình biến môi trường trong dự án

Cập nhật file `.env.local` của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Xong! Giờ đây khi người dùng bấm nút **"Tiếp tục với Google"** trên website Tiếng Hàn JungHyeon, hệ thống sẽ mở hộp thoại xác thực của Google và tự động đăng nhập an toàn, tạo hồ sơ học viên trên hệ thống.
