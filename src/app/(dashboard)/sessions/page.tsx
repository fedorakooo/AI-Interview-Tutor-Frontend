"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
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
import { interviewApi } from "@/lib/api/interview";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { queryKeys } from "@/lib/query-keys";
import type { InterviewSessionStatus } from "@/lib/types/interview";
import { cn } from "@/lib/utils";

function formatSessionDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const STATUS_VARIANT: Record<
  InterviewSessionStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "secondary",
  completed: "default",
  suspended: "outline",
  failed: "destructive",
};

export default function SessionsPage() {
  const { data: sessions, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.interview.sessions(0, 20),
    queryFn: () => interviewApi.listSessions(0, 20),
  });

  useEffect(() => {
    if (isError) {
      handleApiError(error);
    }
  }, [isError, error]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview sessions</h1>
        <p className="text-muted-foreground">Review your past interviews and reports.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session history</CardTitle>
          <CardDescription>All interview sessions for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !sessions?.length ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <FileText className="size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No interview sessions yet.</p>
              <Link href="/interview" className={cn(buttonVariants())}>
                Start your first interview
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const canViewReport =
                    session.status === "completed" && session.report !== null;

                  return (
                    <TableRow key={session.session_id}>
                      <TableCell>{formatSessionDate(session.started_at)}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[session.status]}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{session.overall_stage}</TableCell>
                      <TableCell>{session.message_count}</TableCell>
                      <TableCell className="text-right">
                        {canViewReport ? (
                          <Link
                            href={`/sessions/${session.session_id}/report`}
                            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                          >
                            View report
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
