"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { practiceApi } from "@/lib/api/practice";
import { useAuth } from "@/lib/hooks/use-auth";
import { queryKeys } from "@/lib/query-keys";
import type { DifficultyLevel, ExerciseType } from "@/lib/types/practice";
import { SUPPORTED_EXERCISE_TYPES } from "@/lib/validations/practice";
import { handleApiError } from "@/lib/utils/handle-api-error";

const practiceProfileSchema = z.object({
  preferred_difficulty: z.enum(["junior", "mid", "senior"]),
  preferred_exercise_types: z.array(z.string()).min(1),
  weekly_target_minutes: z.number().int().min(15).max(600),
});

type PracticeProfileFormValues = z.infer<typeof practiceProfileSchema>;

export function PracticeTab() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.practice.profile,
    queryFn: practiceApi.getProfile,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PracticeProfileFormValues>({
    resolver: zodResolver(practiceProfileSchema),
    values: profile
      ? {
          preferred_difficulty: profile.preferred_difficulty,
          preferred_exercise_types: profile.preferred_exercise_types.filter((t) =>
            SUPPORTED_EXERCISE_TYPES.some((s) => s.value === t),
          ),
          weekly_target_minutes: profile.weekly_target_minutes,
        }
      : undefined,
  });

  const selectedTypes = watch("preferred_exercise_types");
  const difficulty = watch("preferred_difficulty");

  const updateMutation = useMutation({
    mutationFn: practiceApi.updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.practice.profile });
    },
  });

  const toggleExerciseType = (type: ExerciseType, checked: boolean) => {
    const current = selectedTypes ?? [];
    const next = checked ? [...current, type] : current.filter((t) => t !== type);
    setValue("preferred_exercise_types", next, { shouldDirty: true });
  };

  const onSubmit = async (values: PracticeProfileFormValues) => {
    try {
      await updateMutation.mutateAsync({
        preferred_difficulty: values.preferred_difficulty as DifficultyLevel,
        preferred_exercise_types: values.preferred_exercise_types as ExerciseType[],
        weekly_target_minutes: values.weekly_target_minutes,
      });
    } catch (error) {
      handleApiError(error, { onBlocked: logout });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!profile) return null;

  const remaining = profile.daily_plan_quota - profile.plans_generated_today;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Current streak</p>
          <p className="text-2xl font-semibold">{profile.current_streak_days} days</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Exercises completed</p>
          <p className="text-2xl font-semibold">{profile.total_exercises_completed}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Plans remaining today</p>
          <p className="text-2xl font-semibold">{remaining}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label>Preferred difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(v) =>
              setValue("preferred_difficulty", v as DifficultyLevel, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preferred exercise types</Label>
          <div className="space-y-2">
            {SUPPORTED_EXERCISE_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedTypes?.includes(type.value)}
                  onCheckedChange={(checked) =>
                    toggleExerciseType(type.value, checked === true)
                  }
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weekly_target_minutes">Weekly target (minutes)</Label>
          <Input
            id="weekly_target_minutes"
            type="number"
            min={15}
            max={600}
            {...register("weekly_target_minutes", { valueAsNumber: true })}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save practice preferences"}
        </Button>
      </form>
    </div>
  );
}
