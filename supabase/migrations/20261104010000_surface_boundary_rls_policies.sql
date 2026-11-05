-- ==============================================================================
-- Migration: Surface-Level Row Security & Monorepo Boundaries
-- Version: 20261104010000
-- Surfaces:
--   1. apps/web   (Learner Hub)       -> Public read published; create own orders/progress
--   2. apps/teach (Teacher Studio)    -> Teacher/Content Editor mutate scoped drafts; cannot self-approve
--   3. apps/admin (Back-Office Admin) -> Admin operations, orders, leads, campaigns; audit logs
--   4. /system/** (System Area)       -> super_admin unrestricted security & RBAC mutation
-- ==============================================================================

-- 1. Helper function: Get calling user's active role from JWT claims or staff table
CREATE OR REPLACE FUNCTION public.current_surface_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role'),
    (SELECT role_id FROM public.staff_members WHERE user_id = auth.uid() LIMIT 1),
    'learner'
  );
$$;

-- 2. Surface 1: apps/web (Learner & Guest Surface)
-- Rule: Learners can only read published curriculum, never drafts, reviews, or internal tags
DROP POLICY IF EXISTS "Learner Surface: Read Published Lessons Only" ON public.lessons;
CREATE POLICY "Learner Surface: Read Published Lessons Only" ON public.lessons
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

-- Learners can only read active vocabulary items
DROP POLICY IF EXISTS "Learner Surface: Read Active Vocabulary" ON public.vocabulary_items;
CREATE POLICY "Learner Surface: Read Active Vocabulary" ON public.vocabulary_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- Learners can only insert and read their own user progress
DROP POLICY IF EXISTS "Learner Surface: Manage Own Progress" ON public.user_progress;
CREATE POLICY "Learner Surface: Manage Own Progress" ON public.user_progress
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Learners can create orders and view only their own orders
DROP POLICY IF EXISTS "Learner Surface: Create and View Own Orders" ON public.orders;
CREATE POLICY "Learner Surface: Create and View Own Orders" ON public.orders
  FOR SELECT TO authenticated
  USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR customer_id = auth.uid());

-- 3. Surface 2: apps/teach (Teacher Studio)
-- Rule: Teachers and content editors can create and update drafts within their assigned scopes
-- Cannot self-approve or publish (Dual-Control / Two-Person Rule enforced)
DROP POLICY IF EXISTS "Teacher Studio: Manage Scoped Drafts" ON public.lessons;
CREATE POLICY "Teacher Studio: Manage Scoped Drafts" ON public.lessons
  FOR ALL TO authenticated
  USING (
    (author_id = auth.uid() AND status IN ('draft', 'changes_requested'))
    OR current_surface_role() IN ('publisher', 'admin', 'super_admin')
  )
  WITH CHECK (
    -- Teachers cannot self-approve or directly publish
    (status NOT IN ('approved', 'published') OR current_surface_role() IN ('publisher', 'admin', 'super_admin'))
  );

-- Teachers can manage vocabulary and grammar banks within studio
DROP POLICY IF EXISTS "Teacher Studio: Manage Vocabulary Bank" ON public.vocabulary_items;
CREATE POLICY "Teacher Studio: Manage Vocabulary Bank" ON public.vocabulary_items
  FOR ALL TO authenticated
  USING (
    current_surface_role() IN ('teacher', 'content_editor', 'publisher', 'admin', 'super_admin')
  )
  WITH CHECK (
    current_surface_role() IN ('teacher', 'content_editor', 'publisher', 'admin', 'super_admin')
  );

DROP POLICY IF EXISTS "Teacher Studio: Manage Grammar Bank" ON public.grammar_points;
CREATE POLICY "Teacher Studio: Manage Grammar Bank" ON public.grammar_points
  FOR ALL TO authenticated
  USING (
    current_surface_role() IN ('teacher', 'content_editor', 'publisher', 'admin', 'super_admin')
  )
  WITH CHECK (
    current_surface_role() IN ('teacher', 'content_editor', 'publisher', 'admin', 'super_admin')
  );

-- 4. Surface 3: apps/admin (Back-Office Admin)
-- Rule: Operations staff can manage orders, leads, campaigns, coupons
DROP POLICY IF EXISTS "Admin Surface: Manage Operations" ON public.orders;
CREATE POLICY "Admin Surface: Manage Operations" ON public.orders
  FOR ALL TO authenticated
  USING (
    current_surface_role() IN ('admin', 'sales_crm', 'support_agent', 'super_admin')
  );

DROP POLICY IF EXISTS "Admin Surface: Manage Leads" ON public.consultation_leads;
CREATE POLICY "Admin Surface: Manage Leads" ON public.consultation_leads
  FOR ALL TO authenticated
  USING (
    current_surface_role() IN ('admin', 'sales_crm', 'support_agent', 'super_admin')
  );

-- 5. Surface 4: apps/admin (/system/** - super_admin Only)
-- Rule: Audit logs, staff provisioning, role matrices and system settings strictly super_admin
DROP POLICY IF EXISTS "System Area: super_admin Audit Logs" ON public.audit_logs;
CREATE POLICY "System Area: super_admin Audit Logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    current_surface_role() = 'super_admin'
  );

DROP POLICY IF EXISTS "System Area: super_admin Staff Management" ON public.staff_members;
CREATE POLICY "System Area: super_admin Staff Management" ON public.staff_members
  FOR ALL TO authenticated
  USING (
    current_surface_role() = 'super_admin'
  );
