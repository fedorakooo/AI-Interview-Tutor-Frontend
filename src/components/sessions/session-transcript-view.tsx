"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageBubble } from "@/components/interview/message-bubble";
import { interviewApi } from "@/lib/api/interview";
import { queryKeys } from "@/lib/query-keys";
import type { ChatMessage } from "@/lib/types/interview";
import { cn } from "@/lib/utils";

interface SessionTranscriptViewProps {
  sessionId: string;
}

export function SessionTranscriptView({ sessionId }: SessionTranscriptViewProps) {
  const transcriptQuery = useQuery({
    queryKey: queryKeys.interview.transcript(sessionId),
    queryFn: () => interviewApi.getTranscript(sessionId),
    retry: false,
  });

  const messages: ChatMessage[] =
    transcriptQuery.data?.messages.map((message, index) => ({
      id: `${sessionId}-${index}`,
      role:
        message.role === "user" || message.role === "agent" || message.role === "system"
          ? message.role
          : message.role === "assistant"
            ? "agent"
            : "system",
      content: message.content,
      stage: message.stage ?? undefined,
      timestamp: message.timestamp ?? new Date().toISOString(),
    })) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/sessions" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}>
          <ArrowLeft className="size-4" /> Sessions
        </Link>
        <Link
          href={`/sessions/${sessionId}/report`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          View report
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Interview transcript</CardTitle>
          <CardDescription>Review the complete conversation from this session.</CardDescription>
        </CardHeader>
        <CardContent>
          {transcriptQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading transcript…</p>
          ) : transcriptQuery.isFetched && transcriptQuery.data === null ? (
            <div className="space-y-3 text-center">
              <FileQuestion className="mx-auto size-10 text-muted-foreground" />
              <p className="font-medium">Transcript unavailable</p>
              <p className="text-sm text-muted-foreground">
                The transcript endpoint returned 404. This UI is wired and will show messages when
                the API is available.
              </p>
              <Link href={`/sessions/${sessionId}/report`} className={buttonVariants({ variant: "outline" })}>
                View report
              </Link>
            </div>
          ) : transcriptQuery.isError ? (
            <p className="text-sm text-destructive">
              We could not load this transcript. Please try again later.
            </p>
          ) : messages.length ? (
            <div className="space-y-3">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No messages were saved for this session.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
