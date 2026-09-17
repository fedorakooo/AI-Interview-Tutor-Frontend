"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { env } from "@/lib/env";
import { tokenStore } from "@/lib/auth/token-store";
import { decodeAccessToken, isTokenExpired } from "@/lib/auth/jwt";
import type { ChatMessage, ClientMessage, InterviewMode, InterviewReport, ServerMessage } from "@/lib/types/interview";

export type SocketState = {
  messages: ChatMessage[];
  sessionId: string | null;
  stage: string | null;
  status: "idle" | "connecting" | "connected" | "completed" | "error" | "disconnected";
  error: string | null;
  report: InterviewReport | null;
  closeCode: number | null;
};

export type SocketAction =
  | { type: "CONNECTING" }
  | { type: "CONNECTED"; sessionId: string; cvSource: string }
  | { type: "AGENT_MESSAGE"; content: string; stage: string }
  | { type: "USER_MESSAGE"; content: string }
  | { type: "COMPLETE" }
  | { type: "REPORT"; report: InterviewReport }
  | { type: "ERROR"; message: string }
  | { type: "DISCONNECTED"; closeCode?: number };

export type InterviewStartConfig = {
  mode: InterviewMode;
  jobDescription: string;
  companyPreset?: string;
  roleTrack?: string;
  language?: string;
  voiceEnabled?: boolean;
  resumeSessionId?: string;
};

export function interviewSocketReducer(state: SocketState, action: SocketAction): SocketState {
  const now = new Date().toISOString();
  switch (action.type) {
    case "CONNECTING":
      return { ...state, status: "connecting", error: null, closeCode: null };
    case "CONNECTED":
      return {
        ...state,
        status: "connected",
        sessionId: action.sessionId,
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: "system",
            content: `Interview started (CV source: ${action.cvSource})`,
            timestamp: now,
          },
        ],
      };
    case "AGENT_MESSAGE":
      return {
        ...state,
        stage: action.stage,
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: "agent",
            content: action.content,
            stage: action.stage,
            timestamp: now,
          },
        ],
      };
    case "USER_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: crypto.randomUUID(), role: "user", content: action.content, timestamp: now },
        ],
      };
    case "COMPLETE":
      return {
        ...state,
        status: "completed",
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: "system",
            content: "Interview completed successfully.",
            timestamp: now,
          },
        ],
      };
    case "REPORT":
      return { ...state, report: action.report };
    case "ERROR":
      return { ...state, status: "error", error: action.message };
    case "DISCONNECTED":
      return {
        ...state,
        status: "disconnected",
        closeCode: action.closeCode ?? state.closeCode,
      };
    default:
      return state;
  }
}

export const interviewSocketInitialState: SocketState = {
  messages: [],
  sessionId: null,
  stage: null,
  status: "idle",
  error: null,
  report: null,
  closeCode: null,
};

async function getValidAccessToken(): Promise<string | null> {
  let token = tokenStore.getAccessToken();
  if (!token) return null;

  if (isTokenExpired(token)) {
    try {
      const tokens = await authApi.refresh();
      tokenStore.setAccessToken(tokens.access_token);
      token = tokens.access_token;
    } catch {
      return null;
    }
  }

  return token;
}

export function useInterviewSocket() {
  const [state, dispatch] = useReducer(interviewSocketReducer, interviewSocketInitialState);
  const wsRef = useRef<WebSocket | null>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  const connect = useCallback(async (config?: InterviewStartConfig) => {
    const token = await getValidAccessToken();
    const claims = token ? decodeAccessToken(token) : null;
    if (!token || !claims?.id) {
      dispatch({ type: "ERROR", message: "Not authenticated" });
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    dispatch({ type: "CONNECTING" });
    const params = new URLSearchParams({ token });
    if (config?.mode) params.set("mode", config.mode);
    if (config?.jobDescription.trim()) params.set("job_description", config.jobDescription.trim());
    if (config?.companyPreset) params.set("company_preset", config.companyPreset);
    if (config?.roleTrack) params.set("role_track", config.roleTrack);
    if (config?.language) params.set("language", config.language);
    if (config?.voiceEnabled) params.set("voice_enabled", "true");
    if (config?.resumeSessionId) params.set("resume_session_id", config.resumeSessionId);
    const url = `${env.NEXT_PUBLIC_WS_BASE_URL}/api/v1/interview/ws/${claims.id}?${params.toString()}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (config?.mode || config?.jobDescription.trim()) {
        ws.send(
          JSON.stringify({
            type: "start_config",
            mode: config.mode ?? "mixed",
            job_description: config.jobDescription.trim() || undefined,
            company_preset: config.companyPreset,
            role_track: config.roleTrack,
            language: config.language,
            voice_enabled: config.voiceEnabled,
          }),
        );
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data as string) as ServerMessage;
      setIsAgentTyping(false);

      switch (data.type) {
        case "interview_started":
          dispatch({
            type: "CONNECTED",
            sessionId: data.session_id,
            cvSource: data.cv_source,
          });
          break;
        case "agent_message":
          dispatch({
            type: "AGENT_MESSAGE",
            content: data.content,
            stage: data.stage,
          });
          break;
        case "interview_complete":
          dispatch({ type: "COMPLETE" });
          break;
        case "report_ready":
          dispatch({ type: "REPORT", report: data.report });
          break;
        case "error":
          if (data.code === "CV_NOT_READY") {
            dispatch({
              type: "ERROR",
              message: data.message ?? "Upload and analyze your CV first.",
            });
          } else {
            dispatch({ type: "ERROR", message: data.message });
          }
          break;
        case "server_shutdown":
          dispatch({ type: "ERROR", message: data.message });
          break;
        case "interview_status":
          break;
      }
    };

    ws.onclose = (event) => {
      dispatch({ type: "DISCONNECTED", closeCode: event.code });
      if (event.code === 4001) {
        dispatch({ type: "ERROR", message: "CV not ready. Complete onboarding first." });
      } else if (event.code === 4002) {
        dispatch({ type: "ERROR", message: "Server is shutting down. Progress saved." });
      } else if (event.code === 1008) {
        dispatch({ type: "ERROR", message: "Authentication failed or account blocked." });
      }
    };

    ws.onerror = () => {
      dispatch({ type: "ERROR", message: "WebSocket connection error" });
    };
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const msg: ClientMessage = { type: "user_message", content };
    wsRef.current.send(JSON.stringify(msg));
    dispatch({ type: "USER_MESSAGE", content });
    setIsAgentTyping(true);
  }, []);

  const sendVoiceChunk = useCallback((transcript: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const msg = { type: "voice_chunk", transcript };
    wsRef.current.send(JSON.stringify(msg));
    dispatch({ type: "USER_MESSAGE", content: transcript });
    setIsAgentTyping(true);
  }, []);

  const endInterview = useCallback(() => {
    if (!wsRef.current) return;
    const msg: ClientMessage = { type: "end_interview" };
    wsRef.current.send(JSON.stringify(msg));
    wsRef.current.close();
    dispatch({ type: "DISCONNECTED" });
  }, []);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return {
    ...state,
    isAgentTyping,
    connect,
    sendMessage,
    sendVoiceChunk,
    endInterview,
    isConnected: state.status === "connected",
  };
}
