import type { SurfaceId } from "./urls";

const FORBIDDEN_ENV_BY_SURFACE: Record<"web" | "teach", string[]> = {
  web: [
    "SUPABASE_SERVICE_ROLE_KEY",
    "SEPAY_API_KEY",
    "PAYOS_API_KEY",
    "PAYOS_CHECKSUM_KEY",
    "STRIPE_SECRET_KEY",
    "ADMIN_BOOTSTRAP_EMAIL",
    "ADMIN_DEV_PERSONA",
  ],
  teach: [
    "SUPABASE_SERVICE_ROLE_KEY",
    "SEPAY_API_KEY",
    "PAYOS_API_KEY",
    "PAYOS_CHECKSUM_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "ADMIN_BOOTSTRAP_EMAIL",
    "ADMIN_DEV_PERSONA",
  ],
};

export function validateSurfaceEnv(
  surface: SurfaceId,
  envRecord: Record<string, string | undefined>
): { valid: boolean; violations: string[] } {
  if (surface === "admin" || surface === "system") {
    return { valid: true, violations: [] };
  }
  const forbidden = FORBIDDEN_ENV_BY_SURFACE[surface] || [];
  const violations = forbidden.filter((key) => {
    const val = envRecord[key];
    return Boolean(val && val.trim().length > 0 && !val.startsWith("your-"));
  });
  return {
    valid: violations.length === 0,
    violations,
  };
}
