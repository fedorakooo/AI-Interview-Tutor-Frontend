"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Exercise } from "@/lib/types/practice";

interface McqSingleExerciseProps {
  exercise: Exercise;
  disabled?: boolean;
  onSubmit: (selectedChoiceIds: string[]) => void;
  isSubmitting?: boolean;
}

export function McqSingleExercise({
  exercise,
  disabled,
  onSubmit,
  isSubmitting,
}: McqSingleExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{exercise.prompt}</p>
      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        disabled={disabled}
        className="space-y-2"
      >
        {(exercise.choices ?? []).map((choice) => (
          <label
            key={choice.choice_id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
          >
            <RadioGroupItem value={choice.choice_id} />
            <span className="text-sm">{choice.text}</span>
          </label>
        ))}
      </RadioGroup>
      <Button
        type="button"
        disabled={disabled || !selected || isSubmitting}
        onClick={() => selected && onSubmit([selected])}
      >
        {isSubmitting ? "Submitting…" : "Submit answer"}
      </Button>
    </div>
  );
}
