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
    transcript: (sessionId: string) => ["interview", "transcript", sessionId] as const,
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
  admin: {
    users: (params?: object) => ["admin", "users", params] as const,
    opsFlags: ["admin", "ops", "flags"] as const,
    opsHealth: ["admin", "ops", "health"] as const,
  },
  billing: {
    entitlements: ["billing", "entitlements"] as const,
  },
  notifications: {
    list: ["notifications"] as const,
  },
  curriculum: {
    questionBank: (category?: string) => ["curriculum", "questions", category] as const,
    learningPaths: ["curriculum", "paths"] as const,
  },
};
