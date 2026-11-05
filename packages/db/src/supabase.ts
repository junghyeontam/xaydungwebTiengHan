import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";

// Public client for client-side or anon queries (reads only published rows via RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
