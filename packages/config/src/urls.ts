export type SurfaceId = "web" | "teach" | "admin" | "system";

export const SURFACE_ORIGINS: Record<SurfaceId, string> = {
  web: process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
  teach: process.env.NEXT_PUBLIC_TEACH_URL || "http://localhost:3001",
  admin: process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002",
  system: (process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002") + "/system",
};

export function getSurfaceUrl(surface: SurfaceId, path: string = "/"): string {
  const base = SURFACE_ORIGINS[surface].replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function getCookieDomain(): string | undefined {
  return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
