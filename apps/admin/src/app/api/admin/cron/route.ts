import { NextRequest, NextResponse } from "next/server";
import { evaluateScheduledJobs } from "@/features/content-publishing/content-service";

export async function POST(req: NextRequest) {
  try {
    const results = await evaluateScheduledJobs();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to evaluate cron jobs" }, { status: 500 });
  }
}
