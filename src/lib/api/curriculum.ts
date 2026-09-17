import { apiRequest } from "./client";

export interface QuestionBankItem {
  question_id: string;
  title: string;
  prompt: string;
  category: string;
  difficulty: string;
  skills: string[];
  company_tags: string[];
  interview_mode: string;
}

export interface LearningPath {
  path_id: string;
  title: string;
  duration_days: number;
  focus_skills: string[];
  milestones: string[];
}

export const curriculumApi = {
  listQuestionBank: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return apiRequest<QuestionBankItem[]>(`/api/v1/interview/question-bank${query}`);
  },

  listLearningPaths: () =>
    apiRequest<LearningPath[]>("/api/v1/interview/learning-paths"),
};
