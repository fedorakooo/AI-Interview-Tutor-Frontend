export type InterviewSessionStatus = "active" | "completed" | "suspended" | "failed";

export type OverallInterviewStage =
  | "Greeting"
  | "Soft Questions"
  | "Hard Questions"
  | "Wrap Up"
  | "Completed";

export interface SkillScore {
  skill: string;
  score: number;
  notes: string;
}

export interface InterviewReport {
  summary: string;
  skill_scores: SkillScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface InterviewSessionDocument {
  session_id: string;
  user_id: string;
  status: InterviewSessionStatus;
  started_at: string;
  completed_at: string | null;
  overall_stage: string;
  message_count: number;
  report: InterviewReport | null;
  cv_correlation_id: string | null;
  instance_id: string | null;
}

export interface InterviewRuntimeStatus {
  session_id: string;
  user_id: string;
  status: "active";
  started_at: string;
}

/** Client → Server WebSocket messages */
export type ClientMessage =
  | { type: "user_message"; content: string }
  | { type: "end_interview" }
  | { type: "get_status" };

/** Server → Client WebSocket messages */
export type ServerMessage =
  | {
      type: "interview_started";
      user_id: string;
      session_id: string;
      cv_source: string;
      correlation_id?: string | null;
      timestamp?: string;
    }
  | {
      type: "agent_message";
      content: string;
      stage: string;
      session_id: string;
      timestamp?: string;
    }
  | {
      type: "interview_complete";
      message: string;
      session_id: string;
      timestamp?: string;
    }
  | {
      type: "report_ready";
      session_id: string;
      report: InterviewReport;
      timestamp?: string;
    }
  | {
      type: "interview_status";
      status: InterviewRuntimeStatus;
    }
  | {
      type: "error";
      code?: string;
      message: string;
      session_id?: string;
      timestamp?: string;
    }
  | {
      type: "server_shutdown";
      message: string;
      session_id: string;
      timestamp?: string;
    };

export interface ChatMessage {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  stage?: string;
  timestamp: string;
}
