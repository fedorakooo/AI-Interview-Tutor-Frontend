"use client";

import Link from "next/link";
import { MessageSquare, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCvReady } from "@/lib/hooks/use-cv-status";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isCvReady, isLoading: isCvLoading } = useCvReady();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to AI Interview Tutor</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hello, {user?.first_name ?? "there"}!</CardTitle>
          <CardDescription>
            {isCvReady
              ? "Your resume is ready. Start an AI interview when you are prepared."
              : "Complete onboarding by uploading your CV to unlock interview practice."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">@{user?.username}</span>
          </p>

          {isCvLoading ? (
            <Skeleton className="h-9 w-40" />
          ) : isCvReady ? (
            <Link
              href="/interview"
              className={cn(buttonVariants({ variant: "default" }), "inline-flex gap-1.5")}
            >
              <MessageSquare className="size-4" />
              Start interview
            </Link>
          ) : (
            <Link
              href="/onboarding"
              className={cn(buttonVariants({ variant: "default" }), "inline-flex gap-1.5")}
            >
              <Upload className="size-4" />
              Complete onboarding
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
