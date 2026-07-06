export type DifficultyLevel = "junior" | "mid" | "senior";

export type ExerciseType =
  | "mcq_single"
  | "mcq_multi"
  | "open_question"
  | "flashcard"
  | "code_review"
  | "scenario";

export type FlashcardRating = "again" | "good" | "easy";

export type PlanStatus = "pending" | "generating" | "ready" | "failed" | "archived";

export type PlanSource = "manual" | "interview" | "cv" | "combined";

export type AttemptStatus = "submitted" | "graded" | "skipped";

export interface Choice {
  choice_id: string;
  text: string;
  is_correct?: boolean;
}

export interface Exercise {
  exercise_id: string;
  type: ExerciseType;
  skill_tags: string[];
  difficulty: DifficultyLevel;
  title: string;
  prompt: string;
  choices?: Choice[] | null;
  hint?: string | null;
  max_answer_chars?: number | null;
  rubric_bullets: string[];
  reference_answer?: string | null;
  code_snippet?: string | null;
  code_language?: string | null;
  scenario_tasks: string[];
  explanation?: string | null;
  estimated_minutes: number;
}

export interface SkillScoreContext {
  skill: string;
  score: number;
  notes: string;
}

export interface PlanContextSnapshot {
  focus_skills: string[];
  cv_specialization: string | null;
  cv_top_skills: string[];
  interview_weaknesses: string[];
  interview_low_scores: SkillScoreContext[];
  user_goals: string[];
  difficulty: DifficultyLevel;
  exercise_types_requested: ExerciseType[];
}

export interface PracticePlan {
  plan_id: string;
  user_id: string;
  source: PlanSource;
  status: PlanStatus;
  title: string;
  focus_skills: string[];
  difficulty: DifficultyLevel;
  exercises: Exercise[];
  context_snapshot: PlanContextSnapshot;
  interview_session_id: string | null;
  cv_correlation_id: string | null;
  error_code: string | null;
  error_message: string | null;
  exercise_count: number;
  created_at: string;
  updated_at: string;
  ready_at: string | null;
}

export interface PlanSummary {
  plan_id: string;
  status: PlanStatus;
  title: string;
  focus_skills: string[];
  difficulty: string;
  exercise_count: number;
  source: string;
  created_at: string;
  updated_at: string;
  ready_at: string | null;
}

export interface PlanPendingResponse {
  plan_id: string;
  status: "pending" | "generating";
  message: string;
}

export interface CreatePlanRequest {
  focus_skills?: string[];
  difficulty?: DifficultyLevel;
  exercise_types?: ExerciseType[];
  exercise_count?: number;
  include_interview_context?: boolean;
  include_cv_context?: boolean;
  title_hint?: string | null;
}

export interface PlanCreatedResponse {
  plan_id: string;
  status: PlanStatus;
  message?: string;
}

export interface AttemptRequest {
  selected_choice_ids?: string[];
  text_answer?: string;
  flashcard_rating?: FlashcardRating;
  revealed_back?: boolean;
}

export interface GradingResult {
  score: number;
  is_correct: boolean | null;
  feedback: string;
  key_points_missed: string[];
  graded_by: "deterministic" | "llm" | "self";
}

export interface AttemptResponse {
  attempt_id: string;
  status: AttemptStatus;
  grading: GradingResult | null;
  reference_answer: string | null;
  explanation: string | null;
}

export interface ExerciseAttempt {
  attempt_id: string;
  plan_id: string;
  exercise_id: string;
  user_id: string;
  exercise_type: ExerciseType;
  answer: Record<string, unknown>;
  flashcard_rating: FlashcardRating | null;
  status: AttemptStatus;
  grading: GradingResult | null;
  submitted_at: string;
  graded_at: string | null;
}

export interface DevelopmentGoal {
  skill: string;
  target_level: DifficultyLevel | null;
  priority: number;
  notes: string | null;
}

export interface UserPracticeProfile {
  user_id: string;
  development_goals: DevelopmentGoal[];
  preferred_difficulty: DifficultyLevel;
  preferred_exercise_types: ExerciseType[];
  weekly_target_minutes: number;
  daily_plan_quota: number;
  plans_generated_today: number;
  quota_reset_date: string | null;
  current_streak_days: number;
  last_practice_date: string | null;
  total_exercises_completed: number;
  updated_at: string;
}

export interface UpdateProfileRequest {
  development_goals?: DevelopmentGoal[];
  preferred_difficulty?: DifficultyLevel;
  preferred_exercise_types?: ExerciseType[];
  weekly_target_minutes?: number;
}

export interface PlanProgress {
  plan_id: string;
  total_exercises: number;
  attempted: number;
  completed: number;
  skipped: number;
  completion_percent: number;
  average_score: number;
  scores_by_skill: Record<string, { average: number; count: number }>;
  current_streak_days: number;
}

export type PracticeErrorCode =
  | "PLAN_NOT_READY"
  | "ALREADY_ATTEMPTED"
  | "DAILY_PLAN_QUOTA_EXCEEDED"
  | "INVALID_ANSWER_FORMAT"
  | "ANSWER_TOO_LONG"
  | "GRADING_FAILED"
  | "INVALID_PROFILE"
  | "UNSUPPORTED_EXERCISE_TYPE"
  | "INVALID_EXERCISE_COUNT"
  | "PLAN_GENERATION_FAILED";
