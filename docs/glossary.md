# Project Glossary — JungHyeon Korean (정현)

This glossary documents the standard naming conventions, domain vocabulary mappings, route URL translations, and database terms across the project.

---

## 1. Domain Terminology Mappings

| English Standard | Vietnamese Meaning | Korean (Hangul) | Context / Notes |
|:---|:---|:---|:---|
| **Roadmap** | Lộ trình học | 학습 로드맵 | 2-column curriculum path from Level 0 to 6 |
| **Lesson** | Bài học | 수업 / 단원 | Interactive lesson unit with theory & exercises |
| **Review** | Ôn tập | 복습 | SRS Flashcard spaced repetition review session |
| **Pronunciation** | Luyện phát âm | 발음 연습 | Interactive Hangul vowels, consonants & audio |
| **Consultation** | Tư vấn lộ trình | 상담 / 로드맵 컨설팅 | 1-on-1 advisor inquiries, bookings & Honey AI |
| **Profile** | Hồ sơ học viên | 프로필 / 내 정보 | Student profile, XP chart, streak heatmap & badges |
| **Products** | Sản phẩm & Gói VIP | 수강권 / 상품 | VIP lifetime, courses, and printed flashcards |
| **TOPIK** | Luyện thi TOPIK | 토픽 시험 대비 | Test of Proficiency in Korean mock exam room |
| **Meaning** | Ý nghĩa / Giải nghĩa | 뜻 / 의미 | Replaced `vietnamese` across DB & interfaces |
| **Example Meaning** | Dịch nghĩa ví dụ | 예문 해석 | Replaced `exampleVietnamese` |
| **Due Today** | Đến hạn hôm nay | 오늘 복습할 단어 | Flashcards scheduled for review today via SM-2 |
| **Spaced Repetition (SRS)** | Lặp lại ngắt quãng | 간격 반복 시스템 | SuperMemo SM-2 algorithm |
| **Streak** | Chuỗi ngày liên tục | 연속 학습 일수 | Consecutive days of learning |
| **Experience Points (XP)** | Điểm kinh nghiệm | 경험치 (XP) | Points earned to grow the JungHyeon Tree |
| **JungHyeon Tree** | Cây JungHyeon | 정현 나무 | Gamified tree: Seed -> Sprout -> Sapling -> Tree -> Flower |
| **Honey (Mascot)** | Chú hổ Honey | 마스코트 허니 | Friendly tiger mascot symbolizing Korea |

---

## 2. Route Path Mappings

| Old Vietnamese Route | New English Route | HTTP Status | Component Path |
|:---|:---|:---:|:---|
| `/lo-trinh` | `/roadmap` | 308 Permanent | `app/roadmap/page.tsx` |
| `/bai/:slug` | `/lessons/:slug` | 308 Permanent | `app/lessons/[slug]/page.tsx` |
| `/on-tap` | `/review` | 308 Permanent | `app/review/page.tsx` |
| `/phat-am` | `/pronunciation` | 308 Permanent | `app/pronunciation/page.tsx` |
| `/tu-van` | `/consultation` | 308 Permanent | `app/consultation/page.tsx` |
| `/ho-so` | `/profile` | 308 Permanent | `app/profile/page.tsx` |
| `/san-pham` | `/products` | 308 Permanent | `app/products/page.tsx` |
| `/topik` | `/topik` | 200 (Retained) | `app/topik/page.tsx` |
| `/admin` | `/admin` | 200 (Retained) | `app/admin/page.tsx` |

---

## 3. Database Column & Value Mappings

| Table | Old Name / Value | New Name / Value | Type / Scope |
|:---|:---|:---|:---|
| `cards` | `vietnamese` | `meaning` | Column Rename |
| `cards` | `example_vietnamese` | `example_meaning` | Column Rename |
| `vocab` | `vietnamese` | `meaning` | Column Rename |
| `vocab` | `example_vietnamese` | `example_meaning` | Column Rename |
| `leads` | `status = 'moi'` | `status = 'new'` | Enum / Column Value |
| `leads` | `status = 'da_goi'` | `status = 'contacted'` | Enum / Column Value |
| `leads` | `status = 'chot'` | `status = 'enrolled'` | Enum / Column Value |
| `leads` | `status = 'huy'` | `status = 'cancelled'` | Enum / Column Value |
| `leads`, `profiles` | `goal = 'du-hoc'` | `goal = 'study_abroad'` | Enum / Column Value |
| `leads`, `profiles` | `goal = 'xkld'` | `goal = 'employment'` | Enum / Column Value |
| `leads`, `profiles` | `goal = 'kpop'` | `goal = 'kpop_culture'` | Enum / Column Value |
| `leads`, `profiles` | `goal = 'du-lich'` | `goal = 'travel'` | Enum / Column Value |
| `leads`, `profiles` | `current_level = 'so-0'` | `current_level = 'zero'` | Enum / Column Value |

---

## 4. Learning Goals & Levels Mapping

### Learning Goals (`LearningGoal`)
- `study_abroad`: Study Abroad in Korea (Du học Hàn Quốc)
- `employment`: Employment in Korean Corporations / EPS-TOPIK (Xuất khẩu lao động & Doanh nghiệp Hàn)
- `topik`: TOPIK Certification Levels 1 - 6 (Chinh phục chứng chỉ TOPIK)
- `kpop_culture`: K-Drama, K-Pop & Korean Culture (Xem phim K-Drama & Nghe nhạc K-Pop)
- `travel`: Travel & Essential Daily Spoken Korean (Du lịch & Giao tiếp cơ bản)

### Levels (`CurrentLevel`)
- `zero`: Complete beginner from scratch (Số 0)
- `hangul`: Knows Hangul alphabet but needs grammar basics (Đã thuộc bảng chữ cái)
- `beginner`: TOPIK 1 - 2 (Sơ cấp 1 - 2)
- `intermediate`: TOPIK 3 - 4 (Trung cấp 1 - 2)
- `advanced`: TOPIK 5 - 6 (Cao cấp 1 - 2)
