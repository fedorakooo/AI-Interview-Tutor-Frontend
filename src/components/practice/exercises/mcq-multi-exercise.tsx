"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Exercise } from "@/lib/types/practice";

interface McqMultiExerciseProps {
  exercise: Exercise;
  disabled?: boolean;
  onSubmit: (selectedChoiceIds: string[]) => void;
  isSubmitting?: boolean;
}

export function McqMultiExercise({
  exercise,
  disabled,
  onSubmit,
  isSubmitting,
}: McqMultiExerciseProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (choiceId: string) => {
    setSelected((prev) =>
      prev.includes(choiceId) ? prev.filter((id) => id !== choiceId) : [...prev, choiceId],
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{exercise.prompt}</p>
      <p className="text-xs text-muted-foreground">Select all that apply.</p>
      <div className="space-y-2">
        {(exercise.choices ?? []).map((choice) => (
          <label
            key={choice.choice_id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
          >
            <Checkbox
              checked={selected.includes(choice.choice_id)}
              onCheckedChange={() => toggle(choice.choice_id)}
              disabled={disabled}
            />
            <span className="text-sm">{choice.text}</span>
          </label>
        ))}
      </div>
      <Button
        type="button"
        disabled={disabled || selected.length === 0 || isSubmitting}
        onClick={() => onSubmit(selected)}
      >
        {isSubmitting ? "Submitting…" : "Submit answer"}
      </Button>
    </div>
  );
}
