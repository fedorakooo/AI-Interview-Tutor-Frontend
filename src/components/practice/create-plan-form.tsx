"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { practiceApi } from "@/lib/api/practice";
import { AppError } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import {
  createPlanSchema,
  SUPPORTED_EXERCISE_TYPES,
  type CreatePlanFormValues,
  type SupportedExerciseType,
} from "@/lib/validations/practice";
import { handleApiError } from "@/lib/utils/handle-api-error";

export function CreatePlanForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [skillInput, setSkillInput] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: queryKeys.practice.profile,
    queryFn: practiceApi.getProfile,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      focus_skills: [],
      difficulty: "mid",
      exercise_types: ["mcq_single", "mcq_multi", "open_question", "flashcard"],
      exercise_count: 8,
      include_interview_context: true,
      include_cv_context: true,
      title_hint: "",
    },
  });

  const focusSkills = watch("focus_skills");
  const exerciseTypes = watch("exercise_types");

  const remaining = profile
    ? profile.daily_plan_quota - profile.plans_generated_today
    : null;

  const createMutation = useMutation({
    mutationFn: practiceApi.createPlan,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.practice.plans() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.practice.profile });
      router.push(`/practice/${data.plan_id}`);
    },
    onError: (error) => {
      if (error instanceof AppError && error.errorCode === "DAILY_PLAN_QUOTA_EXCEEDED") {
        toast.error(error.message, {
          action: {
            label: "View plans",
            onClick: () => router.push("/practice"),
          },
        });
        return;
      }
      handleApiError(error);
    },
  });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || focusSkills.includes(trimmed)) return;
    setValue("focus_skills", [...focusSkills, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setValue(
      "focus_skills",
      focusSkills.filter((s) => s !== skill),
    );
  };

  const toggleExerciseType = (type: SupportedExerciseType) => {
    if (exerciseTypes.includes(type)) {
      setValue(
        "exercise_types",
        exerciseTypes.filter((t) => t !== type),
      );
    } else {
      setValue("exercise_types", [...exerciseTypes, type]);
    }
  };

  const onSubmit = (values: CreatePlanFormValues) => {
    createMutation.mutate({
      ...values,
      title_hint: values.title_hint || null,
    });
  };

  const quotaExceeded = remaining !== null && remaining <= 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {profileLoading ? (
        <p className="text-sm text-muted-foreground">Loading quota…</p>
      ) : remaining !== null ? (
        <p className="text-sm text-muted-foreground">
          You can create <span className="font-medium text-foreground">{remaining}</span> more
          plan{remaining === 1 ? "" : "s"} today.
        </p>
      ) : null}

      <div className="space-y-2">
        <Label>Focus skills (optional)</Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. Python"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addSkill}>
            Add
          </Button>
        </div>
        {focusSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {focusSkills.map((skill) => (
              <Button
                key={skill}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => removeSkill(skill)}
              >
                {skill} ×
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Difficulty</Label>
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Exercise types</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUPPORTED_EXERCISE_TYPES.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={exerciseTypes.includes(opt.value)}
                onCheckedChange={() => toggleExerciseType(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.exercise_types && (
          <p className="text-sm text-destructive">{errors.exercise_types.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercise_count">Number of exercises</Label>
        <Input
          id="exercise_count"
          type="number"
          min={1}
          max={15}
          {...register("exercise_count", { valueAsNumber: true })}
        />
        {errors.exercise_count && (
          <p className="text-sm text-destructive">{errors.exercise_count.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title_hint">Title hint (optional)</Label>
        <Input id="title_hint" {...register("title_hint")} placeholder="e.g. Backend prep" />
      </div>

      <div className="space-y-3">
        <Controller
          name="include_interview_context"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Include interview context
            </label>
          )}
        />
        <Controller
          name="include_cv_context"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Include CV context
            </label>
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting || quotaExceeded || createMutation.isPending}>
          {createMutation.isPending ? "Creating…" : "Create plan"}
        </Button>
        <Link href="/practice" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
