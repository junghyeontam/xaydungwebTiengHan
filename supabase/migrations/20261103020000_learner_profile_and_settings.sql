-- ==============================================================================
-- MIGRATION: 20261103020000_learner_profile_and_settings.sql
-- DESCRIPTION: Extends learner profiles, creates reference tables (countries, vn_provinces),
--              notification preferences, profile change audit log, data export & deletion requests,
--              automated completeness calculation trigger, and column-level RLS protections.
-- ==============================================================================

-- 1. EXTEND PUBLIC.PROFILES TABLE
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_kind TEXT DEFAULT 'preset' CHECK (avatar_kind IN ('upload', 'preset')),
  ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'undisclosed' CHECK (gender IN ('male', 'female', 'other', 'undisclosed')),
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS nationality_code TEXT DEFAULT 'VN',
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'VN',
  ADD COLUMN IF NOT EXISTS province_code TEXT,
  ADD COLUMN IF NOT EXISTS ui_language TEXT DEFAULT 'vi' CHECK (ui_language IN ('vi', 'en')),
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
  ADD COLUMN IF NOT EXISTS phone_e164 TEXT,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS learning_goals TEXT[] DEFAULT ARRAY['topik']::TEXT[],
  ADD COLUMN IF NOT EXISTS target_topik_level INT DEFAULT 3 CHECK (target_topik_level BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS target_exam_date DATE,
  ADD COLUMN IF NOT EXISTS preferred_study_times TEXT[] DEFAULT ARRAY['evening']::TEXT[],
  ADD COLUMN IF NOT EXISTS translation_preference TEXT DEFAULT 'both' CHECK (translation_preference IN ('vi', 'en', 'both')),
  ADD COLUMN IF NOT EXISTS show_romanization BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS how_did_you_hear TEXT,
  ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  ADD COLUMN IF NOT EXISTS show_on_leaderboard BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_streak_public BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS profile_completeness SMALLINT DEFAULT 60 CHECK (profile_completeness BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ;

-- Index for unique display_name lookup
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);

-- 2. REFERENCE TABLE: COUNTRIES
CREATE TABLE IF NOT EXISTS public.countries (
  code VARCHAR(2) PRIMARY KEY,
  name_vi VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  flag_emoji VARCHAR(10) NOT NULL,
  dial_code VARCHAR(10) NOT NULL,
  order_index INT DEFAULT 100
);

-- Seed primary countries
INSERT INTO public.countries (code, name_vi, name_en, flag_emoji, dial_code, order_index) VALUES
  ('VN', 'Việt Nam', 'Vietnam', '🇻🇳', '+84', 1),
  ('KR', 'Hàn Quốc', 'South Korea', '🇰🇷', '+82', 2),
  ('JP', 'Nhật Bản', 'Japan', '🇯🇵', '+81', 3),
  ('US', 'Hoa Kỳ', 'United States', '🇺🇸', '+1', 4),
  ('AU', 'Úc', 'Australia', '🇦🇺', '+61', 5),
  ('CA', 'Canada', 'Canada', '🇨🇦', '+1', 6),
  ('TW', 'Đài Loan', 'Taiwan', '🇹🇼', '+886', 7),
  ('SG', 'Singapore', 'Singapore', '🇸🇬', '+65', 8)
ON CONFLICT (code) DO NOTHING;

-- 3. REFERENCE TABLE: VIETNAMESE PROVINCES
CREATE TABLE IF NOT EXISTS public.vn_provinces (
  code VARCHAR(10) PRIMARY KEY,
  name_vi VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  region VARCHAR(20) NOT NULL CHECK (region IN ('north', 'central', 'south')),
  order_index INT DEFAULT 50
);

-- Seed key Vietnamese provinces
INSERT INTO public.vn_provinces (code, name_vi, name_en, region, order_index) VALUES
  ('HN', 'Hà Nội', 'Ha Noi', 'north', 1),
  ('SG', 'TP. Hồ Chí Minh', 'Ho Chi Minh City', 'south', 2),
  ('DN', 'Đà Nẵng', 'Da Nang', 'central', 3),
  ('HP', 'Hải Phòng', 'Hai Phong', 'north', 4),
  ('CT', 'Cần Thơ', 'Can Tho', 'south', 5),
  ('BD', 'Bình Dương', 'Binh Duong', 'south', 6),
  ('DNA', 'Đồng Nai', 'Dong Nai', 'south', 7),
  ('BN', 'Bắc Ninh', 'Bac Ninh', 'north', 8),
  ('HD', 'Hải Dương', 'Hai Duong', 'north', 9),
  ('NA', 'Nghệ An', 'Nghe An', 'central', 10),
  ('TH', 'Thanh Hóa', 'Thanh Hoa', 'central', 11),
  ('KH', 'Khánh Hòa', 'Khanh Hoa', 'central', 12),
  ('LD', 'Lâm Đồng', 'Lam Dong', 'central', 13),
  ('VT', 'Bà Rịa - Vũng Tàu', 'Ba Ria - Vung Tau', 'south', 14),
  ('TN', 'Thái Nguyên', 'Thai Nguyen', 'north', 15),
  ('OTHER', 'Tỉnh / Thành phố khác', 'Other Province', 'south', 99)
ON CONFLICT (code) DO NOTHING;

-- 4. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  daily_reminder BOOLEAN DEFAULT true,
  streak_at_risk BOOLEAN DEFAULT true,
  srs_due_cards BOOLEAN DEFAULT true,
  new_lessons BOOLEAN DEFAULT true,
  promotions BOOLEAN DEFAULT false,
  product_news BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '20:00:00',
  quiet_hours_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME DEFAULT '22:30:00',
  quiet_hours_end TIME DEFAULT '07:00:00',
  unsubscribe_marketing BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROFILE CHANGE AUDIT LOG
CREATE TABLE IF NOT EXISTS public.profile_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  field_name VARCHAR(64) NOT NULL,
  old_value_masked TEXT,
  new_value_masked TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_change_log_user ON public.profile_change_log(user_id, changed_at DESC);

-- 6. DATA EXPORT REQUESTS (GDPR / Privacy Compliance)
CREATE TABLE IF NOT EXISTS public.data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  format VARCHAR(10) DEFAULT 'json' CHECK (format IN ('json', 'csv')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'expired')),
  download_url TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS idx_data_export_user ON public.data_export_requests(user_id, requested_at DESC);

-- 7. ACCOUNT DELETION REQUESTS (14-day Grace Period)
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_account_deletion_user ON public.account_deletion_requests(user_id, status);

-- 8. AUTOMATIC PROFILE COMPLETENESS CALCULATION
CREATE OR REPLACE FUNCTION public.calculate_profile_completeness(p public.profiles)
RETURNS SMALLINT AS $$
DECLARE
  score SMALLINT := 0;
BEGIN
  -- 1. Full name (required) -> 20%
  IF p.full_name IS NOT NULL AND LENGTH(TRIM(p.full_name)) >= 2 THEN
    score := score + 20;
  END IF;

  -- 2. Display name -> 15%
  IF p.display_name IS NOT NULL AND LENGTH(TRIM(p.display_name)) >= 3 THEN
    score := score + 15;
  END IF;

  -- 3. Avatar set -> 15%
  IF p.avatar_url IS NOT NULL AND LENGTH(TRIM(p.avatar_url)) > 0 THEN
    score := score + 15;
  END IF;

  -- 4. Phone number -> 15%
  IF p.phone_e164 IS NOT NULL AND LENGTH(TRIM(p.phone_e164)) >= 8 THEN
    score := score + 15;
  END IF;

  -- 5. Date of birth -> 10%
  IF p.date_of_birth IS NOT NULL THEN
    score := score + 10;
  END IF;

  -- 6. Location (province or nationality) -> 10%
  IF p.province_code IS NOT NULL OR p.nationality_code IS NOT NULL THEN
    score := score + 10;
  END IF;

  -- 7. Learning goals set -> 10%
  IF p.learning_goals IS NOT NULL AND array_length(p.learning_goals, 1) > 0 THEN
    score := score + 10;
  END IF;

  -- 8. Target exam date -> 5%
  IF p.target_exam_date IS NOT NULL THEN
    score := score + 5;
  END IF;

  IF score > 100 THEN
    score := 100;
  END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to recalculate completeness on profile change
CREATE OR REPLACE FUNCTION public.trg_fn_update_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completeness := public.calculate_profile_completeness(NEW);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profile_completeness ON public.profiles;
CREATE TRIGGER trg_profile_completeness
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_fn_update_profile_completeness();

-- 9. COLUMN PROTECTION TRIGGER: Prevent learners from forging privileged columns (role, is_vip, total_xp, streak_days)
CREATE OR REPLACE FUNCTION public.trg_fn_protect_profile_privileged_columns()
RETURNS TRIGGER AS $$
DECLARE
  current_role_val TEXT;
BEGIN
  -- If invoked via service_role or super admin, permit updates
  IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Check if attempting to mutate privileged columns directly
  IF (OLD.role IS DISTINCT FROM NEW.role) OR
     (OLD.is_vip IS DISTINCT FROM NEW.is_vip) OR
     (OLD.total_xp IS DISTINCT FROM NEW.total_xp) OR
     (OLD.streak_days IS DISTINCT FROM NEW.streak_days) THEN
    
    -- Check if user is admin
    SELECT role INTO current_role_val FROM public.profiles WHERE id = auth.uid();
    IF current_role_val NOT IN ('super_admin', 'admin') THEN
      -- Revert privileged columns to original values
      NEW.role := OLD.role;
      NEW.is_vip := OLD.is_vip;
      NEW.total_xp := OLD.total_xp;
      NEW.streak_days := OLD.streak_days;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_fn_protect_profile_privileged_columns();

-- 10. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vn_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_change_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Countries and VN Provinces are public read-only
DROP POLICY IF EXISTS "Public can read countries" ON public.countries;
CREATE POLICY "Public can read countries" ON public.countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read vn_provinces" ON public.vn_provinces;
CREATE POLICY "Public can read vn_provinces" ON public.vn_provinces FOR SELECT USING (true);

-- Profiles: Users can read own full profile, or read public info of other users (if profile_visibility != 'private')
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Notification preferences: owner only
DROP POLICY IF EXISTS "Users manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users manage own notification preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Profile change log: owner read only
DROP POLICY IF EXISTS "Users view own change log" ON public.profile_change_log;
CREATE POLICY "Users view own change log" ON public.profile_change_log
  FOR SELECT USING (auth.uid() = user_id);

-- Data export requests: owner only
DROP POLICY IF EXISTS "Users manage own data export requests" ON public.data_export_requests;
CREATE POLICY "Users manage own data export requests" ON public.data_export_requests
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Account deletion requests: owner only
DROP POLICY IF EXISTS "Users manage own deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Users manage own deletion requests" ON public.account_deletion_requests
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
