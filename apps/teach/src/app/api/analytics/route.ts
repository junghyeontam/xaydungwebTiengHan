import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_type, user_id, session_id, metadata } = body;

    if (!event_type) {
      return NextResponse.json({ error: "Missing event_type" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Insert into analytics_events table
    const { error } = await (supabase.from("analytics_events") as any).insert({
      event_type,
      user_id: user_id || null,
      session_id: session_id || null,
      metadata: metadata || {},
    });

    if (error) {
      // In dev or offline environments without active Supabase connection, log and return 200
      console.warn("[Analytics API] Supabase write skipped/error:", error.message);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Analytics API Error]", err);
    return NextResponse.json({ success: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
