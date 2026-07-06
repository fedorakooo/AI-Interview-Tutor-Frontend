import { z } from "zod";

const supportedExerciseTypes = [
  "mcq_single",
  "mcq_multi",
  "open_question",
  "flashcard",
] as const;

export const createPlanSchema = z.object({
  focus_skills: z.array(z.string().trim().min(1)),
  difficulty: z.enum(["junior", "mid", "senior"]),
  exercise_types: z
    .array(z.enum(supportedExerciseTypes))
    .min(1, "Select at least one exercise type"),
  exercise_count: z.number().int().min(1).max(15),
  include_interview_context: z.boolean(),
  include_cv_context: z.boolean(),
  title_hint: z.string().trim().max(100).optional().nullable(),
});

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>;

export type SupportedExerciseType = (typeof supportedExerciseTypes)[number];

export const SUPPORTED_EXERCISE_TYPES: { value: SupportedExerciseType; label: string }[] = [
  { value: "mcq_single", label: "Single choice" },
  { value: "mcq_multi", label: "Multiple choice" },
  { value: "open_question", label: "Open question" },
  { value: "flashcard", label: "Flashcard" },
];
