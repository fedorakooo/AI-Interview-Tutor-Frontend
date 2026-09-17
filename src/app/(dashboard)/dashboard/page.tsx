"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  FileSearch,
  Flame,
  MessageSquare,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { billingApi } from "@/lib/api/billing";
import { interviewApi } from "@/lib/api/interview";
import { practiceApi } from "@/lib/api/practice";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCvReady } from "@/lib/hooks/use-cv-status";
import { useI18n } from "@/lib/i18n/provider";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function usagePercent(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { isCvReady, cvStatus, isLoading: isCvLoading } = useCvReady();

  const sessionsQuery = useQuery({
    queryKey: queryKeys.interview.sessions(0, 5),
    queryFn: () => interviewApi.listSessions(0, 5),
  });

  const plansQuery = useQuery({
    queryKey: queryKeys.practice.plans({ active: true }),
    queryFn: () => practiceApi.listPlans({ limit: 5 }),
  });

  const profileQuery = useQuery({
    queryKey: queryKeys.practice.profile,
    queryFn: () => practiceApi.getProfile(),
  });

  const entitlementsQuery = useQuery({
    queryKey: queryKeys.billing.entitlements,
    queryFn: () => billingApi.getEntitlements(),
    retry: false,
  });

  const activePlans =
    plansQuery.data?.filter((plan) =>
      plan.status === "ready" || plan.status === "generating" || plan.status === "pending",
    ) ?? [];

  const entitlements = entitlementsQuery.data;
  const interviewLimit = entitlements?.limits.interviews_per_month ?? 0;
  const interviewUsed = entitlements?.usage.interviews_per_month ?? 0;
  const planQuotaRemaining = profileQuery.data
    ? profileQuery.data.daily_plan_quota - profileQuery.data.plans_generated_today
    : null;
  const showUpgradeCta =
    entitlements?.tier === "free" ||
    (interviewLimit > 0 && interviewUsed >= interviewLimit - 1) ||
    (planQuotaRemaining !== null && planQuotaRemaining <= 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">
            {t("dashboard.welcome")}
            {user?.first_name ? `, ${user.first_name}` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isCvReady ? (
            <>
              <Link href="/interview" className={cn(buttonVariants(), "gap-1.5")}>
                <MessageSquare className="size-4" />
                {t("dashboard.startInterview")}
              </Link>
              <Link href="/practice/new" className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}>
                <BookOpen className="size-4" />
                {t("dashboard.newPlan")}
              </Link>
            </>
          ) : (
            <Link href="/onboarding" className={cn(buttonVariants(), "gap-1.5")}>
              <Upload className="size-4" />
              {t("dashboard.completeOnboarding")}
            </Link>
          )}
          <Link href="/tools/jd-match" className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}>
            <FileSearch className="size-4" />
            {t("nav.jdMatch")}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("dashboard.cvStatus")}</CardTitle>
            <CardDescription>{t("dashboard.cvStatusHint")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isCvLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="space-y-2">
                <Badge variant={isCvReady ? "default" : "secondary"}>
                  {cvStatus?.status ?? "not uploaded"}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {cvStatus?.original_filename ?? t("dashboard.cvUploadHint")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="size-4 text-orange-500" />
              {t("dashboard.streak")}
            </CardTitle>
            <CardDescription>{t("dashboard.streakHint")}</CardDescription>
          </CardHeader>
          <CardContent>
            {profileQuery.isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-semibold">
                {profileQuery.data?.current_streak_days ?? 0}
                <span className="ml-2 text-sm font-normal text-muted-foreground">{t("dashboard.days")}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("dashboard.activePlans")}</CardTitle>
            <CardDescription>{t("dashboard.activePlansHint")}</CardDescription>
          </CardHeader>
          <CardContent>
            {plansQuery.isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-3xl font-semibold">{activePlans.length}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-teal-600" />
              {t("dashboard.entitlements")}
            </CardTitle>
            <CardDescription>{t("dashboard.entitlementsHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {entitlementsQuery.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : entitlements ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{entitlements.tier} plan</span>
                  {interviewLimit > 0 ? (
                    <span className="text-muted-foreground">
                      {interviewUsed}/{interviewLimit} interviews
                    </span>
                  ) : null}
                </div>
                {interviewLimit > 0 ? (
                  <Progress value={usagePercent(interviewUsed, interviewLimit)} />
                ) : null}
                {planQuotaRemaining !== null ? (
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.planQuota")}: {Math.max(0, planQuotaRemaining)} left today
                  </p>
                ) : null}
                {showUpgradeCta ? (
                  <Link href="/pricing" className={cn(buttonVariants({ size: "sm" }), "w-full")}>
                    {t("dashboard.upgradeCta")}
                  </Link>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t("dashboard.entitlementsUnavailable")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentSessions")}</CardTitle>
            <CardDescription>{t("dashboard.recentSessionsHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessionsQuery.isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : !sessionsQuery.data?.length ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.noSessions")}</p>
            ) : (
              sessionsQuery.data.map((session) => (
                <div
                  key={session.session_id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{formatDate(session.started_at)}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.status} · {session.overall_stage} · {session.message_count} messages
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {session.status === "suspended" ? (
                      <Link
                        href={`/interview?resume=${session.session_id}`}
                        className={cn(buttonVariants({ size: "sm" }))}
                      >
                        Resume
                      </Link>
                    ) : session.status === "completed" ? (
                      <Link
                        href={`/sessions/${session.session_id}/report`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Report
                      </Link>
                    ) : (
                      <Link
                        href={`/sessions/${session.session_id}/transcript`}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                      >
                        Transcript
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
            <Link href="/sessions" className={cn(buttonVariants({ variant: "link" }), "px-0")}>
              {t("dashboard.viewAllSessions")}
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.practicePlans")}</CardTitle>
            <CardDescription>{t("dashboard.practicePlansHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plansQuery.isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : !activePlans.length ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.noPlans")}</p>
            ) : (
              activePlans.map((plan) => (
                <div
                  key={plan.plan_id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{plan.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {plan.status} · {plan.exercise_count} exercises · {plan.difficulty}
                    </p>
                  </div>
                  <Link
                    href={`/practice/${plan.plan_id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Open
                  </Link>
                </div>
              ))
            )}
            <Link href="/practice" className={cn(buttonVariants({ variant: "link" }), "px-0")}>
              {t("dashboard.browsePractice")}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
