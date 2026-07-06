"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Upload,
  User,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCvReady } from "@/lib/hooks/use-cv-status";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresCv?: boolean;
  disabled?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "Onboarding", icon: Upload },
  { href: "/interview", label: "Interview", icon: MessageSquare, requiresCv: true },
  { href: "/sessions", label: "Sessions", icon: ClipboardList },
  { href: "/practice", label: "Practice", icon: BookOpen, disabled: true },
  { href: "/profile", label: "Profile", icon: User, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCvReady } = useCvReady();

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="p-6">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          AI Interview Tutor
        </Link>
        {user && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user.first_name} {user.second_name}
          </p>
        )}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isDisabled = item.disabled || (item.requiresCv && !isCvReady);

          if (isDisabled) {
            return (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                disabled
                title={
                  item.requiresCv && !isCvReady
                    ? "Upload and analyze your CV first"
                    : undefined
                }
              >
                <Icon className="mr-2 size-4" />
                {item.label}
              </Button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({
                  variant: isActive ? "secondary" : "ghost",
                }),
                "w-full justify-start",
                isActive && "font-medium",
              )}
            >
              <Icon className="mr-2 size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 size-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
