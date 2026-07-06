import { apiRequest } from "./client";
import type {
  AttemptRequest,
  AttemptResponse,
  CreatePlanRequest,
  ExerciseAttempt,
  PlanCreatedResponse,
  PlanPendingResponse,
  PlanProgress,
  PlanStatus,
  PlanSummary,
  PracticePlan,
  UpdateProfileRequest,
  UserPracticeProfile,
} from "@/lib/types/practice";

export const practiceApi = {
  getProfile: () => apiRequest<UserPracticeProfile>("/api/v1/practice/profile"),

  updateProfile: (data: UpdateProfileRequest) =>
    apiRequest<UserPracticeProfile>("/api/v1/practice/profile", {
      method: "PUT",
      body: data,
    }),

  createPlan: (data: CreatePlanRequest) =>
    apiRequest<PlanCreatedResponse>("/api/v1/practice/plans", {
      method: "POST",
      body: data,
    }),

  listPlans: (params?: { skip?: number; limit?: number; status?: PlanStatus }) => {
    const qs = new URLSearchParams();
    if (params?.skip !== undefined) qs.set("skip", String(params.skip));
    if (params?.limit !== undefined) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    const query = qs.toString();
    return apiRequest<PlanSummary[]>(
      `/api/v1/practice/plans${query ? `?${query}` : ""}`,
    );
  },

  getPlan: (planId: string) =>
    apiRequest<PracticePlan | PlanPendingResponse>(`/api/v1/practice/plans/${planId}`),

  archivePlan: (planId: string) =>
    apiRequest<void>(`/api/v1/practice/plans/${planId}`, { method: "DELETE" }),

  submitAttempt: (planId: string, exerciseId: string, data: AttemptRequest) =>
    apiRequest<AttemptResponse>(
      `/api/v1/practice/plans/${planId}/exercises/${exerciseId}/attempt`,
      { method: "POST", body: data },
    ),

  getProgress: (planId: string) =>
    apiRequest<PlanProgress>(`/api/v1/practice/plans/${planId}/progress`),

  listAttempts: (planId: string, exerciseId: string) =>
    apiRequest<ExerciseAttempt[]>(
      `/api/v1/practice/plans/${planId}/exercises/${exerciseId}/attempts`,
    ),
};
