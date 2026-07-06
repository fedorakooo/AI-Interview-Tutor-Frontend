"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlanStatusBadge } from "@/components/practice/plan-status-badge";
import { practiceApi } from "@/lib/api/practice";
import { queryKeys } from "@/lib/query-keys";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { cn } from "@/lib/utils";

function formatPlanDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
}

export default function PracticePage() {
  const { data: plans, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.practice.plans(),
    queryFn: () => practiceApi.listPlans({ limit: 50 }),
  });

  useEffect(() => {
    if (isError) {
      handleApiError(error);
    }
  }, [isError, error]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice plans</h1>
          <p className="text-muted-foreground">
            Personalized exercises to improve your interview skills.
          </p>
        </div>
        <Link href="/practice/new" className={cn(buttonVariants(), "gap-1.5")}>
          <Plus className="size-4" />
          New plan
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your plans</CardTitle>
          <CardDescription>Manual and auto-generated practice plans.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !plans?.length ? (
            <div className="py-8 text-center">
              <p className="mb-4 text-sm text-muted-foreground">No practice plans yet.</p>
              <Link href="/practice/new" className={cn(buttonVariants())}>
                Create your first plan
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.plan_id}>
                    <TableCell className="font-medium">{plan.title}</TableCell>
                    <TableCell>
                      <PlanStatusBadge status={plan.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{plan.source}</Badge>
                    </TableCell>
                    <TableCell>{plan.exercise_count}</TableCell>
                    <TableCell>{formatPlanDate(plan.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/practice/${plan.plan_id}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Open
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
