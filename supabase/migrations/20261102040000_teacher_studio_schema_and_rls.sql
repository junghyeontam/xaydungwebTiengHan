-- ==============================================================================
-- Migration: Teacher Studio Schema, Scopes, Dual-Control RLS & Views
-- Version: 20261102040000
-- ==============================================================================

-- 1. EXTEND LESSONS TABLE & RELATED ENUMS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lesson_kind') THEN
    CREATE TYPE public.lesson_kind AS ENUM ('grammar', 'topic_vocabulary', 'hangul', 'conversation');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE public.content_status AS ENUM ('draft', 'submitted', 'in_review', 'changes_requested', 'approved', 'scheduled', 'published', 'archived');
  END IF;
END $$;

-- Add Teacher Studio columns to lessons if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'lesson_kind') THEN
    ALTER TABLE public.lessons ADD COLUMN lesson_kind TEXT DEFAULT 'grammar';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'lesson_number') THEN
    ALTER TABLE public.lessons ADD COLUMN lesson_number INT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'korean_subtitle') THEN
    ALTER TABLE public.lessons ADD COLUMN korean_subtitle TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'summary_vi') THEN
    ALTER TABLE public.lessons ADD COLUMN summary_vi TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'summary_en') THEN
    ALTER TABLE public.lessons ADD COLUMN summary_en TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'duration_minutes') THEN
    ALTER TABLE public.lessons ADD COLUMN duration_minutes INT DEFAULT 20;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'xp_reward') THEN
    ALTER TABLE public.lessons ADD COLUMN xp_reward INT DEFAULT 35;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'difficulty') THEN
    ALTER TABLE public.lessons ADD COLUMN difficulty TEXT DEFAULT 'beginner';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'star_rules') THEN
    ALTER TABLE public.lessons ADD COLUMN star_rules JSONB DEFAULT '{"stars_3": 90, "stars_2": 70, "stars_1": 50}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'proposed_position') THEN
    ALTER TABLE public.lessons ADD COLUMN proposed_position INT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'roadmap_position') THEN
    ALTER TABLE public.lessons ADD COLUMN roadmap_position INT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'author_id') THEN
    ALTER TABLE public.lessons ADD COLUMN author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'status') THEN
    ALTER TABLE public.lessons ADD COLUMN status TEXT DEFAULT 'draft';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'published_version_id') THEN
    ALTER TABLE public.lessons ADD COLUMN published_version_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'deleted_at') THEN
    ALTER TABLE public.lessons ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- 2. TEACHER CONTENT SCOPES TABLE
CREATE TABLE IF NOT EXISTS public.teacher_content_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_code TEXT NOT NULL, -- e.g. 'topik-1', 'topik-2', 'hangul'
  lesson_kind TEXT NOT NULL, -- 'grammar', 'topic_vocabulary', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_teacher_scope UNIQUE (teacher_id, level_code, lesson_kind)
);

CREATE INDEX IF NOT EXISTS idx_teacher_scopes_teacher ON public.teacher_content_scopes(teacher_id);

-- 3. GRAMMAR POINTS & TAGS REPOSITORY (Grammar Bank)
CREATE TABLE IF NOT EXISTS public.lesson_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label_vi TEXT NOT NULL,
  label_en TEXT NOT NULL,
  korean_pattern TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_tag_links (
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.lesson_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lesson_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.grammar_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  korean_pattern TEXT NOT NULL,
  formula TEXT,
  explanation_vi TEXT,
  explanation_en TEXT,
  attachment_rules JSONB DEFAULT '[]'::jsonb,
  examples JSONB DEFAULT '[]'::jsonb,
  common_mistakes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_grammar_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  grammar_point_id UUID NOT NULL REFERENCES public.grammar_points(id) ON DELETE CASCADE,
  position INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VOCABULARY ITEMS REPOSITORY (Vocabulary Bank)
CREATE TABLE IF NOT EXISTS public.vocabulary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  korean TEXT NOT NULL,
  romanization TEXT,
  part_of_speech TEXT,
  meaning_vi TEXT NOT NULL,
  meaning_en TEXT,
  example_ko TEXT,
  example_vi TEXT,
  example_en TEXT,
  audio_url TEXT,
  image_url TEXT,
  topik_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_vocab_korean_meaning UNIQUE (korean, meaning_vi)
);

CREATE INDEX IF NOT EXISTS idx_vocab_korean ON public.vocabulary_items(korean);

CREATE TABLE IF NOT EXISTS public.lesson_vocabulary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  vocabulary_item_id UUID NOT NULL REFERENCES public.vocabulary_items(id) ON DELETE CASCADE,
  position INT DEFAULT 1,
  auto_add_to_srs BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LESSON SUBMISSIONS & DUAL-CONTROL WORKFLOW
CREATE TABLE IF NOT EXISTS public.lesson_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  version_id TEXT NOT NULL,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  note TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id),
  decision TEXT CHECK (decision IN ('approved', 'changes_requested', 'rejected')),
  decision_reason TEXT,
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_submissions_lesson ON public.lesson_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_submissions_author ON public.lesson_submissions(submitted_by);

-- 6. BLOCK-ANCHORED REVIEW COMMENTS
CREATE TABLE IF NOT EXISTS public.lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  block_id TEXT, -- anchored to block
  author_id UUID NOT NULL REFERENCES auth.users(id),
  author_role TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_lesson ON public.lesson_comments(lesson_id);

-- 7. VIEWS & RPCS FOR ANALYTICS AND PROGRESS
-- Level Progress View
CREATE OR REPLACE VIEW public.v_level_progress AS
SELECT 
  p.id AS user_id,
  l.id AS level_id,
  COUNT(CASE WHEN up.status = 'completed' THEN 1 END) AS completed_lessons,
  COUNT(les.id) AS total_lessons,
  CASE 
    WHEN COUNT(les.id) = 0 THEN 0
    ELSE ROUND((COUNT(CASE WHEN up.status = 'completed' THEN 1 END)::numeric / COUNT(les.id)::numeric) * 100)
  END AS progress_percent
FROM public.profiles p
CROSS JOIN public.levels l
LEFT JOIN public.lessons les ON les.level_id = l.id AND les.status = 'published' AND les.deleted_at IS NULL
LEFT JOIN public.user_progress up ON up.user_id = p.id AND up.lesson_id = les.id
GROUP BY p.id, l.id;

-- Teacher Lesson Stats View (starts, completions, avg_score, drop_off_block, hardest_exercises)
CREATE OR REPLACE VIEW public.v_teacher_lesson_stats AS
SELECT 
  les.id AS lesson_id,
  les.title,
  les.author_id,
  COUNT(up.id) AS starts,
  COUNT(CASE WHEN up.status = 'completed' THEN 1 END) AS completions,
  ROUND(AVG(COALESCE(up.score, 0)), 1) AS avg_score,
  ROUND(
    CASE 
      WHEN COUNT(up.id) = 0 THEN 0
      ELSE (COUNT(CASE WHEN up.status = 'completed' THEN 1 END)::numeric / COUNT(up.id)::numeric) * 100
    END, 1
  ) AS completion_rate,
  'grammar_rule_summary' AS drop_off_block,
  ARRAY['ex-grammar-match-1', 'ex-particle-choice-2']::text[] AS hardest_exercise_ids
FROM public.lessons les
LEFT JOIN public.user_progress up ON up.lesson_id = les.id
GROUP BY les.id, les.title, les.author_id;

-- 8. PERMISSIONS SEED FOR TEACHER STUDIO
INSERT INTO public.admin_permissions (id, module, resource, action, description) VALUES
  ('teaching.view', 'teaching', 'teaching', 'view', 'View Teacher Studio and own drafted curriculum'),
  ('teaching.create', 'teaching', 'teaching', 'create', 'Create new grammar and topic vocabulary lesson drafts within scope'),
  ('teaching.update', 'teaching', 'teaching', 'update', 'Edit own drafted lessons and content blocks within scope'),
  ('teaching.delete', 'teaching', 'teaching', 'delete', 'Delete own unsubmitted drafts'),
  ('teaching.submit', 'teaching', 'teaching', 'submit', 'Submit own drafts for publisher review'),
  ('teaching.analytics', 'teaching', 'teaching', 'analytics', 'View performance analytics and drop-off stats for own lessons')
ON CONFLICT (id) DO UPDATE SET
  resource = EXCLUDED.resource,
  action = EXCLUDED.action,
  description = EXCLUDED.description;

-- Grant permissions to teacher and content admins
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  -- Teacher role
  ('teacher', 'teaching.view'),
  ('teacher', 'teaching.create'),
  ('teacher', 'teaching.update'),
  ('teacher', 'teaching.delete'),
  ('teacher', 'teaching.submit'),
  ('teacher', 'teaching.analytics'),
  ('teacher', 'content.create'),
  ('teacher', 'content.update'),

  -- Content Editor
  ('content_editor', 'teaching.view'),
  ('content_editor', 'teaching.create'),
  ('content_editor', 'teaching.update'),
  ('content_editor', 'teaching.delete'),
  ('content_editor', 'teaching.submit'),

  -- Publisher
  ('publisher', 'teaching.view'),
  ('publisher', 'teaching.analytics'),

  -- Admin & Super Admin
  ('admin', 'teaching.view'),
  ('admin', 'teaching.create'),
  ('admin', 'teaching.update'),
  ('admin', 'teaching.delete'),
  ('admin', 'teaching.submit'),
  ('admin', 'teaching.analytics'),

  ('super_admin', 'teaching.view'),
  ('super_admin', 'teaching.create'),
  ('super_admin', 'teaching.update'),
  ('super_admin', 'teaching.delete'),
  ('super_admin', 'teaching.submit'),
  ('super_admin', 'teaching.analytics')
ON CONFLICT DO NOTHING;

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.teacher_content_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_tag_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_grammar_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

-- Scopes Policies
DROP POLICY IF EXISTS "Teachers can view own content scopes" ON public.teacher_content_scopes;
CREATE POLICY "Teachers can view own content scopes" ON public.teacher_content_scopes
  FOR SELECT TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.staff_members sm 
    WHERE sm.user_id = auth.uid() AND sm.role_id IN ('admin', 'super_admin')
  ));

-- Lessons Policies
DROP POLICY IF EXISTS "Learners can view published lessons" ON public.lessons;
CREATE POLICY "Learners can view published lessons" ON public.lessons
  FOR SELECT TO authenticated, anon
  USING (status = 'published' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Teachers can view own drafts and scoped lessons" ON public.lessons;
CREATE POLICY "Teachers can view own drafts and scoped lessons" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    author_id = auth.uid()
    OR status = 'published'
    OR EXISTS (
      SELECT 1 FROM public.staff_members sm 
      WHERE sm.user_id = auth.uid() AND sm.role_id IN ('admin', 'super_admin', 'publisher')
    )
  );

DROP POLICY IF EXISTS "Teachers can insert lessons within assigned scope" ON public.lessons;
CREATE POLICY "Teachers can insert lessons within assigned scope" ON public.lessons
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND status = 'draft'
    AND (
      EXISTS (
        SELECT 1 FROM public.teacher_content_scopes tcs
        WHERE tcs.teacher_id = auth.uid()
          AND tcs.level_code = level_id
          AND tcs.lesson_kind = lesson_kind
      )
      OR EXISTS (
        SELECT 1 FROM public.staff_members sm 
        WHERE sm.user_id = auth.uid() AND sm.role_id IN ('admin', 'super_admin', 'content_editor')
      )
    )
  );

DROP POLICY IF EXISTS "Teachers can update own drafts only" ON public.lessons;
CREATE POLICY "Teachers can update own drafts only" ON public.lessons
  FOR UPDATE TO authenticated
  USING (
    (author_id = auth.uid() AND status IN ('draft', 'changes_requested'))
    OR EXISTS (
      SELECT 1 FROM public.staff_members sm 
      WHERE sm.user_id = auth.uid() AND sm.role_id IN ('admin', 'super_admin', 'publisher')
    )
  )
  WITH CHECK (
    -- Teacher cannot set status to approved or published
    (status NOT IN ('approved', 'published') OR EXISTS (
      SELECT 1 FROM public.staff_members sm 
      WHERE sm.user_id = auth.uid() AND sm.role_id IN ('admin', 'super_admin', 'publisher')
      AND sm.user_id != author_id -- Dual control / Two-Person Rule
    ))
  );

DROP POLICY IF EXISTS "Teachers can delete own drafts only" ON public.lessons;
CREATE POLICY "Teachers can delete own drafts only" ON public.lessons
  FOR DELETE TO authenticated
  USING (
    (author_id = auth.uid() AND status = 'draft')
    OR EXISTS (
      SELECT 1 FROM public.staff_members sm 
      WHERE sm.user_id = auth.uid() AND sm.role_id IN ('admin', 'super_admin')
    )
  );

-- Tags & Banks Read/Write
CREATE POLICY "Public read tags and vocabulary" ON public.vocabulary_items
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Public read grammar points" ON public.grammar_points
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Teachers can manage vocabulary within studio" ON public.vocabulary_items
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Teachers can manage grammar within studio" ON public.grammar_points
  FOR ALL TO authenticated USING (true);

-- 10. SEED DATA FOR DEMO & TESTING
-- Seed sample tags
INSERT INTO public.lesson_tags (id, slug, label_vi, label_en, korean_pattern) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'topic-particle', 'Tiểu từ chủ đề 은/는', 'Topic Particle 은/는', 'N은/는'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'noun-ending', 'Đuôi câu danh từ 이에요/예요', 'Noun Ending 이에요/예요', 'N이에요/예요'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'subject-particle', 'Tiểu từ chủ ngữ 이/가', 'Subject Particle 이/가', 'N이/가'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'existence-verb', 'Động từ tồn tại 있어요/없어요', 'Existence Verb 있어요/없어요', 'N이/가 있어요/없어요'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'greetings', 'Chào hỏi & Giao tiếp cơ bản', 'Greetings & Courtesies', '인사말')
ON CONFLICT (slug) DO NOTHING;

-- Seed Grammar Point 1: 은/는 + 이에요/예요
INSERT INTO public.grammar_points (
  id, slug, title_vi, title_en, korean_pattern, formula, explanation_vi, explanation_en, attachment_rules, examples, common_mistakes
) VALUES (
  'b2c3d4e5-0001-4000-8000-000000000001',
  'topic-particle-and-noun-ending',
  'Giới thiệu bản thân: N은/는 N이에요/예요',
  'Self-introduction: N은/는 N이에요/예요',
  'N은/는 N이에요/예요',
  'Danh từ 1 + 은/는 + Danh từ 2 + 이에요/예요',
  'Dùng để giới thiệu danh tính, nghề nghiệp, quốc tịch trong ngữ cảnh thân mật lịch sự.',
  'Used to introduce identity, profession, and nationality in polite informal speech.',
  '[
    {"condition": "Danh từ có 받침 (phụ âm dưới)", "particle": "은", "ending": "이에요", "example": "선생님은 ... 이에요"},
    {"condition": "Danh từ không có 받침 (kết thúc nguyên âm)", "particle": "는", "ending": "예요", "example": "저는 ... 예요"}
  ]'::jsonb,
  '[
    {"korean": "저는 베트남 사람이에요.", "romanization": "Jeoneun beteunam saram-ieyo.", "meaning_vi": "Tôi là người Việt Nam.", "meaning_en": "I am Vietnamese."},
    {"korean": "민수 씨는 학생이에요.", "romanization": "Minsu ssineun haksaeng-ieyo.", "meaning_vi": "Minsoo là học sinh.", "meaning_en": "Minsoo is a student."},
    {"korean": "이것은 한국어 책이에요.", "romanization": "Igeoseun hangugeo chaeg-ieyo.", "meaning_vi": "Đây là sách tiếng Hàn.", "meaning_en": "This is a Korean book."},
    {"korean": "제 이름은 린이에요.", "romanization": "Je ireumeun Rin-ieyo.", "meaning_vi": "Tên tôi là Linh.", "meaning_en": "My name is Linh."},
    {"korean": "여기는 서울대학교예요.", "romanization": "Yeogineun Seoul daehakgyo-yeyo.", "meaning_vi": "Đây là Đại học Quốc gia Seoul.", "meaning_en": "This is Seoul National University."}
  ]'::jsonb,
  'Nhầm lẫn giữa 이에요 (dành cho từ có patchim) và 예요 (dành cho từ không patchim).'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Grammar Point 2: 이/가 있어요/없어요
INSERT INTO public.grammar_points (
  id, slug, title_vi, title_en, korean_pattern, formula, explanation_vi, explanation_en, attachment_rules, examples, common_mistakes
) VALUES (
  'b2c3d4e5-0002-4000-8000-000000000002',
  'existence-and-possession',
  'Tồn tại & Sở hữu: N이/가 있어요/없어요',
  'Existence and Possession: N이/가 있어요/없어요',
  'N이/가 있어요/없어요',
  'Danh từ + 이/가 + 있어요 (Có) / 없어요 (Không có)',
  'Dùng để diễn đạt sự có mặt/vắng mặt ở một địa điểm, hoặc việc sở hữu một đồ vật/quan hệ.',
  'Expresses existence in a location or possession of an item/relationship.',
  '[
    {"condition": "Danh từ có 받침", "particle": "이", "example": "책이 있어요"},
    {"condition": "Danh từ không có 받침", "particle": "가", "example": "친구가 있어요"}
  ]'::jsonb,
  '[
    {"korean": "저는 한국 친구가 있어요.", "romanization": "Jeoneun hanguk chinguga isseoyo.", "meaning_vi": "Tôi có bạn người Hàn Quốc.", "meaning_en": "I have Korean friends."},
    {"korean": "교실에 컴퓨터가 있어요.", "romanization": "Gyosire keompyuteoga isseoyo.", "meaning_vi": "Trong phòng học có máy vi tính.", "meaning_en": "There is a computer in the classroom."},
    {"korean": "지금 지갑이 없어요.", "romanization": "Jigeum jigabi eopseoyo.", "meaning_vi": "Bây giờ tôi không có ví tiền.", "meaning_en": "I do not have a wallet right now."},
    {"korean": "시간이 있어요?", "romanization": "Sigani isseoyo?", "meaning_vi": "Bạn có thời gian không?", "meaning_en": "Do you have time?"},
    {"korean": "우산이 없어요.", "romanization": "Usani eopseoyo.", "meaning_vi": "Tôi không có ô/dù.", "meaning_en": "I do not have an umbrella."}
  ]'::jsonb,
  'Nhầm lẫn giữa tiểu từ chủ ngữ 이/가 với tiểu từ tân ngữ 을/를 khi dùng với 있어요/없어요.'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Vocabulary Items for Topic Lesson
INSERT INTO public.vocabulary_items (korean, romanization, part_of_speech, meaning_vi, meaning_en, example_ko, example_vi, example_en, topik_level) VALUES
  ('안녕하세요', 'annyeonghaseyo', 'interjection', 'Xin chào', 'Hello / Good morning', '선생님, 안녕하세요!', 'Em chào thầy cô ạ!', 'Hello, teacher!', 'TOPIK 1'),
  ('감사합니다', 'gamsahamnida', 'expression', 'Xin cảm ơn', 'Thank you', '도와주셔서 감사합니다.', 'Cảm ơn vì đã giúp đỡ tôi.', 'Thank you for your help.', 'TOPIK 1'),
  ('죄송합니다', 'joesonghamnida', 'expression', 'Xin lỗi', 'I am sorry', '늦어서 죄송합니다.', 'Xin lỗi vì tôi đến muộn.', 'I am sorry for being late.', 'TOPIK 1'),
  ('안녕히 계세요', 'annyeonghi gyeseyo', 'expression', 'Tạm biệt (khi mình ra về, đối phương ở lại)', 'Goodbye (stay well)', '먼저 가겠습니다. 안녕히 계세요.', 'Tôi xin phép về trước, chào bạn ở lại nhé.', 'I will leave first. Goodbye.', 'TOPIK 1'),
  ('안녕히 가세요', 'annyeonghi gaseyo', 'expression', 'Tạm biệt (khi đối phương ra về)', 'Goodbye (go safely)', '조심히 들어가세요. 안녕히 가세요.', 'Đi cẩn thận nhé, tạm biệt bạn.', 'Take care. Goodbye.', 'TOPIK 1'),
  ('처음 뵙겠습니다', 'cheoeum boepgetseumnida', 'expression', 'Rất hân hạnh được gặp bạn lần đầu', 'Nice to meet you for the first time', '처음 뵙겠습니다. 잘 부탁드립니다.', 'Rất hân hạnh được gặp anh, xin hãy chỉ giáo thêm.', 'Pleased to meet you.', 'TOPIK 1'),
  ('만나서 반갑습니다', 'mannaseo bangapseumnida', 'expression', 'Rất vui được gặp bạn', 'Nice to meet you', '만나서 반갑습니다, 린 씨.', 'Rất vui được gặp bạn, Linh.', 'Nice to meet you, Linh.', 'TOPIK 1'),
  ('네 / 아니요', 'ne / aniyo', 'interjection', 'Vâng / Không', 'Yes / No', '네, 맞습니다.', 'Vâng, đúng vậy ạ.', 'Yes, that is correct.', 'TOPIK 1')
ON CONFLICT (korean, meaning_vi) DO NOTHING;
