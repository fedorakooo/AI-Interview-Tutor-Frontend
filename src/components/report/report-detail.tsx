"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillRadarChart } from "@/components/report/skill-radar-chart";
import { useInterviewAutoPlan } from "@/lib/hooks/use-interview-auto-plan";
import type { InterviewReport } from "@/lib/types/interview";
import { cn } from "@/lib/utils";

interface ReportDetailProps {
  report: InterviewReport;
  sessionId?: string;
  pollAutoPlan?: boolean;
}

export function ReportDetail({ report, sessionId, pollAutoPlan = false }: ReportDetailProps) {
  const { data: autoPlan } = useInterviewAutoPlan(pollAutoPlan);
  const toastedPlanId = useRef<string | null>(null);

  useEffect(() => {
    if (autoPlan && toastedPlanId.current !== autoPlan.plan_id) {
      toastedPlanId.current = autoPlan.plan_id;
      toast.success("Your personalized practice plan is ready!", {
        action: {
          label: "View plan",
          onClick: () => {
            window.location.href = `/practice/${autoPlan.plan_id}`;
          },
        },
      });
    }
  }, [autoPlan]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill scores</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillRadarChart skillScores={report.skill_scores} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {report.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-amber-700 dark:text-amber-400">Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {report.weaknesses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-inside list-decimal space-y-2 text-sm">
            {report.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/practice" className={cn(buttonVariants())}>
          Start practice plan
        </Link>
        {autoPlan && (
          <Link
            href={`/practice/${autoPlan.plan_id}`}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            View auto-generated plan
          </Link>
        )}
        {sessionId && (
          <Link
            href="/sessions"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to sessions
          </Link>
        )}
      </div>
    </div>
  );
}
