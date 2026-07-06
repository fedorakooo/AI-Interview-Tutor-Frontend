"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportDetail } from "@/components/report/report-detail";
import { interviewApi } from "@/lib/api/interview";
import { queryKeys } from "@/lib/query-keys";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { cn } from "@/lib/utils";

interface ReportPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default function ReportPage({ params, searchParams }: ReportPageProps) {
  const { sessionId } = use(params);
  const { from } = use(searchParams);

  const { data: report, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.interview.report(sessionId),
    queryFn: () => interviewApi.getReport(sessionId),
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (isError) {
      handleApiError(error);
    }
  }, [isError, error]);

  const pollAutoPlan = from === "interview";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/sessions"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
        >
          <ArrowLeft className="size-4" />
          Sessions
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview report</h1>
        <p className="text-muted-foreground">Detailed feedback from your interview session.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : report ? (
        <ReportDetail report={report} sessionId={sessionId} pollAutoPlan={pollAutoPlan} />
      ) : (
        <p className="text-sm text-muted-foreground">Report not found.</p>
      )}
    </div>
  );
}
