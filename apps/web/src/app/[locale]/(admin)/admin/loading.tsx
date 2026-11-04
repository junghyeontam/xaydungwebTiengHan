import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-2 border-b border-admin-border/60">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-admin-subtle rounded-md" />
          <div className="h-8 w-64 bg-admin-subtle rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-admin-subtle rounded-admin-control" />
          <div className="h-9 w-32 bg-admin-subtle rounded-admin-control" />
        </div>
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card space-y-3"
          >
            <div className="h-3 w-24 bg-admin-subtle rounded-md" />
            <div className="h-7 w-32 bg-admin-subtle rounded-md" />
            <div className="h-3 w-40 bg-admin-subtle rounded-md" />
          </div>
        ))}
      </div>

      {/* Main table/chart area skeleton */}
      <div className="p-6 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card space-y-4">
        <div className="h-5 w-48 bg-admin-subtle rounded-md" />
        <div className="h-64 bg-admin-subtle/60 rounded-admin-control" />
      </div>
    </div>
  );
}
