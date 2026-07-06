"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, PhoneOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatPanel } from "@/components/interview/chat-panel";
import { EndInterviewDialog } from "@/components/interview/end-interview-dialog";
import { InterviewInputBar } from "@/components/interview/interview-input-bar";
import { StageIndicator } from "@/components/interview/stage-indicator";
import { TypingIndicator } from "@/components/interview/typing-indicator";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCvReady } from "@/lib/hooks/use-cv-status";
import { useInterviewSocket } from "@/lib/hooks/use-interview-socket";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

export default function InterviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { isCvReady, isLoading: isCvLoading } = useCvReady();
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const hasConnected = useRef(false);

  const {
    messages,
    stage,
    status,
    error,
    report,
    sessionId,
    closeCode,
    isAgentTyping,
    connect,
    sendMessage,
    endInterview,
    isConnected,
  } = useInterviewSocket();

  useEffect(() => {
    if (!isCvLoading && !isCvReady) {
      router.replace("/onboarding");
    }
  }, [isCvLoading, isCvReady, router]);

  useEffect(() => {
    if (isCvReady && !hasConnected.current) {
      hasConnected.current = true;
      void connect();
    }
  }, [isCvReady, connect]);

  useEffect(() => {
    if (closeCode === 4001) {
      router.replace("/onboarding");
    } else if (closeCode === 1008) {
      logout();
    }
  }, [closeCode, router, logout]);

  useEffect(() => {
    if (report && sessionId) {
      queryClient.setQueryData(queryKeys.interview.report(sessionId), report);
      void queryClient.invalidateQueries({ queryKey: ["interview", "sessions"] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.practice.plans() });
      router.push(`/sessions/${sessionId}/report?from=interview`);
    }
  }, [report, sessionId, queryClient, router]);

  if (isCvLoading || !isCvReady) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  const showDisconnected = status === "disconnected" && !report;

  return (
    <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live interview</h1>
          <p className="text-sm text-muted-foreground">
            Answer naturally — the AI interviewer adapts to your responses.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEndDialogOpen(true)}
          disabled={status === "idle" || status === "connecting"}
        >
          <PhoneOff className="mr-1.5 size-4" />
          End interview
        </Button>
      </div>

      <StageIndicator stage={stage} status={status} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showDisconnected && (
        <Alert>
          <AlertTitle>Session ended</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Your live interview session has ended. If you refreshed mid-interview, the session
              cannot be resumed.
            </p>
            <Link href="/sessions" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              View session history
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            {status === "connecting"
              ? "Connecting…"
              : isConnected
                ? "Chat"
                : status === "completed"
                  ? "Interview complete"
                  : "Interview chat"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <ChatPanel messages={messages} />
          {isAgentTyping && <TypingIndicator />}
          <InterviewInputBar
            disabled={!isConnected || isAgentTyping}
            onSend={sendMessage}
          />
        </CardContent>
      </Card>

      <EndInterviewDialog
        open={endDialogOpen}
        onOpenChange={setEndDialogOpen}
        onConfirm={() => {
          endInterview();
          setEndDialogOpen(false);
        }}
      />
    </div>
  );
}
