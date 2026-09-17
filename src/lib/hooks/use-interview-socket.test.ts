import { describe, expect, it } from "vitest";
import {
  interviewSocketInitialState,
  interviewSocketReducer,
} from "@/lib/hooks/use-interview-socket";

describe("interviewSocketReducer", () => {
  it("sets connecting state", () => {
    const next = interviewSocketReducer(interviewSocketInitialState, { type: "CONNECTING" });
    expect(next.status).toBe("connecting");
    expect(next.error).toBeNull();
  });

  it("handles connected with system message", () => {
    const next = interviewSocketReducer(interviewSocketInitialState, {
      type: "CONNECTED",
      sessionId: "session-1",
      cvSource: "mongodb",
    });

    expect(next.status).toBe("connected");
    expect(next.sessionId).toBe("session-1");
    expect(next.messages).toHaveLength(1);
    expect(next.messages[0]?.role).toBe("system");
  });

  it("appends agent message and updates stage", () => {
    const connected = interviewSocketReducer(interviewSocketInitialState, {
      type: "CONNECTED",
      sessionId: "session-1",
      cvSource: "mongodb",
    });

    const next = interviewSocketReducer(connected, {
      type: "AGENT_MESSAGE",
      content: "Hello",
      stage: "Greeting",
    });

    expect(next.stage).toBe("Greeting");
    expect(next.messages).toHaveLength(2);
    expect(next.messages[1]?.role).toBe("agent");
    expect(next.messages[1]?.content).toBe("Hello");
  });

  it("stores report on REPORT action", () => {
    const report = {
      summary: "Good job",
      skill_scores: [],
      strengths: [],
      weaknesses: [],
      recommendations: [],
    };

    const next = interviewSocketReducer(interviewSocketInitialState, {
      type: "REPORT",
      report,
    });

    expect(next.report).toEqual(report);
  });

  it("records close code on disconnect", () => {
    const next = interviewSocketReducer(interviewSocketInitialState, {
      type: "DISCONNECTED",
      closeCode: 4001,
    });

    expect(next.status).toBe("disconnected");
    expect(next.closeCode).toBe(4001);
  });
});
