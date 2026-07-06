"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Exercise } from "@/lib/types/practice";

interface OpenQuestionExerciseProps {
  exercise: Exercise;
  disabled?: boolean;
  onSubmit: (textAnswer: string) => void;
  isSubmitting?: boolean;
  gradingFailed?: boolean;
  onRetry?: () => void;
}

export function OpenQuestionExercise({
  exercise,
  disabled,
  onSubmit,
  isSubmitting,
  gradingFailed,
  onRetry,
}: OpenQuestionExerciseProps) {
  const [answer, setAnswer] = useState("");
  const maxChars = exercise.max_answer_chars ?? undefined;

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{exercise.prompt}</p>

      {exercise.rubric_bullets.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Rubric hints</p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {exercise.rubric_bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}

      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={disabled || isSubmitting}
        rows={6}
        maxLength={maxChars}
        placeholder="Write your answer here…"
      />

      {maxChars && (
        <p className="text-xs text-muted-foreground">
          {answer.length}/{maxChars} characters
        </p>
      )}

      {gradingFailed && (
        <p className="text-sm text-destructive">
          Grading failed. Please try submitting again.
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          disabled={disabled || !answer.trim() || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Grading…" : "Submit answer"}
        </Button>
        {gradingFailed && onRetry && (
          <Button type="button" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
