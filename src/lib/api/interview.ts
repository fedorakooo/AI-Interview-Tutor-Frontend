import { apiRequest, AppError } from "./client";
import type {
  InterviewReport,
  InterviewSessionDocument,
  InterviewTranscript,
} from "@/lib/types/interview";

export const interviewApi = {
  listSessions: (skip = 0, limit = 20) =>
    apiRequest<InterviewSessionDocument[]>(
      `/api/v1/interview/sessions?skip=${skip}&limit=${limit}`,
    ),

  getReport: (sessionId: string) =>
    apiRequest<InterviewReport>(`/api/v1/interview/sessions/${sessionId}/report`),

  async getTranscript(sessionId: string): Promise<InterviewTranscript | null> {
    try {
      return await apiRequest<InterviewTranscript>(
        `/api/v1/interview/sessions/${sessionId}/transcript`,
      );
    } catch (error) {
      if (error instanceof AppError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
