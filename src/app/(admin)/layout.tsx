"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardSkeleton } from "@/components/layout/dashboard-skeleton";
import { BlockedUserModal } from "@/components/auth/blocked-user-modal";
import { useAuth } from "@/lib/hooks/use-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading, isBlocked, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <AppShell>{children}</AppShell>
      <BlockedUserModal open={isBlocked} onLogout={logout} />
    </>
  );
}
