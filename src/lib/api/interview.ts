import { apiRequest } from "./client";
import type { InterviewReport, InterviewSessionDocument } from "@/lib/types/interview";

export const interviewApi = {
  listSessions: (skip = 0, limit = 20) =>
    apiRequest<InterviewSessionDocument[]>(
      `/api/v1/interview/sessions?skip=${skip}&limit=${limit}`,
    ),

  getReport: (sessionId: string) =>
    apiRequest<InterviewReport>(`/api/v1/interview/sessions/${sessionId}/report`),
};
