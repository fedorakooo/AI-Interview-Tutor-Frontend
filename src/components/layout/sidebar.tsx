"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  Code2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PenTool,
  Settings,
  Shield,
  Upload,
  User,
  Wrench,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCvReady } from "@/lib/hooks/use-cv-status";
import { useI18n } from "@/lib/i18n/provider";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresCv?: boolean;
  disabled?: boolean;
};

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const { isCvReady } = useCvReady();
  const { t } = useI18n();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/onboarding", label: t("nav.onboarding"), icon: Upload },
    { href: "/interview", label: t("nav.interview"), icon: MessageSquare, requiresCv: true },
    { href: "/interview/coding", label: t("nav.coding"), icon: Code2, requiresCv: true },
    { href: "/interview/system-design", label: t("nav.systemDesign"), icon: PenTool, requiresCv: true },
    { href: "/sessions", label: t("nav.sessions"), icon: ClipboardList },
    { href: "/practice", label: t("nav.practice"), icon: BookOpen },
    { href: "/curriculum", label: t("nav.curriculum"), icon: GraduationCap },
    { href: "/tools/jd-match", label: t("nav.jdMatch"), icon: Briefcase, requiresCv: true },
    { href: "/profile", label: t("nav.profile"), icon: User },
    { href: "/settings/team", label: t("nav.team"), icon: Settings },
  ];

  const allNavItems: NavItem[] = [
    ...navItems,
    ...(isAdmin
      ? [
          { href: "/admin/users", label: t("nav.adminUsers"), icon: Shield },
          { href: "/admin/ops", label: t("nav.adminOps"), icon: Wrench },
        ]
      : []),
  ];

  return (
    <aside className={cn("flex w-64 flex-col border-r bg-card", className)}>
      <div className="p-6">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="text-lg font-semibold tracking-tight"
        >
          AI Interview Tutor
        </Link>
        {user && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user.first_name} {user.second_name}
          </p>
        )}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {allNavItems.map((item) => {
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
              onClick={onNavigate}
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
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => {
            onNavigate?.();
            logout();
          }}
        >
          <LogOut className="mr-2 size-4" />
          {t("nav.logout")}
        </Button>
      </div>
    </aside>
  );
}
