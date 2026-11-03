-- ==============================================================================
-- Migration: RBAC v2 Single Source of Truth & Database Seed Matrix
-- Version: 20261103010000
-- Purpose: Strict Default-Deny, Danger List Guard, Zero Leakage for Support Agent
-- ==============================================================================

-- 1. Ensure Capability/Permission schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_permissions' AND column_name = 'is_danger') THEN
    ALTER TABLE public.admin_permissions ADD COLUMN is_danger BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_permissions' AND column_name = 'category') THEN
    ALTER TABLE public.admin_permissions ADD COLUMN category TEXT DEFAULT 'general';
  END IF;
END $$;

-- 2. Populate/Update Canonical Permissions & Granular Capabilities
INSERT INTO public.admin_permissions (id, module, resource, action, is_danger, category, description) VALUES
  -- Content
  ('content.view', 'content', 'content', 'view', false, 'content', 'View lessons, vocabulary, and roadmap nodes'),
  ('content.create', 'content', 'content', 'create', false, 'content', 'Create lesson and curriculum drafts'),
  ('content.update', 'content', 'content', 'update', false, 'content', 'Edit lesson and curriculum drafts'),
  ('content.delete', 'content', 'content', 'delete', false, 'content', 'Delete content drafts or lessons'),
  ('content.approve', 'content', 'content', 'approve', false, 'content', 'Approve lesson drafts (Dual control required)'),
  ('content.publish', 'content', 'content', 'publish', false, 'content', 'Publish live curriculum to learner roadmap'),
  ('content.export', 'content', 'content', 'export', false, 'content', 'Export curriculum materials to JSON/CSV'),

  -- Teaching Studio
  ('teaching.view', 'teaching', 'teaching', 'view', false, 'teaching', 'Access teacher studio workspace and own lessons'),
  ('teaching.create', 'teaching', 'teaching', 'create', false, 'teaching', 'Create teacher lesson drafts, grammar points, and vocabulary items'),
  ('teaching.update', 'teaching', 'teaching', 'update', false, 'teaching', 'Edit own draft lessons and vocabulary items'),
  ('teaching.delete', 'teaching', 'teaching', 'delete', false, 'teaching', 'Delete own draft lessons'),
  ('teaching.approve', 'teaching', 'teaching', 'approve', false, 'teaching', 'Reviewer approve teacher draft (author !== reviewer)'),
  ('teaching.publish', 'teaching', 'teaching', 'publish', false, 'teaching', 'Publish teacher lesson to roadmap'),
  ('teaching.export', 'teaching', 'teaching', 'export', false, 'teaching', 'Export teacher curriculum scope'),

  -- Learners
  ('learners.view', 'learners', 'learners', 'view', false, 'learners', 'View learners directory or lookup specific profile'),
  ('learners.create', 'learners', 'learners', 'create', false, 'learners', 'Manually register a learner account'),
  ('learners.update', 'learners', 'learners', 'update', false, 'learners', 'Update learner progress, XP, or status'),
  ('learners.delete', 'learners', 'learners', 'delete', false, 'learners', 'Soft-delete or suspend learner account'),
  ('learners.export', 'learners', 'learners', 'export', false, 'learners', 'Export scoped learner lists with masked PII'),

  -- Orders & Financial
  ('orders.view', 'orders', 'orders', 'view', false, 'orders', 'View customer orders and subscription details'),
  ('orders.create', 'orders', 'orders', 'create', false, 'orders', 'Create offline manual enrollment order'),
  ('orders.update', 'orders', 'orders', 'update', false, 'orders', 'Update order notes or processing status'),
  ('orders.delete', 'orders', 'orders', 'delete', false, 'orders', 'Void an unpaid order draft'),
  ('orders.approve', 'orders', 'orders', 'approve', false, 'orders', 'Approve customer refund payout (Two-Person rule)'),
  ('orders.export', 'orders', 'orders', 'export', false, 'orders', 'Export orders and reconciliation sheets'),

  -- Leads & Consultation
  ('leads.view', 'crm', 'leads', 'view', false, 'crm', 'View consultation inquiries and support tickets'),
  ('leads.create', 'crm', 'leads', 'create', false, 'crm', 'Log a new consultation lead inquiry'),
  ('leads.update', 'crm', 'leads', 'update', false, 'leads', 'Update lead stage, counseling notes or call status'),
  ('leads.delete', 'crm', 'leads', 'delete', false, 'leads', 'Remove duplicate or spam lead entries'),
  ('leads.export', 'crm', 'leads', 'export', false, 'crm', 'Export lead contact list for outreach'),

  -- Marketing & Growth
  ('marketing.view', 'marketing', 'marketing', 'view', false, 'marketing', 'View discount coupons, banners and campaigns'),
  ('marketing.create', 'marketing', 'marketing', 'create', false, 'marketing', 'Create new promo discount codes or banners'),
  ('marketing.update', 'marketing', 'marketing', 'update', false, 'marketing', 'Edit coupon rules or banner schedule'),
  ('marketing.delete', 'marketing', 'marketing', 'delete', false, 'marketing', 'Deactivate or delete promotional campaigns'),
  ('marketing.export', 'marketing', 'marketing', 'export', false, 'marketing', 'Export campaign conversion metrics'),

  -- Analytics & Reports
  ('analytics.view', 'analytics', 'analytics', 'view', false, 'analytics', 'View aggregated dashboards and learner funnels'),
  ('analytics.export', 'analytics', 'analytics', 'export', false, 'analytics', 'Export aggregated performance reports'),

  -- System
  ('system.view', 'system', 'system', 'view', false, 'system', 'View system status and active services'),
  ('system.update', 'system', 'system', 'update', false, 'system', 'Modify non-sensitive system settings'),
  ('system.delete', 'system', 'system', 'delete', true, 'system', 'Purge system cache or logs'),

  -- Granular Capabilities
  ('view_pii', 'privacy', 'learners', 'view_pii', false, 'capability', 'View contact information (email, phone number)'),
  ('reveal_pii', 'privacy', 'learners', 'reveal_pii', false, 'capability', 'Temporarily reveal masked PII with reason prompt'),
  ('view_revenue', 'financial', 'orders', 'view_revenue', false, 'capability', 'View exact currency amount figures and revenue totals'),
  ('view_order_counts', 'financial', 'orders', 'view_order_counts', false, 'capability', 'View order volume indicators and badges'),
  ('view_segment_counts', 'crm', 'learners', 'view_segment_counts', false, 'capability', 'View breakdown counts of VIP/Trial/Expired plans'),
  ('propose_refund', 'financial', 'orders', 'propose_refund', false, 'capability', 'Propose a refund request on an order'),
  ('flag_refund', 'financial', 'orders', 'flag_refund', false, 'capability', 'Flag billing issue for billing admin review'),
  ('approve_refund', 'financial', 'orders', 'approve_refund', false, 'capability', 'Approve refund payout request with re-auth'),
  ('publish', 'content', 'content', 'publish', false, 'capability', 'Deploy curriculum directly to live production roadmap'),
  ('approve', 'content', 'content', 'approve', false, 'capability', 'Approve lesson content draft'),
  ('reorder_roadmap', 'content', 'roadmap', 'reorder_roadmap', false, 'capability', 'Change sequence of roadmap nodes'),
  ('request_progress_reset', 'learners', 'learners', 'request_progress_reset', false, 'capability', 'Request reset of learner chapter progress'),

  -- DANGER LIST (super_admin ONLY)
  ('manage_roles', 'security', 'system', 'manage_roles', true, 'danger', 'Modify role definitions, permissions, and staff assignments'),
  ('manage_integrations', 'security', 'system', 'manage_integrations', true, 'danger', 'Configure PayOS, SePay, Supabase, OAuth keys'),
  ('manage_payment_keys', 'security', 'system', 'manage_payment_keys', true, 'danger', 'View or update payment gateway secrets and webhook tokens'),
  ('manage_feature_flags', 'security', 'system', 'manage_feature_flags', true, 'danger', 'Toggle system-wide feature flags'),
  ('maintenance_mode', 'security', 'system', 'maintenance_mode', true, 'danger', 'Put platform into maintenance lock mode'),
  ('backups', 'security', 'system', 'backups', true, 'danger', 'Trigger database backups and restore procedures'),
  ('impersonate', 'security', 'system', 'impersonate', true, 'danger', 'Impersonate another user account for troubleshooting'),
  ('view_security_audit', 'security', 'system', 'view_security_audit', true, 'danger', 'Inspect immutable audit logs and security access events'),
  ('delete_permanent', 'security', 'system', 'delete_permanent', true, 'danger', 'Permanently hard-delete database records'),
  ('bulk_export_pii', 'security', 'system', 'bulk_export_pii', true, 'danger', 'Bulk CSV export with unmasked learner PII')
ON CONFLICT (id) DO UPDATE SET
  resource = EXCLUDED.resource,
  action = EXCLUDED.action,
  is_danger = EXCLUDED.is_danger,
  category = EXCLUDED.category,
  description = EXCLUDED.description;

-- 3. RESET AND SEED THE EXACT CANONICAL MATRIX FOR ALL 9 ROLES
DELETE FROM public.role_permissions WHERE role_id IN (
  'super_admin', 'admin', 'content_editor', 'publisher', 'teacher',
  'sales_crm', 'support_agent', 'marketing', 'read_only'
);

-- ==============================================================================
-- (1) super_admin: Unrestricted full permissions
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'super_admin', id FROM public.admin_permissions;

-- ==============================================================================
-- (2) admin: Daily Operations (NO Danger List items)
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('admin', 'content.view'), ('admin', 'content.create'), ('admin', 'content.update'), ('admin', 'content.approve'), ('admin', 'content.publish'), ('admin', 'content.export'),
  ('admin', 'teaching.view'), ('admin', 'teaching.create'), ('admin', 'teaching.update'), ('admin', 'teaching.approve'), ('admin', 'teaching.publish'),
  ('admin', 'learners.view'), ('admin', 'learners.create'), ('admin', 'learners.update'), ('admin', 'learners.export'),
  ('admin', 'orders.view'), ('admin', 'orders.update'), ('admin', 'orders.approve'), ('admin', 'orders.export'),
  ('admin', 'leads.view'), ('admin', 'leads.create'), ('admin', 'leads.update'), ('admin', 'leads.export'),
  ('admin', 'marketing.view'), ('admin', 'marketing.create'), ('admin', 'marketing.update'), ('admin', 'marketing.export'),
  ('admin', 'analytics.view'), ('admin', 'analytics.export'),
  ('admin', 'system.view'),
  ('admin', 'view_pii'), ('admin', 'reveal_pii'), ('admin', 'view_revenue'), ('admin', 'view_order_counts'), ('admin', 'view_segment_counts'),
  ('admin', 'approve_refund'), ('admin', 'propose_refund'), ('admin', 'flag_refund'),
  ('admin', 'publish'), ('admin', 'approve'), ('admin', 'reorder_roadmap');

-- ==============================================================================
-- (3) content_editor: Drafts only, no publishing, no PII, no finance
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('content_editor', 'content.view'), ('content_editor', 'content.create'), ('content_editor', 'content.update'),
  ('content_editor', 'teaching.view'), ('content_editor', 'teaching.create'), ('content_editor', 'teaching.update'), ('content_editor', 'teaching.delete'),
  ('content_editor', 'analytics.view');

-- ==============================================================================
-- (4) publisher: Review, feedback, approve and publish curriculum
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('publisher', 'content.view'), ('publisher', 'content.create'), ('publisher', 'content.update'), ('publisher', 'content.approve'), ('publisher', 'content.publish'),
  ('publisher', 'teaching.view'), ('publisher', 'teaching.approve'), ('publisher', 'teaching.publish'),
  ('publisher', 'analytics.view'),
  ('publisher', 'publish'), ('publisher', 'approve'), ('publisher', 'reorder_roadmap');

-- ==============================================================================
-- (5) teacher: Curriculum in scope + assigned classes only
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('teacher', 'content.view'),
  ('teacher', 'teaching.view'), ('teacher', 'teaching.create'), ('teacher', 'teaching.update'), ('teacher', 'teaching.delete'),
  ('teacher', 'learners.view'),
  ('teacher', 'analytics.view');

-- ==============================================================================
-- (6) sales_crm: Leads, Orders, Propose Refund, Pipeline Revenue
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('sales_crm', 'leads.view'), ('sales_crm', 'leads.create'), ('sales_crm', 'leads.update'), ('sales_crm', 'leads.export'),
  ('sales_crm', 'orders.view'),
  ('sales_crm', 'learners.view'),
  ('sales_crm', 'marketing.view'),
  ('sales_crm', 'analytics.view'),
  ('sales_crm', 'view_revenue'),
  ('sales_crm', 'view_order_counts'),
  ('sales_crm', 'view_segment_counts'),
  ('sales_crm', 'propose_refund');

-- ==============================================================================
-- (7) support_agent: ZERO ORDERS, ZERO REVENUE, EXACT LOOKUP ONLY
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('support_agent', 'learners.view'),
  ('support_agent', 'leads.view'),
  ('support_agent', 'leads.update'),
  ('support_agent', 'view_pii'),
  ('support_agent', 'reveal_pii'),
  ('support_agent', 'flag_refund');

-- ==============================================================================
-- (8) marketing: Coupons, Banners, Aggregate Funnels
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('marketing', 'marketing.view'), ('marketing', 'marketing.create'), ('marketing', 'marketing.update'), ('marketing', 'marketing.delete'), ('marketing', 'marketing.export'),
  ('marketing', 'analytics.view'),
  ('marketing', 'view_segment_counts');

-- ==============================================================================
-- (9) read_only: Aggregate reports only, no PII, no finance
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('read_only', 'content.view'),
  ('read_only', 'analytics.view');

-- 4. PRIVILEGE-ESCALATION DATABASE TRIGGER
-- Blocks anyone except super_admin from granting DANGER capabilities
CREATE OR REPLACE FUNCTION public.check_privilege_escalation()
RETURNS TRIGGER AS $$
DECLARE
  v_is_danger BOOLEAN;
BEGIN
  SELECT is_danger INTO v_is_danger FROM public.admin_permissions WHERE id = NEW.permission_id;
  IF v_is_danger = true THEN
    -- In Supabase auth, check if executing user is super_admin
    IF current_setting('request.jwt.claims', true)::jsonb->>'role' != 'super_admin' AND
       current_setting('app.current_user_role', true) != 'super_admin' THEN
      RAISE EXCEPTION 'Privilege Escalation Detected: Only super_admin may grant or modify danger permissions.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_privilege_escalation ON public.role_permissions;
CREATE TRIGGER trg_prevent_privilege_escalation
  BEFORE INSERT OR UPDATE ON public.role_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_privilege_escalation();

-- 5. FUNCTION has_permission(role, permission) WITH DEFAULT-DENY
CREATE OR REPLACE FUNCTION public.has_permission(p_role TEXT, p_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF p_role = 'super_admin' THEN
    RETURN true;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.role_permissions
    WHERE role_id = p_role AND permission_id = p_permission
  );
END;
$$ LANGUAGE plpgsql STABLE;
