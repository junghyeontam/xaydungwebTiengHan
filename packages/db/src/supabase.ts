import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client for client-side or anon queries (reads only published rows via RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Privileged client for server-side admin actions & revalidation hooks
export function getServiceSupabase() {
  if (!supabaseServiceRoleKey) {
    return supabase;
  }
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
