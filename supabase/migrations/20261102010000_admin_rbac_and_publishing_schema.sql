-- ==============================================================================
-- Migration: Admin Portal Schema (RBAC, Publishing Versions, Audit, Analytics & Reports)
-- Safe, idempotent execution preserving existing learner data
-- ==============================================================================

-- 1. ADMIN ROLES TABLE
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.admin_roles (id, name, description) VALUES
  ('super_admin', 'Super Administrator', 'Full unconstrained administrative access to all systems, settings, and audits'),
  ('content_editor', 'Content Editor', 'Create, edit, review, and draft lessons, vocabulary, and curriculum content'),
  ('counselor', 'Academic Counselor', 'Manage prospective leads, 1-on-1 consultation appointments, and placement tests'),
  ('marketer', 'Marketing Specialist', 'Manage discount coupons, promotional banners, public testimonials, and growth analytics'),
  ('support', 'Customer Support Specialist', 'Handle student issue reports, tickets, learning progress questions, and feedback')
ON CONFLICT (id) DO NOTHING;

-- 2. ADMIN PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO public.admin_permissions (id, module, description) VALUES
  ('content:read', 'content', 'View curriculum, levels, lessons, and draft versions'),
  ('content:write', 'content', 'Create and modify lesson drafts, exercises, and vocabulary'),
  ('content:publish', 'content', 'Publish, rollback, or unpublish content versions to live site'),
  ('learners:read', 'learners', 'View student directories, profiles, and learning progress'),
  ('learners:write', 'learners', 'Adjust student XP, streak days, and account permissions'),
  ('crm:read', 'crm', 'View consultation leads, appointments, and contact inquiries'),
  ('crm:write', 'crm', 'Update lead status, log advisor notes, and manage schedule bookings'),
  ('marketing:manage', 'marketing', 'Create and toggle coupons, banners, and homepage showcases'),
  ('analytics:read', 'analytics', 'Access aggregated performance, completion, and revenue analytics'),
  ('settings:manage', 'settings', 'Configure system settings, feature flags, and maintenance mode'),
  ('audit:read', 'audit', 'Inspect system-wide administrative audit trails and security logs')
ON CONFLICT (id) DO NOTHING;

-- 3. ROLE PERMISSIONS MAPPING TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id TEXT REFERENCES public.admin_roles(id) ON DELETE CASCADE,
  permission_id TEXT REFERENCES public.admin_permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Assign permissions to roles
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  -- super_admin: All permissions
  ('super_admin', 'content:read'), ('super_admin', 'content:write'), ('super_admin', 'content:publish'),
  ('super_admin', 'learners:read'), ('super_admin', 'learners:write'),
  ('super_admin', 'crm:read'), ('super_admin', 'crm:write'),
  ('super_admin', 'marketing:manage'), ('super_admin', 'analytics:read'),
  ('super_admin', 'settings:manage'), ('super_admin', 'audit:read'),
  -- content_editor
  ('content_editor', 'content:read'), ('content_editor', 'content:write'), ('content_editor', 'content:publish'),
  ('content_editor', 'analytics:read'),
  -- counselor
  ('counselor', 'crm:read'), ('counselor', 'crm:write'),
  ('counselor', 'learners:read'),
  -- marketer
  ('marketer', 'marketing:manage'), ('marketer', 'analytics:read'),
  ('marketer', 'content:read'),
  -- support
  ('support', 'learners:read'), ('support', 'learners:write'),
  ('support', 'content:read'), ('support', 'crm:read')
ON CONFLICT DO NOTHING;

-- 4. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role_id TEXT REFERENCES public.admin_roles(id) DEFAULT 'support',
  is_active BOOLEAN DEFAULT true,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL, -- e.g. 'lesson:publish', 'user:adjust_xp', 'coupon:create'
  entity_type TEXT NOT NULL, -- 'lesson' | 'lead' | 'coupon' | 'setting' | 'user'
  entity_id TEXT NOT NULL,
  details JSONB, -- stores before / after snapshot or delta
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- 6. CONTENT VERSIONS TABLE (Single Source of Truth & Zero-Downtime Publishing)
CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'lesson' | 'level' | 'vocab' | 'quiz'
  entity_id TEXT NOT NULL,
  version_number INT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft' | 'pending_approval' | 'published' | 'archived'
  title TEXT NOT NULL,
  data JSONB NOT NULL, -- full draft/published payload
  changelog TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_content_versions_lookup ON public.content_versions(entity_type, entity_id, status);

-- Add published_version_id to lessons if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'published_version_id'
  ) THEN
    ALTER TABLE public.lessons ADD COLUMN published_version_id UUID REFERENCES public.content_versions(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.lessons ADD COLUMN status TEXT DEFAULT 'published';
  END IF;
END $$;

-- 7. CONTENT REPORTS TABLE (Learner "Report a problem" tickets)
CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT,
  lesson_id TEXT,
  context_text TEXT,
  issue_category TEXT NOT NULL, -- 'audio_error' | 'typo' | 'grammar_mistake' | 'bug' | 'other'
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- 'open' | 'investigating' | 'resolved' | 'dismissed'
  staff_notes TEXT,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON public.content_reports(status, created_at DESC);

-- 8. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL, -- 'lesson_started' | 'lesson_completed' | 'exercise_answered' | 'card_reviewed' | 'signup_completed' | 'order_paid'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id, created_at DESC);

-- 9. SYSTEM SETTINGS TABLE (Feature Flags, Maintenance, Gamification Config)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  category TEXT DEFAULT 'general', -- 'general' | 'gamification' | 'maintenance' | 'feature_flags'
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.system_settings (key, value, category, description) VALUES
  ('maintenance_mode', '{"enabled": false, "message": "Hệ thống đang bảo trì định kỳ trong ít phút."}'::jsonb, 'maintenance', 'Global learner maintenance banner and access gate'),
  ('feature_flags', '{"ai_honey_live": true, "speech_recognition": true, "online_topik_mock": true}'::jsonb, 'feature_flags', 'Toggle active features across the platform'),
  ('gamification_multipliers', '{"lesson_bonus": 1.0, "streak_multiplier": 1.2, "weekend_xp": 1.5}'::jsonb, 'gamification', 'XP rewards configuration matrix'),
  ('announcement_banner', '{"active": false, "text": "Khai giảng khóa luyện thi TOPIK cấp tốc tháng 11!", "link": "/courses"}'::jsonb, 'general', 'Top announcement notification banner')
ON CONFLICT (key) DO NOTHING;

-- 10. ENABLE RLS ON NEW TABLES
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow public insertion of analytics events and content problem reports
CREATE POLICY "Anyone can emit analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Learners can submit content reports" ON public.content_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public system settings read" ON public.system_settings FOR SELECT USING (true);
