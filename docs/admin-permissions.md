# Tài Liệu Đặc Tả Phân Quyền Quản Trị RBAC v2: Tiếng Hàn JungHyeon

> **Tài liệu chuẩn**: RBAC v2 Specification & Matrix  
> **Áp dụng cho**: Admin Portal (`Tiếng Hàn JungHyeon`)  
> **Nguyên tắc cốt lõi**: Mặc định từ chối (Default-Deny), Không gian làm việc riêng biệt theo vai trò (Role-Specific Workspaces), Cơ chế kiểm soát kép (Dual Control), Bảo vệ chống leo thang đặc quyền (Privilege-Escalation Guard).

---

## 1. Danh Mục 9 Vai Trò Chuẩn (Canonical 9 Roles)

Mọi nhãn hiển thị trên giao diện người dùng bắt buộc dùng bản dịch chuẩn, tuyệt đối không hiển thị mã enum thô (như `super_admin`, `support_agent`):

| Mã Role | Nhãn Tiếng Việt | Nhãn Tiếng Anh | Mô Tả Phạm Vi Quyền Hạn | Cấp Độ Phân Cấp |
| :--- | :--- | :--- | :--- | :---: |
| `super_admin` | **Quản trị tối cao** | Super Administrator | Toàn quyền kiểm soát hệ thống, quản lý khóa bảo mật, ma trận RBAC, cấu hình tích hợp và mạo danh phục vụ gỡ lỗi. | 100 |
| `admin` | **Quản trị vận hành** | Operations Administrator | Vận hành hàng ngày: duyệt xuất bản, kiểm tra hoàn tiền (Two-Person rule), quản lý học viên, quản lý nhân sự cấp dưới. | 80 |
| `publisher` | **Kiểm duyệt viên** | Publisher & Reviewer | Thẩm định chất lượng học liệu, góp ý cho tác giả, phê duyệt và lập lịch xuất bản lên lộ trình. Cấm tự duyệt bài của chính mình. | 50 |
| `content_editor` | **Biên tập viên** | Content Editor | Soạn thảo giáo trình, từ vựng, câu hỏi bài tập; chỉ quản lý bản nháp thuộc sở hữu của mình, không có quyền duyệt hoặc xuất bản. | 40 |
| `teacher` | **Giảng viên** | Instructor & Teacher | Soạn giáo trình trong phạm vi được cấp phép (`teacher_content_scopes`), theo dõi học viên và bài tập trong các lớp phụ trách (`class_enrollments`). | 40 |
| `sales_crm` | **Tư vấn & Tuyển sinh** | Sales & Admissions | Tiếp nhận và chăm sóc khách hàng tiềm năng (Leads), quản lý phễu tư vấn, theo dõi đơn hàng được phân công, đề xuất hoàn tiền. | 40 |
| `support_agent` | **Chuyên viên hỗ trợ** | Support Specialist | Tiếp nhận và xử lý sự cố học viên; tra cứu hồ sơ người dùng bằng từ khóa chính xác (Exact lookup by Ticket/Email/Phone). **Tuyệt đối không truy cập đơn hàng, không xem doanh thu, không duyệt danh sách tổng.** | 30 |
| `marketing` | **Tiếp thị & Growth** | Marketing & Growth | Quản lý mã giảm giá, banner thông báo, chiến dịch khuyến mãi; phân tích số liệu chuyển đổi tổng hợp (không xem PII cá nhân). | 40 |
| `read_only` | **Quan sát viên** | Auditor & Observer | Chỉ xem số liệu thống kê tổng hợp phục vụ thanh tra, kiểm toán hoặc kiến tập. Không có nút thao tác ghi; mọi PII và doanh thu bị ẩn. | 10 |

---

## 2. Danh Sách Nguy Cấp (DANGER LIST) – Chỉ Dành Riêng Cho `super_admin`

Các quyền sau **chỉ duy nhất `super_admin` được sở hữu** và **không bao giờ được phân bổ cho bất kỳ vai trò nào khác** (kể cả qua tính năng tùy chỉnh quyền):

1. `manage_roles`: Sửa đổi định nghĩa vai trò, phân bổ quyền hoặc thay đổi ma trận RBAC.
2. `manage_integrations`: Cấu hình các cổng API bên thứ ba (PayOS, SePay, Supabase, Google OAuth).
3. `manage_payment_keys`: Xem hoặc cập nhật khóa bí mật và webhook tokens của cổng thanh toán.
4. `manage_feature_flags`: Bật/tắt các cờ tính năng toàn hệ thống.
5. `maintenance_mode`: Kích hoạt chế độ bảo trì hệ thống.
6. `backups`: Kích hoạt sao lưu hoặc khôi phục dữ liệu vật lý.
7. `impersonate`: Mạo danh tài khoản người dùng để điều tra sự cố (tối đa 15 phút, có ghi log kiểm toán bắt buộc).
8. `view_security_audit`: Kiểm tra nhật ký bảo mật đăng nhập và truy cập IP.
9. `delete_permanent`: Xóa cứng vĩnh viễn dữ liệu khỏi cơ sở dữ liệu.
10. `bulk_export_pii`: Xuất dữ liệu hàng loạt chứa email/số điện thoại không che giấu (cần xác thực lại mật khẩu/2FA).

---

## 3. Ma Trận Phân Quyền Chuẩn RBAC v2 (Source of Truth)

> **Quy tắc Mặc định từ chối (Default-Deny)**: Bất kỳ quyền hoặc tài nguyên nào không được đánh dấu `Có` trong bảng dưới đây đều bị **từ chối hoàn toàn** ở cả 3 lớp: Middleware, Server Action/API, và Database RLS.

| Tài nguyên / Quyền hạn | `super_admin` | `admin` | `content_editor` | `publisher` | `teacher` | `sales_crm` | `support_agent` | `marketing` | `read_only` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Nội dung: Xem (Lessons, Vocab, Roadmap)** | Có | Có | Bản nháp | Có | Bản đọc | Không | **KHÔNG** | Không | Đọc |
| **Nội dung: Biên soạn & Chỉnh sửa nháp** | Có | Có | Bản nháp mình | Có | Trong phạm vi | Không | **KHÔNG** | Không | Không |
| **Nội dung: Phê duyệt & Xuất bản** | Có | Có | Không | Có (author!=rev)* | Không | Không | Không | Không | Không |
| **Teacher Studio (Soạn học liệu, Ô từ vựng)** | Có | Có | Bản nháp mình | Đánh giá | Bản nháp mình | Không | Không | Không | Không |
| **Teacher Studio: Phân tích hiệu quả bài giảng** | Có | Có | Không | Có | Lớp mình | Không | Không | Không | Không |
| **Học viên: Duyệt toàn bộ danh mục** | Có | Có | Không | Không | Lớp mình | Đơn mình | **KHÔNG (Chỉ tra cứu)** | Không | Ẩn danh |
| **Học viên: Tra cứu chính xác (Exact Lookup)** | Có | Có | Không | Không | Có | Có | **CÓ (Bắt buộc search)** | Không | Không |
| **Học viên: Xem thông tin liên hệ (PII)** | Có | Có | Không | Không | Che giấu | Che giấu | **Che giấu (Nút mở)** | Không | Che giấu |
| **Đơn hàng: Truy cập trang `/sales/orders`** | Có | Có | Không | Không | Không | Có (Được giao) | **KHÔNG (403/404)** | Không | Không |
| **Đơn hàng: Xem chỉ số số lượng ("142 đơn...")**| Có | Có | Không | Không | Không | Có | **KHÔNG (Bị ẩn)** | Không | Không |
| **Đơn hàng: Xem doanh thu / Số tiền** | Có | Có | Không | Không | Không | Có (Phễu mình) | **KHÔNG (Bị ẩn)** | Không | Không |
| **Hoàn tiền: Đề xuất yêu cầu hoàn tiền** | Có | Có | Không | Không | Không | Có | **KHÔNG (Chỉ báo cờ)**| Không | Không |
| **Hoàn tiền: Phê duyệt hoàn tiền (Two-Person)** | Có | Có (Re-auth)* | Không | Không | Không | Không | Không | Không | Không |
| **Leads & Tư vấn: Xem & Xử lý** | Có | Có | Không | Không | Lớp mình | Toàn phễu | Ticket hỗ trợ | Không | Không |
| **Marketing: Mã giảm giá & Banner** | Có | Có | Không | Không | Không | Xem | Không | Toàn quyền | Không |
| **Sidebar: Khối phân khúc gói (Lifetime VIP...)**| Có | Có | Không | Không | Không | Tổng hợp | **KHÔNG (Bị ẩn)** | Tổng hợp | Không |
| **Cài đặt: UI Style Guide (Dev tool)** | Dev only | Dev only | Dev only | Dev only | Dev only | Dev only | Dev only | Dev only | Dev only |

---

## 4. Các Quy Tắc Nghiệp Vụ Bắt Buộc (Strict Business Rules)

1. **Nguyên tắc Kiểm soát kép trong xuất bản (Content Dual Control)**:
   - Giáo viên (`teacher`) và Biên tập viên (`content_editor`) chỉ có thể tạo bản nháp và gửi duyệt (`submitted`).
   - Kiểm duyệt viên (`publisher`) hoặc `admin` chỉ có thể duyệt xuất bản nếu `author_id !== reviewer_id`. Tác giả không bao giờ được tự duyệt bài của chính mình.
2. **Quy trình 2 người trong hoàn tiền (Two-Person Rule for Refunds)**:
   - Nhân viên kinh doanh (`sales_crm`) chỉ có quyền đề xuất hoàn tiền (`propose_refund`).
   - Quản trị viên (`admin` hoặc `super_admin`) là người duy nhất có quyền phê duyệt hoàn tiền (`approve_refund`).
   - Khi bấm phê duyệt hoàn tiền, hệ thống bắt buộc yêu cầu **xác thực lại danh tính (Re-authentication bằng Mật khẩu hoặc mã 2FA TOTP)** trước khi lệnh thanh toán được chuyển sang cổng PayOS/SePay.
3. **Phạm vi bảo mật của Chuyên viên hỗ trợ (Support Specialist Zero-Finance Rule)**:
   - Menu `Orders & VIP` bị gỡ bỏ hoàn toàn khỏi Sidebar, Command Palette và Route Handler (trả về lỗi 403 nếu cố tình truy cập).
   - Khi xem hồ sơ học viên tại trang chi tiết, Tab "Plan & purchases" chỉ hiển thị: Tên gói, Trạng thái (Đang hoạt động / Hết hạn), Ngày kích hoạt. Tuyệt đối **không hiển thị số tiền thanh toán, không hiển thị mã giao dịch cổng, không có nút hoàn tiền**.
   - Nút hành động duy nhất: **"Báo cờ yêu cầu xem xét thanh toán (Flag for billing review)"** để chuyển tiếp yêu cầu sang bộ phận Admin.
4. **Quy tắc che giấu dữ liệu PII và Kiểm toán mở thông tin (PII Masking & Reveal)**:
   - Số điện thoại (`0988 *** 233`) và Email (`ngu***@gmail.com`) mặc định hiển thị ở dạng che giấu (masked).
   - Nhân viên có quyền `reveal_pii` khi bấm vào icon con mắt phải chọn lý do (Ví dụ: *"Hỗ trợ cuộc gọi khẩn cấp theo ticket #TK-102"*). Thông tin chỉ mở trong 60 giây và hệ thống tự động ghi nhật ký vào `audit_logs`.
