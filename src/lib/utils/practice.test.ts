import { describe, expect, it } from "vitest";
import { isPendingPlanResponse } from "@/lib/utils/practice";
import type { PlanPendingResponse, PracticePlan } from "@/lib/types/practice";

const readyPlan = {
  plan_id: "plan-1",
  status: "ready",
} as PracticePlan;

const pendingPlan: PlanPendingResponse = {
  plan_id: "plan-2",
  status: "pending",
  message: "Queued",
};

const generatingPlan: PlanPendingResponse = {
  plan_id: "plan-3",
  status: "generating",
  message: "Working",
};

describe("isPendingPlanResponse", () => {
  it("returns true for pending and generating statuses", () => {
    expect(isPendingPlanResponse(pendingPlan)).toBe(true);
    expect(isPendingPlanResponse(generatingPlan)).toBe(true);
  });

  it("returns false for ready plan", () => {
    expect(isPendingPlanResponse(readyPlan)).toBe(false);
  });
});
