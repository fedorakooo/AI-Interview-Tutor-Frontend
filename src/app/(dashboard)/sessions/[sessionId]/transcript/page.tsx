"use client";

import { use } from "react";
import { SessionTranscriptView } from "@/components/sessions/session-transcript-view";

interface TranscriptPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function TranscriptPage({ params }: TranscriptPageProps) {
  const { sessionId } = use(params);
  return <SessionTranscriptView sessionId={sessionId} />;
}
