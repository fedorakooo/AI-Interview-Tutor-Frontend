"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AttemptResult } from "@/components/practice/attempt-result";
import { FlashcardExercise } from "@/components/practice/exercises/flashcard-exercise";
import { McqMultiExercise } from "@/components/practice/exercises/mcq-multi-exercise";
import { McqSingleExercise } from "@/components/practice/exercises/mcq-single-exercise";
import { OpenQuestionExercise } from "@/components/practice/exercises/open-question-exercise";
import { AppError } from "@/lib/api/client";
import { practiceApi } from "@/lib/api/practice";
import { queryKeys } from "@/lib/query-keys";
import { isPracticePlan } from "@/lib/utils/practice";
import { handleApiError } from "@/lib/utils/handle-api-error";
import type { AttemptRequest, AttemptResponse } from "@/lib/types/practice";
import { cn } from "@/lib/utils";

interface ExercisePageProps {
  params: Promise<{ planId: string; exerciseId: string }>;
}

export default function ExercisePage({ params }: ExercisePageProps) {
  const { planId, exerciseId } = use(params);
  const queryClient = useQueryClient();
  const [gradingFailed, setGradingFailed] = useState(false);
  const [attemptResult, setAttemptResult] = useState<AttemptResponse | null>(null);

  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: queryKeys.practice.plan(planId),
    queryFn: () => practiceApi.getPlan(planId),
    enabled: !!planId,
  });

  const { data: attempts, isLoading: attemptsLoading } = useQuery({
    queryKey: queryKeys.practice.attempts(planId, exerciseId),
    queryFn: () => practiceApi.listAttempts(planId, exerciseId),
    enabled: !!planId && !!exerciseId,
  });

  const priorAttempt = attempts?.[0];
  const displayResult = attemptResult ?? priorAttempt;
  const hasAttempted = !!displayResult;

  const submitMutation = useMutation({
    mutationFn: (data: AttemptRequest) =>
      practiceApi.submitAttempt(planId, exerciseId, data),
    onSuccess: (result) => {
      setAttemptResult(result);
      setGradingFailed(false);
      void queryClient.invalidateQueries({ queryKey: queryKeys.practice.plan(planId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.practice.progress(planId) });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.practice.attempts(planId, exerciseId),
      });
    },
    onError: (error) => {
      if (error instanceof AppError) {
        if (error.errorCode === "ALREADY_ATTEMPTED") {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.practice.attempts(planId, exerciseId),
          });
          return;
        }
        if (error.errorCode === "GRADING_FAILED") {
          setGradingFailed(true);
          return;
        }
      }
      handleApiError(error);
    },
  });

  const exercise =
    plan && isPracticePlan(plan)
      ? plan.exercises.find((e) => e.exercise_id === exerciseId)
      : undefined;

  const isLoading = planLoading || attemptsLoading;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/practice/${planId}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
      >
        <ArrowLeft className="size-4" />
        Back to plan
      </Link>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !exercise ? (
        <p className="text-sm text-muted-foreground">Exercise not found.</p>
      ) : (
        <>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{exercise.title}</h1>
              <Badge variant="outline">{exercise.type}</Badge>
              <Badge variant="secondary" className="capitalize">
                {exercise.difficulty}
              </Badge>
            </div>
            {exercise.skill_tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {exercise.skill_tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exercise</CardTitle>
              {exercise.hint && (
                <CardDescription>Hint: {exercise.hint}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {hasAttempted && displayResult ? (
                <AttemptResult result={displayResult} />
              ) : exercise.type === "mcq_single" ? (
                <McqSingleExercise
                  exercise={exercise}
                  disabled={hasAttempted}
                  isSubmitting={submitMutation.isPending}
                  onSubmit={(ids) =>
                    submitMutation.mutate({ selected_choice_ids: ids })
                  }
                />
              ) : exercise.type === "mcq_multi" ? (
                <McqMultiExercise
                  exercise={exercise}
                  disabled={hasAttempted}
                  isSubmitting={submitMutation.isPending}
                  onSubmit={(ids) =>
                    submitMutation.mutate({ selected_choice_ids: ids })
                  }
                />
              ) : exercise.type === "open_question" ? (
                <OpenQuestionExercise
                  exercise={exercise}
                  disabled={hasAttempted}
                  isSubmitting={submitMutation.isPending}
                  gradingFailed={gradingFailed}
                  onRetry={() => setGradingFailed(false)}
                  onSubmit={(text) => submitMutation.mutate({ text_answer: text })}
                />
              ) : exercise.type === "flashcard" ? (
                <FlashcardExercise
                  exercise={exercise}
                  disabled={hasAttempted}
                  isSubmitting={submitMutation.isPending}
                  onSubmit={(rating) =>
                    submitMutation.mutate({
                      flashcard_rating: rating,
                      revealed_back: true,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Exercise type &quot;{exercise.type}&quot; is not supported in this player yet.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
