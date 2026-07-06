"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Exercise, FlashcardRating } from "@/lib/types/practice";

interface FlashcardExerciseProps {
  exercise: Exercise;
  disabled?: boolean;
  onSubmit: (rating: FlashcardRating) => void;
  isSubmitting?: boolean;
}

export function FlashcardExercise({
  exercise,
  disabled,
  onSubmit,
  isSubmitting,
}: FlashcardExerciseProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {revealed ? "Answer" : "Question"}
        </p>
        <p className="mt-2 text-base leading-relaxed">
          {revealed
            ? (exercise.reference_answer ?? exercise.explanation ?? "No answer provided.")
            : exercise.prompt}
        </p>
      </div>

      {!revealed ? (
        <Button type="button" onClick={() => setRevealed(true)} disabled={disabled}>
          Reveal answer
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">How well did you know this?</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={disabled || isSubmitting}
              onClick={() => onSubmit("again")}
            >
              Again
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={disabled || isSubmitting}
              onClick={() => onSubmit("good")}
            >
              Good
            </Button>
            <Button
              type="button"
              disabled={disabled || isSubmitting}
              onClick={() => onSubmit("easy")}
            >
              Easy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
