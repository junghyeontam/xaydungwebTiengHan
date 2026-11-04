import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Checks whether Supabase is configured with a real, reachable project.
 * Returns false for mock, dummy, or placeholder domains to safely enable Demo Auth mode.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseUrl.includes("mock-supabase") &&
    !supabaseUrl.includes("example.supabase.co") &&
    !supabaseAnonKey.includes("mock-anon-key") &&
    !supabaseAnonKey.includes("your-anon-key") &&
    !supabaseAnonKey.includes("dummy-anon-key") &&
    (supabaseUrl.includes(".supabase.co") ||
      supabaseUrl.startsWith("http://127.0.0.1:54321") ||
      supabaseUrl.startsWith("http://localhost:54321"))
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
