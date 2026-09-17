"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationsApi } from "@/lib/api/notifications";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function NotificationsBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: () => notificationsApi.list(),
    staleTime: 60_000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list });
    },
  });

  const unreadCount =
    notificationsQuery.data?.filter((item) => !item.read).length ?? 0;

  return (
    <>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Notifications"
        className={cn("relative", className)}
        onClick={() => setOpen(true)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(32rem,85vh)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Updates about practice plans and account activity.</DialogDescription>
          </DialogHeader>

          {notificationsQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : !notificationsQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="space-y-2">
              {notificationsQuery.data.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "rounded-lg border p-3 text-sm",
                    !item.read && "border-teal-500/30 bg-teal-500/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground">{item.body}</p>
                      <p className="text-xs text-muted-foreground">{formatWhen(item.created_at)}</p>
                    </div>
                    {!item.read ? (
                      <Badge variant="secondary">{item.kind}</Badge>
                    ) : null}
                  </div>
                  {!item.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 px-2"
                      onClick={() => markReadMutation.mutate(item.id)}
                    >
                      Mark read
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
