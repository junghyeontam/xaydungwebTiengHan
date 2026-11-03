# 🇰🇷 JungHyeon Korean (정현) — Smart Korean Learning Platform

> **Slogan:** "Solid foundation, confident communication."  
> A comprehensive, modern Korean language education web application taking learners from complete beginner (Hangul / Zero) to TOPIK 6. Powered by Spaced Repetition (SRS SM-2), gamification (JungHyeon Tree, XP, Streaks, Badges), AI speech pronunciation analysis, full mock exam suite, and personalized consultation.

---

## 🌟 Overview & Key Capabilities

- **Strict English Codebase Architecture**: English folders, file names, API routes, database tables, and code comments.
- **Bi-directional i18n (`messages/vi.json` & `messages/en.json`)**: Default Vietnamese UI with English localization support.
- **Single Source of Brand Truth (`config/brand.ts`)**: Centralized contact, social links, colors, and slogans.
- **Design System & Korean Aesthetics**: Warm Cream `#FAF7F2`, Deep Slate `#12302F`, Teal `#3DBBA8`, Coral `#E8604C`, and Yellow `#F5B93A`. Large radii (16–28px), soft shadows, and WCAG AA accessible contrast with seamless Dark Mode.
- **Honey Mascot**: Lovable tiger guide appearing across empty states, celebratory confetti milestones, and the AI advisor.
- **JungHyeon Tree Gamification**: Visual tree growing across 5 growth stages based on accrued XP (Seed 🌱 → Sprout 🌿 → Sapling 🪴 → Great Tree 🌳 → Mugunghwa Flower 🌺).
- **Audio & Pronunciation**: Korean Web Speech API text-to-speech with simulated microphone pitch & waveform analysis.

---

## 🗺️ Application Routes

All routes follow English naming conventions, with 308 permanent redirects handling legacy paths:

| English Route | Legacy Path (Redirected) | Description |
|:---|:---|:---|
| `/` | `/` | Hero section, Continue Learning block, JungHyeon Tree, Roadmap preview, Testimonials, FAQ, Quick consultation. |
| `/roadmap` | `/lo-trinh` | Two-column curriculum path with level locks, Hangul primer, TOPIK 1–6 stages, and level-up challenge. |
| `/lessons/:slug` | `/bai/:slug` | Interactive lesson room: Korean theory, vocabulary with audio, grammar formulas, and 6 practice exercise types. |
| `/review` | `/on-tap` | Spaced Repetition (SRS SM-2) flashcard deck manager, spreadsheet import (Excel/Sheets/Word), and 4 study modes. |
| `/pronunciation`| `/phat-am` | Interactive Hangul alphabet matrix (vowels & consonants), sound shift rules, and microphone voice analysis. |
| `/topik` | `/topik` | Standardized TOPIK I & II exam simulator: timed test, question navigation, automated grading, and weak point analysis. |
| `/consultation` | `/tu-van` | 12-question placement test, 1-on-1 advisor appointment booking, consultation inquiry lead capture, and Honey AI assistant. |
| `/profile` | `/ho-so` | Student profile, XP weekly bar visualizer, 12-week GitHub-style streak heatmap, honor badges, and weekly leaderboard. |
| `/products` | `/san-pham` | Free vs. Lifetime VIP package comparison, curriculum books, printed flashcards, and simulated VietQR/Stripe checkout. |
| `/admin` | `/admin` | Lead management CRM, order transaction history, CSV report export, coupon management, and KPIs. |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Variables + Radix UI / shadcn design concepts
- **Animations & Micro-interactions**: Framer Motion + Canvas Confetti + Lucide React Icons
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (RLS) + OAuth / Magic Link / Email & Password
- **Localization**: Custom typed JSON dictionary loader (`messages/vi.json`, `messages/en.json`) with dynamic language switching
- **PWA Ready**: Manifest, service worker support, and offline caching headers

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <REPOSITORY_URL>
cd TTJUNGHYEON
npm install
```

### 2. Environment Variables
Create `.env.local` using `.env.example` as reference:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If Supabase credentials are not provided, the platform automatically runs in interactive demo mode with persistent local storage).*

### 3. Database Setup (Supabase)
Apply the complete schema and migration:
1. Run `supabase/schema.sql` in your Supabase SQL Editor.
2. If migrating an earlier schema, run `supabase/migrations/20261102000000_rename_vietnamese_columns.sql`.
3. For detailed entity descriptions, see [`docs/database.md`](docs/database.md).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Verification
```bash
npm run build
npm run start
```

---

## 📚 Project Documentation

- [`docs/database.md`](docs/database.md): Complete schema documentation for all 20 Supabase tables, RLS policies, and data types.
- [`docs/glossary.md`](docs/glossary.md): English-Vietnamese-Korean domain terminology mapping and route definitions.

---

## 📄 License & Attribution

Copyright © 2026 JungHyeon Korean (정현). All rights reserved.
Developed for Vietnamese learners worldwide.
