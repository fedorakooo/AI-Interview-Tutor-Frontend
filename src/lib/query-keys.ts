export const queryKeys = {
  user: {
    me: ["user", "me"] as const,
  },
  cv: {
    status: (correlationId?: string) => ["cv", "status", correlationId] as const,
  },
  interview: {
    sessions: (skip: number, limit: number) =>
      ["interview", "sessions", skip, limit] as const,
    report: (sessionId: string) => ["interview", "report", sessionId] as const,
  },
  practice: {
    profile: ["practice", "profile"] as const,
    plans: (filters?: object) => ["practice", "plans", filters] as const,
    plan: (planId: string) => ["practice", "plan", planId] as const,
    progress: (planId: string) => ["practice", "progress", planId] as const,
    attempts: (planId: string, exerciseId: string) =>
      ["practice", "attempts", planId, exerciseId] as const,
    interviewAuto: ["plans", "interview-auto"] as const,
  },
};
