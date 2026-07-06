"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ExerciseList } from "@/components/practice/exercise-list";
import { PlanFailed } from "@/components/practice/plan-failed";
import { PlanGenerating } from "@/components/practice/plan-generating";
import { PlanStatusBadge } from "@/components/practice/plan-status-badge";
import { practiceApi } from "@/lib/api/practice";
import { queryKeys } from "@/lib/query-keys";
import { isPendingPlanResponse, isPracticePlan } from "@/lib/utils/practice";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { cn } from "@/lib/utils";

interface PlanDetailPageProps {
  params: Promise<{ planId: string }>;
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { planId } = use(params);

  const { data: plan, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.practice.plan(planId),
    queryFn: () => practiceApi.getPlan(planId),
    enabled: !!planId,
    refetchInterval: (query) => {
      const d = query.state.data;
      if (!d || isPendingPlanResponse(d)) return 3000;
      return false;
    },
  });

  const { data: progress } = useQuery({
    queryKey: queryKeys.practice.progress(planId),
    queryFn: () => practiceApi.getProgress(planId),
    enabled: !!plan && isPracticePlan(plan) && plan.status === "ready",
  });

  useEffect(() => {
    if (isError) {
      handleApiError(error);
    }
  }, [isError, error]);

  return (
    <div className="space-y-6">
      <Link
        href="/practice"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
      >
        <ArrowLeft className="size-4" />
        All plans
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !plan ? (
        <p className="text-sm text-muted-foreground">Plan not found.</p>
      ) : isPendingPlanResponse(plan) ? (
        <PlanGenerating message={plan.message} />
      ) : plan.status === "failed" ? (
        <PlanFailed errorMessage={plan.error_message} errorCode={plan.error_code} />
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
                <PlanStatusBadge status={plan.status} />
              </div>
              <p className="mt-1 text-muted-foreground">
                {plan.exercise_count} exercises · {plan.difficulty} level
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {plan.focus_skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {progress && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Progress</CardTitle>
                <CardDescription>
                  {progress.completed} of {progress.total_exercises} exercises completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress.completion_percent}>
                  <ProgressLabel>Completion</ProgressLabel>
                  <ProgressValue />
                </Progress>
                <p className="mt-2 text-sm text-muted-foreground">
                  {Math.round(progress.completion_percent)}% complete
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Exercises</CardTitle>
              <CardDescription>Work through each exercise at your own pace.</CardDescription>
            </CardHeader>
            <CardContent>
              <ExerciseList planId={planId} exercises={plan.exercises} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
