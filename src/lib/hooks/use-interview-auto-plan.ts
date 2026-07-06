"use client";

import { useQuery } from "@tanstack/react-query";
import { practiceApi } from "@/lib/api/practice";
import { queryKeys } from "@/lib/query-keys";
import type { PlanSummary } from "@/lib/types/practice";

export function useInterviewAutoPlan(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.practice.interviewAuto,
    queryFn: async (): Promise<PlanSummary | null> => {
      const plans = await practiceApi.listPlans({ status: "ready" });
      return plans.find((p) => p.source === "interview") ?? null;
    },
    enabled,
    refetchInterval: (query) => (query.state.data ? false : 5000),
  });
}
