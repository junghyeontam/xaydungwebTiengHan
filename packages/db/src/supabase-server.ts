import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabase } from "./supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";

export function getServiceSupabase() {
  if (typeof window !== "undefined") {
    return supabase;
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return supabase;
  }
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
