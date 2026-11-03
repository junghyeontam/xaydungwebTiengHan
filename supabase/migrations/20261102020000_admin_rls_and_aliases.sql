-- ==============================================================================
-- Migration: Admin RLS Policies, Compatibility Views & Role Resolution
-- Safe, additive migration: defines admin policies and table aliases
-- ==============================================================================

-- 1. COMPATIBILITY VIEWS (aliases for queries expecting staff_members or leads)
CREATE OR REPLACE VIEW public.staff_members AS
  SELECT * FROM public.admin_users;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'consultations') THEN
    EXECUTE 'CREATE OR REPLACE VIEW public.leads AS SELECT * FROM public.consultations;';
  END IF;
END $$;

-- 2. HELPER FUNCTIONS FOR RBAC PERMISSION CHECKS IN RLS
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_admin_permission(perm TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users u
    JOIN public.role_permissions rp ON u.role_id = rp.role_id
    WHERE u.id = auth.uid() 
      AND u.is_active = true
      AND (rp.permission_id = perm OR u.role_id = 'super_admin')
  );
$$;

-- 3. RLS POLICIES FOR ADMIN TABLES

-- admin_roles
DROP POLICY IF EXISTS "Admins can view roles" ON public.admin_roles;
CREATE POLICY "Admins can view roles" ON public.admin_roles
  FOR SELECT TO authenticated
  USING (public.is_admin_user() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Super admins can manage roles" ON public.admin_roles;
CREATE POLICY "Super admins can manage roles" ON public.admin_roles
  FOR ALL TO authenticated
  USING (public.has_admin_permission('settings:manage') OR auth.role() = 'service_role');

-- admin_permissions
DROP POLICY IF EXISTS "Admins can view permissions" ON public.admin_permissions;
CREATE POLICY "Admins can view permissions" ON public.admin_permissions
  FOR SELECT TO authenticated
  USING (public.is_admin_user() OR auth.role() = 'service_role');

-- role_permissions
DROP POLICY IF EXISTS "Admins can view role_permissions" ON public.role_permissions;
CREATE POLICY "Admins can view role_permissions" ON public.role_permissions
  FOR SELECT TO authenticated
  USING (public.is_admin_user() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Super admins can manage role_permissions" ON public.role_permissions;
CREATE POLICY "Super admins can manage role_permissions" ON public.role_permissions
  FOR ALL TO authenticated
  USING (public.has_admin_permission('settings:manage') OR auth.role() = 'service_role');

-- admin_users
DROP POLICY IF EXISTS "Admins can view staff directory" ON public.admin_users;
CREATE POLICY "Admins can view staff directory" ON public.admin_users
  FOR SELECT TO authenticated
  USING (public.is_admin_user() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Super admins can manage admin_users" ON public.admin_users
  FOR ALL TO authenticated
  USING (public.has_admin_permission('settings:manage') OR auth.role() = 'service_role');

-- audit_logs
DROP POLICY IF EXISTS "Authorized staff can read audit logs" ON public.audit_logs;
CREATE POLICY "Authorized staff can read audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.has_admin_permission('audit:read') OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Staff can insert audit entries" ON public.audit_logs;
CREATE POLICY "Staff can insert audit entries" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user() OR auth.role() = 'service_role');

-- content_versions
DROP POLICY IF EXISTS "Editors and Publishers can view content versions" ON public.content_versions;
CREATE POLICY "Editors and Publishers can view content versions" ON public.content_versions
  FOR SELECT TO authenticated
  USING (public.has_admin_permission('content:read') OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Editors can modify drafts" ON public.content_versions;
CREATE POLICY "Editors can modify drafts" ON public.content_versions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_permission('content:write') OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Editors and Publishers can update versions" ON public.content_versions;
CREATE POLICY "Editors and Publishers can update versions" ON public.content_versions
  FOR UPDATE TO authenticated
  USING (public.has_admin_permission('content:write') OR public.has_admin_permission('content:publish') OR auth.role() = 'service_role');

-- content_reports (Resolution by staff)
DROP POLICY IF EXISTS "Staff can view content reports" ON public.content_reports;
CREATE POLICY "Staff can view content reports" ON public.content_reports
  FOR SELECT TO authenticated
  USING (public.is_admin_user() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Staff can resolve reports" ON public.content_reports;
CREATE POLICY "Staff can resolve reports" ON public.content_reports
  FOR UPDATE TO authenticated
  USING (public.is_admin_user() OR auth.role() = 'service_role');

-- analytics_events
DROP POLICY IF EXISTS "Staff can view analytics events" ON public.analytics_events;
CREATE POLICY "Staff can view analytics events" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (public.has_admin_permission('analytics:read') OR auth.role() = 'service_role');

-- system_settings
DROP POLICY IF EXISTS "Super admins can update system settings" ON public.system_settings;
CREATE POLICY "Super admins can update system settings" ON public.system_settings
  FOR UPDATE TO authenticated
  USING (public.has_admin_permission('settings:manage') OR auth.role() = 'service_role');
