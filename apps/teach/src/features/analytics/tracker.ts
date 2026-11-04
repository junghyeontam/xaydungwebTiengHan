import type { AnalyticsEventType } from "@/types/analytics.types";

export interface AnalyticsEventPayload {
  userId?: string | null;
  sessionId?: string;
  metadata?: Record<string, any>;
  path?: string;
}

/**
 * Emits an analytics event from the learner or admin site.
 * In the browser, it sends a beacon or POST to /api/analytics without blocking UI.
 */
export async function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload = {}
): Promise<void> {
  const body = {
    event_type: eventType,
    user_id: payload.userId || null,
    session_id: payload.sessionId || getOrCreateSessionId(),
    metadata: {
      ...payload.metadata,
      path: payload.path || (typeof window !== "undefined" ? window.location.pathname : "/"),
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
    },
  };

  if (typeof window === "undefined") {
    // Server-side: direct log or handled by server route
    return;
  }

  try {
    const serialized = JSON.stringify(body);
    if (navigator.sendBeacon) {
      const blob = new Blob([serialized], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: serialized,
        keepalive: true,
      });
    }
  } catch (error) {
    // Analytics failure should never break user flow
    console.debug("[Analytics] Failed to emit event:", eventType, error);
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  try {
    let sid = sessionStorage.getItem("jh_session_id");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
      sessionStorage.setItem("jh_session_id", sid);
    }
    return sid;
  } catch {
    return "ephemeral-session";
  }
}
