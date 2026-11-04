export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRoleType =
  | "super_admin"
  | "content_editor"
  | "publisher"
  | "teacher"
  | "sales_lead"
  | "counselor"
  | "marketer"
  | "support"
  | "readonly";

export type AdminPermissionKey = string;

export interface Database {
  public: {
    Tables: {
      admin_roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      admin_permissions: {
        Row: {
          id: string;
          module: string;
          description: string;
        };
        Insert: {
          id: string;
          module: string;
          description: string;
        };
        Update: {
          id?: string;
          module?: string;
          description?: string;
        };
      };
      role_permissions: {
        Row: {
          role_id: string;
          permission_id: string;
        };
        Insert: {
          role_id: string;
          permission_id: string;
        };
        Update: {
          role_id?: string;
          permission_id?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role_id: AdminRoleType;
          is_active: boolean;
          last_sign_in_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role_id?: AdminRoleType;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role_id?: AdminRoleType;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string;
          actor_role: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email: string;
          actor_role: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string;
          actor_role?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      content_versions: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          version_number: number;
          status: "draft" | "pending_approval" | "in_review" | "approved" | "published" | "archived";
          title: string;
          data: Json;
          changelog: string | null;
          author_id: string | null;
          published_by: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          version_number?: number;
          status?: "draft" | "pending_approval" | "in_review" | "approved" | "published" | "archived";
          title: string;
          data: Json;
          changelog?: string | null;
          author_id?: string | null;
          published_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: string;
          entity_id?: string;
          version_number?: number;
          status?: "draft" | "pending_approval" | "in_review" | "approved" | "published" | "archived";
          title?: string;
          data?: Json;
          changelog?: string | null;
          author_id?: string | null;
          published_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_reports: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          lesson_id: string | null;
          context_text: string | null;
          issue_category: "audio_error" | "typo" | "grammar_mistake" | "bug" | "other";
          description: string;
          status: "open" | "investigating" | "resolved" | "dismissed";
          staff_notes: string | null;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_email?: string | null;
          lesson_id?: string | null;
          context_text?: string | null;
          issue_category?: "audio_error" | "typo" | "grammar_mistake" | "bug" | "other";
          description: string;
          status?: "open" | "investigating" | "resolved" | "dismissed";
          staff_notes?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          user_email?: string | null;
          lesson_id?: string | null;
          context_text?: string | null;
          issue_category?: "audio_error" | "typo" | "grammar_mistake" | "bug" | "other";
          description?: string;
          status?: "open" | "investigating" | "resolved" | "dismissed";
          staff_notes?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          event_name?: string;
          user_id: string | null;
          session_id: string | null;
          metadata: Json;
          properties?: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          event_name?: string;
          user_id?: string | null;
          session_id?: string | null;
          metadata?: Json;
          properties?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          event_name?: string;
          user_id?: string | null;
          session_id?: string | null;
          metadata?: Json;
          properties?: Json;
          created_at?: string;
        };
      };
      system_settings: {
        Row: {
          key: string;
          value: Json;
          category: string;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          category?: string;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          category?: string;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
