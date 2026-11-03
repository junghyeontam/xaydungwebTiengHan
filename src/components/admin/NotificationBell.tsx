"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, AlertCircle, UserPlus, FileCheck, Check, ExternalLink } from "lucide-react";
import type { AdminNotification } from "@/types/admin.types";
import { formatTime } from "@/lib/format";
import { Count } from "@/components/shared";

interface NotificationBellProps {
  notifications?: AdminNotification[];
}

export function NotificationBell({ notifications: initialNotifications }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<AdminNotification[]>(
    initialNotifications || [
      {
        id: "notif-1",
        type: "lead",
        title: "New Consultation Lead",
        message: "Phan Van Minh registered for TOPIK 4 Consultation.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        actionUrl: "/admin/sales/leads",
      },
      {
        id: "notif-2",
        type: "report",
        title: "Content Problem Report",
        message: "Student reported audio mismatch on Lesson 3 examples.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        actionUrl: "/admin/publishing",
      },
      {
        id: "notif-3",
        type: "publish",
        title: "Draft Approved for Publish",
        message: "Grammar unit approved by publisher.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        actionUrl: "/admin/publishing",
      },
    ]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/admin/leads?type=notifications");
        const json = await res.json();
        if (json.success && json.notifications) {
          setNotifications(
            json.notifications.map((n: any) => ({
              id: n.id,
              type: n.type,
              title: n.title,
              message: n.description || n.message,
              read: n.isRead ?? n.read ?? false,
              createdAt: n.createdAt,
              actionUrl: n.link || "/admin",
            }))
          );
        }
      } catch {}
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 4000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "lead":
        return <UserPlus className="w-4 h-4 text-admin-brand-coral" />;
      case "report":
        return <AlertCircle className="w-4 h-4 text-admin-warning" />;
      case "publish":
        return <FileCheck className="w-4 h-4 text-admin-brand-teal" />;
      default:
        return <Bell className="w-4 h-4 text-admin-info" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-admin-text-secondary hover:text-admin-text-primary transition-colors"
        aria-label="Notifications"
        title="Admin Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-admin-brand-coral animate-pulse ring-2 ring-admin-surface" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-admin-border flex items-center justify-between bg-admin-subtle/40">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-admin-text-primary">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Count count={unreadCount} variant="alert" />
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-admin-brand-teal hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-admin-border/50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-admin-text-muted">
                No new notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors flex gap-3 text-xs ${
                    notif.read
                      ? "bg-admin-surface opacity-80"
                      : "bg-admin-brand-teal/5 font-medium"
                  }`}
                >
                  <div className="w-8 h-8 rounded-admin-control bg-admin-subtle border border-admin-border flex items-center justify-center shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-admin-text-primary text-xs truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-admin-text-muted shrink-0 num-tabular">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-admin-text-secondary text-[11px] leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      {notif.actionUrl && (
                        <Link
                          href={notif.actionUrl}
                          onClick={() => {
                            markOneAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="text-admin-brand-teal font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}

                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => markOneAsRead(notif.id)}
                          className="text-admin-text-muted hover:text-admin-text-primary text-[10px]"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
