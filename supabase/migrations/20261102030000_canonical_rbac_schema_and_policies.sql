-- ==============================================================================
-- Migration: Canonical RBAC Schema, Permissions Matrix & Immutability Policies
-- Version: 20261102030000
-- ==============================================================================

-- 1. EXTEND ADMIN_ROLES WITH CANONICAL 9 ROLES
INSERT INTO public.admin_roles (id, name, description) VALUES
  ('super_admin', 'Super Administrator', 'Full unconstrained administrative access to all systems, settings, and audits'),
  ('admin', 'Administrator', 'Day-to-day operations: approve content, manage learners & staff, handle refunds and view revenue'),
  ('content_editor', 'Content Editor', 'Draft lessons, vocabulary, and questions; cannot self-approve or publish'),
  ('publisher', 'Publisher & Reviewer', 'Review and publish content; cannot self-approve own authored content'),
  ('teacher', 'Teacher & Instructor', 'View curriculum, track student progress and grade tests for own enrolled classes'),
  ('sales_crm', 'Sales & CRM', 'Manage leads, consultation bookings, order tracking, and refund proposals'),
  ('support_agent', 'Support Agent', 'Handle learner inquiries, view masked PII for support tickets, report bugs'),
  ('marketing', 'Marketing & Growth', 'Manage coupons, promotional banners, popup campaigns and aggregate metrics'),
  ('read_only', 'Auditor & Observer', 'Read-only access to non-sensitive aggregated reports and audit logs')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Compatibility alias view for roles
CREATE OR REPLACE VIEW public.roles AS
  SELECT id, name, description, created_at FROM public.admin_roles;

-- 2. CANONICAL PERMISSIONS IN resource.action FORMAT
-- Add resource and action columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_permissions' AND column_name = 'resource') THEN
    ALTER TABLE public.admin_permissions ADD COLUMN resource TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_permissions' AND column_name = 'action') THEN
    ALTER TABLE public.admin_permissions ADD COLUMN action TEXT;
  END IF;
END $$;

-- Populate canonical permissions
INSERT INTO public.admin_permissions (id, module, resource, action, description) VALUES
  -- Content permissions
  ('content.view', 'content', 'content', 'view', 'View lessons, vocabulary, and roadmap nodes'),
  ('content.create', 'content', 'content', 'create', 'Create lesson and curriculum drafts'),
  ('content.update', 'content', 'content', 'update', 'Edit lesson and curriculum drafts'),
  ('content.delete', 'content', 'content', 'delete', 'Delete content drafts or lessons'),
  ('content.approve', 'content', 'content', 'approve', 'Approve lesson drafts (Dual control required)'),
  ('content.publish', 'content', 'content', 'publish', 'Publish or rollback live content'),

  -- Learner permissions
  ('learners.view', 'learners', 'learners', 'view', 'View learners directory and public profiles'),
  ('learners.view_pii', 'learners', 'learners', 'view_pii', 'View unmasked learner email and phone numbers'),
  ('learners.update', 'learners', 'learners', 'update', 'Update learner profile, status, XP, or streak'),
  ('learners.delete', 'learners', 'learners', 'delete', 'Delete or permanently archive a learner account'),

  -- Orders & Revenue permissions
  ('orders.view', 'orders', 'orders', 'view', 'View orders, subscriptions, and payment statuses'),
  ('orders.refund_propose', 'orders', 'orders', 'refund_propose', 'Propose a refund request for an order'),
  ('orders.refund_approve', 'orders', 'orders', 'refund_approve', 'Approve and execute a refund payout'),
  ('revenue.view', 'analytics', 'revenue', 'view', 'View exact revenue figures and financial metrics'),

  -- Leads & Consultation
  ('leads.view', 'crm', 'leads', 'view', 'View consultation inquiries and CRM leads'),
  ('leads.create', 'crm', 'leads', 'create', 'Create a new prospective lead or inquiry'),
  ('leads.update', 'crm', 'leads', 'update', 'Update lead status, advisor notes, or schedule call'),
  ('leads.delete', 'crm', 'leads', 'delete', 'Delete obsolete lead records'),

  -- Marketing
  ('marketing.view', 'marketing', 'marketing', 'view', 'View coupons, banners, and campaigns'),
  ('marketing.manage', 'marketing', 'marketing', 'manage', 'Create, edit, toggle, or delete coupons and banners'),

  -- Reports & Analytics
  ('reports.view', 'analytics', 'reports', 'view', 'View analytics, funnel data, and completion charts'),
  ('reports.export', 'analytics', 'reports', 'export', 'Export learner, sales, or lead data to CSV'),

  -- System & Staff Administration
  ('system.settings_edit', 'settings', 'system', 'settings_edit', 'Edit platform configuration and feature flags'),
  ('system.manage_roles', 'settings', 'system', 'manage_roles', 'Invite staff, assign roles, and modify permissions'),
  ('system.audit_view', 'audit', 'system', 'audit_view', 'Inspect immutable audit logs'),
  ('system.impersonate', 'system', 'system', 'impersonate', 'Simulate learner account in read-only mode (15 min)')
ON CONFLICT (id) DO UPDATE SET
  resource = EXCLUDED.resource,
  action = EXCLUDED.action,
  description = EXCLUDED.description;

-- Compatibility view for permissions
CREATE OR REPLACE VIEW public.permissions AS
  SELECT id, resource, action, description FROM public.admin_permissions;

-- 3. ROLE-PERMISSION MAPPINGS FOR CANONICAL 9 ROLES
-- Clear existing to avoid duplicate / inconsistent legacy entries
DELETE FROM public.role_permissions WHERE role_id IN (
  'super_admin', 'admin', 'content_editor', 'publisher', 'teacher',
  'sales_crm', 'support_agent', 'marketing', 'read_only'
);

-- Seed canonical mappings
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  -- 1. super_admin: All permissions
  ('super_admin', 'content.view'), ('super_admin', 'content.create'), ('super_admin', 'content.update'),
  ('super_admin', 'content.delete'), ('super_admin', 'content.approve'), ('super_admin', 'content.publish'),
  ('super_admin', 'learners.view'), ('super_admin', 'learners.view_pii'), ('super_admin', 'learners.update'), ('super_admin', 'learners.delete'),
  ('super_admin', 'orders.view'), ('super_admin', 'orders.refund_propose'), ('super_admin', 'orders.refund_approve'),
  ('super_admin', 'revenue.view'), ('super_admin', 'leads.view'), ('super_admin', 'leads.create'), ('super_admin', 'leads.update'), ('super_admin', 'leads.delete'),
  ('super_admin', 'marketing.view'), ('super_admin', 'marketing.manage'),
  ('super_admin', 'reports.view'), ('super_admin', 'reports.export'),
  ('super_admin', 'system.settings_edit'), ('super_admin', 'system.manage_roles'), ('super_admin', 'system.audit_view'), ('super_admin', 'system.impersonate'),
  -- Legacy aliases for backwards-compatibility
  ('super_admin', 'content:read'), ('super_admin', 'content:write'), ('super_admin', 'content:publish'),
  ('super_admin', 'learners:read'), ('super_admin', 'learners:write'),
  ('super_admin', 'crm:read'), ('super_admin', 'crm:write'),
  ('super_admin', 'marketing:manage'), ('super_admin', 'analytics:read'),
  ('super_admin', 'settings:manage'), ('super_admin', 'audit:read'),

  -- 2. admin: Daily operations
  ('admin', 'content.view'), ('admin', 'content.create'), ('admin', 'content.update'), ('admin', 'content.approve'), ('admin', 'content.publish'),
  ('admin', 'learners.view'), ('admin', 'learners.view_pii'), ('admin', 'learners.update'),
  ('admin', 'orders.view'), ('admin', 'orders.refund_propose'), ('admin', 'orders.refund_approve'),
  ('admin', 'revenue.view'), ('admin', 'leads.view'), ('admin', 'leads.create'), ('admin', 'leads.update'),
  ('admin', 'marketing.view'), ('admin', 'marketing.manage'),
  ('admin', 'reports.view'), ('admin', 'reports.export'),
  ('admin', 'system.manage_roles'), ('admin', 'system.audit_view'),
  ('admin', 'content:read'), ('admin', 'content:write'), ('admin', 'content:publish'),
  ('admin', 'learners:read'), ('admin', 'learners:write'), ('admin', 'analytics:read'),

  -- 3. content_editor: Drafts only
  ('content_editor', 'content.view'), ('content_editor', 'content.create'), ('content_editor', 'content.update'),
  ('content_editor', 'content:read'), ('content_editor', 'content:write'),

  -- 4. publisher: Review & Publish
  ('publisher', 'content.view'), ('publisher', 'content.create'), ('publisher', 'content.update'),
  ('publisher', 'content.approve'), ('publisher', 'content.publish'),
  ('publisher', 'system.audit_view'),
  ('publisher', 'content:read'), ('publisher', 'content:write'), ('publisher', 'content:publish'),

  -- 5. teacher: Scoped to classes
  ('teacher', 'content.view'), ('teacher', 'learners.view'),
  ('teacher', 'leads.view'), ('teacher', 'leads.update'),
  ('teacher', 'reports.view'),
  ('teacher', 'content:read'), ('teacher', 'learners:read'),

  -- 6. sales_crm: Leads, Orders, Propose Refund, View Revenue
  ('sales_crm', 'content.view'), ('sales_crm', 'learners.view'),
  ('sales_crm', 'orders.view'), ('sales_crm', 'orders.refund_propose'),
  ('sales_crm', 'revenue.view'),
  ('sales_crm', 'leads.view'), ('sales_crm', 'leads.create'), ('sales_crm', 'leads.update'), ('sales_crm', 'leads.delete'),
  ('sales_crm', 'marketing.view'), ('sales_crm', 'reports.view'), ('sales_crm', 'reports.export'),
  ('sales_crm', 'crm:read'), ('sales_crm', 'crm:write'),

  -- 7. support_agent: Unmasked PII for support tickets, Orders, Leads, No Revenue
  ('support_agent', 'content.view'), ('support_agent', 'learners.view'), ('support_agent', 'learners.view_pii'),
  ('support_agent', 'orders.view'), ('support_agent', 'leads.view'), ('support_agent', 'leads.update'),
  ('support_agent', 'marketing.view'), ('support_agent', 'reports.view'),
  ('support_agent', 'learners:read'), ('support_agent', 'crm:read'),

  -- 8. marketing: Coupons, Banners, Overview
  ('marketing', 'content.view'), ('marketing', 'learners.view'),
  ('marketing', 'marketing.view'), ('marketing', 'marketing.manage'),
  ('marketing', 'reports.view'), ('marketing', 'reports.export'),
  ('marketing', 'marketing:manage'), ('marketing', 'analytics:read'),

  -- 9. read_only: Masked read only
  ('read_only', 'content.view'), ('read_only', 'learners.view'),
  ('read_only', 'orders.view'), ('read_only', 'leads.view'),
  ('read_only', 'marketing.view'), ('read_only', 'reports.view'),
  ('read_only', 'content:read'), ('read_only', 'analytics:read')
ON CONFLICT DO NOTHING;

-- 4. STAFF PERMISSION OVERRIDES & CLASS ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.staff_permission_overrides (
  staff_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_id TEXT REFERENCES public.admin_permissions(id) ON DELETE CASCADE,
  effect TEXT CHECK (effect IN ('allow', 'deny')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (staff_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (teacher_id, learner_id, class_name)
);

CREATE TABLE IF NOT EXISTS public.impersonation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  super_admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ended_at TIMESTAMPTZ
);

-- 5. FUNCTION TO RESOLVE EFFECTIVE PERMISSION
CREATE OR REPLACE FUNCTION public.has_permission(req_resource TEXT, req_action TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  WITH user_role AS (
    SELECT role_id FROM public.admin_users WHERE id = auth.uid() AND is_active = true
  ),
  override AS (
    SELECT effect FROM public.staff_permission_overrides spo
    JOIN public.admin_permissions ap ON spo.permission_id = ap.id
    WHERE spo.staff_id = auth.uid()
      AND ap.resource = req_resource
      AND ap.action = req_action
    LIMIT 1
  )
  SELECT CASE
    -- Explicit deny override
    WHEN (SELECT effect FROM override) = 'deny' THEN false
    -- Explicit allow override
    WHEN (SELECT effect FROM override) = 'allow' THEN true
    -- Super admin fallback
    WHEN (SELECT role_id FROM user_role) = 'super_admin' THEN true
    -- Role permission check
    ELSE EXISTS (
      SELECT 1 
      FROM public.role_permissions rp
      JOIN public.admin_permissions ap ON rp.permission_id = ap.id
      WHERE rp.role_id = (SELECT role_id FROM user_role)
        AND ap.resource = req_resource
        AND ap.action = req_action
    )
  END;
$$;

-- 6. IMMUTABLE AUDIT LOG RLS POLICIES
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Prevent audit log modification" ON public.audit_logs;
CREATE POLICY "Prevent audit log modification" ON public.audit_logs
  FOR UPDATE TO authenticated
  USING (false);

DROP POLICY IF EXISTS "Prevent audit log deletion" ON public.audit_logs;
CREATE POLICY "Prevent audit log deletion" ON public.audit_logs
  FOR DELETE TO authenticated
  USING (false);

-- 7. RESTRICT CONTENT DRAFT STATUS FOR EDITORS
DROP POLICY IF EXISTS "Content editor write drafts only" ON public.content_versions;
CREATE POLICY "Content editor write drafts only" ON public.content_versions
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_permission('content', 'publish') 
    OR (public.has_permission('content', 'create') AND status IN ('draft', 'in_review'))
  );
