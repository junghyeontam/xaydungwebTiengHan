-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR: JUNGHYEON KOREAN (정현)
-- Includes 20 core tables, foreign keys, indexes, and Row Level Security (RLS) policies
-- ==============================================================================

-- 1. USER PROFILES TABLE (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  goal TEXT DEFAULT 'study_abroad', -- 'study_abroad' | 'employment' | 'topik' | 'kpop_culture' | 'travel'
  current_level TEXT DEFAULT 'zero', -- 'zero' | 'hangul' | 'beginner' | 'intermediate' | 'advanced'
  daily_goal_minutes INT DEFAULT 20,
  total_xp INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  is_vip BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'student', -- 'student' | 'admin' | 'mentor'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROADMAP LEVELS TABLE (levels)
CREATE TABLE IF NOT EXISTS public.levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  korean_name TEXT,
  level_badge TEXT,
  order_index INT NOT NULL,
  min_completion_percent INT DEFAULT 80,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LESSONS TABLE (lessons)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  node_number INT NOT NULL,
  title TEXT NOT NULL,
  korean_title TEXT,
  short_desc TEXT,
  introduction TEXT,
  estimated_minutes INT DEFAULT 20,
  xp_reward INT DEFAULT 35,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSON CONTENT BLOCKS TABLE (lesson_blocks)
CREATE TABLE IF NOT EXISTS public.lesson_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL, -- 'theory' | 'grammar_rule' | 'dialogue' | 'tip'
  title TEXT,
  content TEXT,
  formula TEXT,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VOCABULARY TABLE (vocab)
CREATE TABLE IF NOT EXISTS public.vocab (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
  korean TEXT NOT NULL,
  meaning TEXT NOT NULL,
  romaja TEXT,
  audio_url TEXT,
  example_korean TEXT,
  example_meaning TEXT,
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INTERACTIVE EXERCISES TABLE (exercises)
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL, -- 'multiple-choice' | 'fill-blank' | 'reorder' | 'matching' | 'listening' | 'typing'
  instruction TEXT,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer JSONB NOT NULL,
  pairs JSONB,
  word_bank JSONB,
  audio_url TEXT,
  explanation TEXT,
  xp_reward INT DEFAULT 10,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEARNER PROGRESS TABLE (user_progress)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in-progress', -- 'in-progress' | 'completed'
  stars INT DEFAULT 0, -- 1-3
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 8. XP TRANSACTION HISTORY TABLE (user_xp_log)
CREATE TABLE IF NOT EXISTS public.user_xp_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp_amount INT NOT NULL,
  source TEXT NOT NULL, -- 'lesson' | 'srs' | 'streak' | 'placement_test'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FLASHCARD DECKS TABLE (decks)
CREATE TABLE IF NOT EXISTS public.decks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  color TEXT,
  is_curated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FLASHCARD ITEMS TABLE (cards)
CREATE TABLE IF NOT EXISTS public.cards (
  id TEXT PRIMARY KEY,
  deck_id TEXT REFERENCES public.decks(id) ON DELETE CASCADE,
  korean TEXT NOT NULL,
  meaning TEXT NOT NULL,
  romaja TEXT,
  example_korean TEXT,
  example_meaning TEXT,
  repetitions INT DEFAULT 0,
  interval_days INT DEFAULT 0,
  easiness_factor NUMERIC(3,2) DEFAULT 2.50,
  next_review_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SRS CARD REVIEW LOG TABLE (card_reviews)
CREATE TABLE IF NOT EXISTS public.card_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id TEXT REFERENCES public.cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  grade INT NOT NULL, -- 0-3 (0: forgot, 1: hard, 2: good, 3: easy)
  review_date TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STUDY STREAKS TABLE (streaks)
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INT DEFAULT 1,
  longest_streak INT DEFAULT 1,
  last_activity_date DATE DEFAULT CURRENT_DATE
);

-- 13. BADGES DIRECTORY TABLE (badges)
CREATE TABLE IF NOT EXISTS public.badges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  required_condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. USER BADGES TABLE (user_badges)
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- 15. LEADS AND INQUIRIES TABLE (leads)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  goal TEXT, -- 'study_abroad' | 'employment' | 'topik' | 'kpop_culture' | 'travel'
  current_level TEXT, -- 'zero' | 'hangul' | 'beginner' | 'intermediate' | 'advanced'
  study_mode TEXT,
  preferred_time TEXT,
  notes TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'enrolled' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CONSULTATION APPOINTMENTS TABLE (appointments)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed', -- 'confirmed' | 'completed' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PRODUCTS & COURSE PACKAGES TABLE (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'subscription' | 'course' | 'book'
  title TEXT NOT NULL,
  badge TEXT,
  description TEXT,
  original_price INT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ORDERS TABLE (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  amount INT NOT NULL,
  payment_method TEXT NOT NULL, -- 'vietqr' | 'stripe' | 'payos'
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. DISCOUNT COUPONS TABLE (coupons)
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_percent INT,
  discount_amount INT,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- 20. TOPIK TESTS & ATTEMPTS TABLE (topik_tests & topik_attempts)
CREATE TABLE IF NOT EXISTS public.topik_tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level_badge TEXT NOT NULL,
  duration_minutes INT DEFAULT 40,
  max_score INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topik_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id TEXT REFERENCES public.topik_tests(id) ON DELETE CASCADE,
  score INT NOT NULL,
  passed_level TEXT,
  details JSONB,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Learners can view and update their own profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public read permissions for levels, lessons, and products
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public levels are viewable by everyone" ON public.levels FOR SELECT USING (true);
CREATE POLICY "Public lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Anyone can submit consultation inquiry leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
