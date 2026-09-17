"use client";

import { use } from "react";
import { SessionTranscriptView } from "@/components/sessions/session-transcript-view";

interface SessionDetailPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { sessionId } = use(params);
  return <SessionTranscriptView sessionId={sessionId} />;
}
