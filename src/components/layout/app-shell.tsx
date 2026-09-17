"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sidebar } from "@/components/layout/sidebar";
import { NotificationsBell } from "@/components/notifications/notifications-bell";
import { LocaleToggle } from "@/lib/i18n/locale-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur md:hidden">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <span className="flex-1 text-sm font-semibold tracking-tight">AI Interview Tutor</span>
          <LocaleToggle />
          <NotificationsBell />
        </header>

        <header className="sticky top-0 z-20 hidden items-center justify-end gap-2 border-b bg-background/95 px-6 py-2 backdrop-blur md:flex">
          <LocaleToggle />
          <NotificationsBell />
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          showCloseButton
          className="fixed inset-y-0 left-0 top-0 h-dvh w-[min(20rem,85vw)] max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0 sm:max-w-none data-open:zoom-in-100 data-closed:zoom-out-100"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Navigation</DialogTitle>
            <DialogDescription>Primary application navigation</DialogDescription>
          </DialogHeader>
          <Sidebar className="h-full w-full border-r-0" onNavigate={() => setMobileOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
