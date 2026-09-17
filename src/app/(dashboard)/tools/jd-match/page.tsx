"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AppError, apiRequest } from "@/lib/api/client";
import { useCvReady } from "@/lib/hooks/use-cv-status";
import { cn } from "@/lib/utils";

type MatchResult = {
  match_score?: number;
  summary?: string;
  missing_skills?: string[];
  matched_skills?: string[];
  recommendations?: string[];
};

export default function JdMatchPage() {
  const [jobDescription, setJobDescription] = useState("");
  const { isCvReady, isLoading } = useCvReady();

  const matchMutation = useMutation({
    mutationFn: () =>
      apiRequest<MatchResult>("/api/v1/analyze/jd-match", {
        method: "POST",
        body: { job_description: jobDescription },
      }),
  });

  const errorMessage =
    matchMutation.error instanceof AppError
      ? matchMutation.error.message
      : matchMutation.error instanceof Error
        ? matchMutation.error.message
        : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job description matcher</h1>
        <p className="text-muted-foreground">
          Compare a role against the skills in your analyzed CV.
        </p>
      </div>

      {!isLoading && !isCvReady && (
        <Alert>
          <AlertTitle>CV analysis required</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>Upload and analyze your CV before matching it to a job description.</p>
            <Link href="/onboarding" className={cn(buttonVariants({ size: "sm" }))}>
              Go to onboarding
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Paste a job description</CardTitle>
          <CardDescription>
            Submits to <code className="text-xs">POST /api/v1/analyze/jd-match</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the complete job description here…"
            rows={12}
            disabled={!isCvReady || matchMutation.isPending}
          />
          <Button
            disabled={!isCvReady || !jobDescription.trim() || matchMutation.isPending}
            onClick={() => matchMutation.mutate()}
          >
            {matchMutation.isPending ? "Matching…" : "Match my CV"}
          </Button>

          {matchMutation.isError && (
            <Alert variant="destructive">
              <AlertTitle>Match failed</AlertTitle>
              <AlertDescription>
                {errorMessage ?? "We could not generate a match right now. Please try again later."}
              </AlertDescription>
            </Alert>
          )}

          {matchMutation.data && (
            <div className="space-y-2 rounded-md border p-4 text-sm">
              {matchMutation.data.match_score !== undefined && (
                <p className="text-lg font-semibold">
                  Match score: {matchMutation.data.match_score}%
                </p>
              )}
              {matchMutation.data.summary && <p>{matchMutation.data.summary}</p>}
              {!!matchMutation.data.matched_skills?.length && (
                <p className="text-muted-foreground">
                  Matched: {matchMutation.data.matched_skills.join(", ")}
                </p>
              )}
              {!!matchMutation.data.missing_skills?.length && (
                <p className="text-muted-foreground">
                  Skills to develop: {matchMutation.data.missing_skills.join(", ")}
                </p>
              )}
              {!!matchMutation.data.recommendations?.length && (
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  {matchMutation.data.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
