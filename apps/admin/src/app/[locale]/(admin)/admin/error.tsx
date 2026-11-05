"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Boundary Error]", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md p-6 rounded-admin-card bg-admin-surface border border-admin-danger/30 shadow-admin-card text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-admin-danger-tint text-admin-danger flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold text-admin-text-primary">
            Admin Module Exception
          </h2>
          <p className="text-xs text-admin-text-secondary leading-relaxed">
            {error?.message || "An unexpected error occurred while rendering this administrative section."}
          </p>
          {error?.digest && (
            <p className="text-[10px] font-mono text-admin-text-muted">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-admin-control bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Action</span>
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs font-medium text-admin-text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
