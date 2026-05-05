"use client";

import { useState } from "react";
import { Bell, BellOff, Check, CheckCheck, Clock, Package } from "lucide-react";
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/hooks/useNotfications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  order: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: <Package size={14} />,
  },
  default: {
    color: "text-gray-500",
    bg: "bg-gray-100",
    icon: <Bell size={14} />,
  },
};

function useTimeAgo() {
  const t = useTranslations("translation");

  return (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("justNow");
    if (mins < 60) return t("minutesAgo", { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("hoursAgo", { count: hrs });
    return t("daysAgo", { count: Math.floor(hrs / 24) });
  };
}

export default function NotificationsPage() {
  const t = useTranslations("translation");
  const timeAgo = useTimeAgo();

  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading, isFetching } = useNotifications({ page, limit });

  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsAsRead();
  const { mutate: markOne } = useMarkNotificationAsRead();

  const notifications = data?.notifications ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
            <Bell size={18} className="text-gray-700" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{t("notifications")}</h1>
            <p className="text-sm text-gray-400">
              {t("totalCount", { count: total })}
              {unreadCount > 0 && `, ${t("unreadCount", { count: unreadCount })}`}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-sm"
          disabled={markingAll || unreadCount === 0}
          onClick={() => markAll()}
        >
          <CheckCheck size={15} />
          {t("markAllAsRead")}
        </Button>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4">
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <BellOff size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">{t("noNotificationsYet")}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification: any) => {
              const typeConfig = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.default;
              return (
                <div
                  key={notification._id}
                  className={cn(
                    "group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50/70",
                    !notification.isRead && "bg-blue-50/30"
                  )}
                >
                  {/* Type icon */}
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      typeConfig.bg,
                      typeConfig.color
                    )}
                  >
                    {typeConfig.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={cn("text-sm font-medium text-gray-900 truncate", !notification.isRead && "font-semibold")}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                      )}
                      <Badge
                        variant="secondary"
                        className="ml-auto shrink-0 text-[10px] capitalize px-1.5 py-0"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{notification.message}</p>
                  </div>

                  {/* Right side */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap">
                      <Clock size={10} />
                      {timeAgo(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <button
                        onClick={() => markOne(notification._id)}
                        className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-blue-500 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Check size={10} /> {t("read")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-400">
              {t("pageOf", { page, totalPages })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
              >
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                {t("next")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}