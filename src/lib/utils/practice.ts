import type { PlanPendingResponse, PracticePlan } from "@/lib/types/practice";

export function isPendingPlanResponse(
  plan: PracticePlan | PlanPendingResponse,
): plan is PlanPendingResponse {
  return plan.status === "pending" || plan.status === "generating";
}

export function isPracticePlan(
  plan: PracticePlan | PlanPendingResponse,
): plan is PracticePlan {
  return !isPendingPlanResponse(plan);
}
