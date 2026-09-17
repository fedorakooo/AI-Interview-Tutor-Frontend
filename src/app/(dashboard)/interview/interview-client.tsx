"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, PhoneOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ChatPanel } from "@/components/interview/chat-panel";
import { EndInterviewDialog } from "@/components/interview/end-interview-dialog";
import { InterviewInputBar } from "@/components/interview/interview-input-bar";
import { StageIndicator } from "@/components/interview/stage-indicator";
import { TypingIndicator } from "@/components/interview/typing-indicator";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCvReady } from "@/lib/hooks/use-cv-status";
import { useInterviewSocket } from "@/lib/hooks/use-interview-socket";
import { featureFlags } from "@/lib/feature-flags";
import { queryKeys } from "@/lib/query-keys";
import type { InterviewMode } from "@/lib/types/interview";
import { cn } from "@/lib/utils";

const MODES: { value: InterviewMode; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "behavioral", label: "Behavioral" },
  { value: "technical", label: "Technical" },
  { value: "system_design", label: "System design" },
  { value: "coding", label: "Coding" },
];

const COMPANY_PRESETS = [
  { value: "", label: "No preset" },
  { value: "faang", label: "FAANG-style" },
  { value: "amazon", label: "Amazon (LP focus)" },
  { value: "startup", label: "Startup" },
  { value: "enterprise", label: "Enterprise" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
];

export default function InterviewPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { isCvReady, isLoading: isCvLoading } = useCvReady();
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [mode, setMode] = useState<InterviewMode>("mixed");
  const [jobDescription, setJobDescription] = useState("");
  const [companyPreset, setCompanyPreset] = useState("");
  const [language, setLanguage] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const resumeSessionId = searchParams.get("resume");

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
    sendVoiceChunk,
    endInterview,
    isConnected,
  } = useInterviewSocket();

  useEffect(() => {
    if (!isCvLoading && !isCvReady) {
      router.replace("/onboarding");
    }
  }, [isCvLoading, isCvReady, router]);

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
  const showStartOptions = status === "idle";

  function handleStart() {
    void connect({
      mode,
      jobDescription,
      companyPreset: companyPreset || undefined,
      language,
      voiceEnabled: voiceEnabled && featureFlags.voiceInterview(),
      resumeSessionId: resumeSessionId ?? undefined,
    });
  }

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
              Your live interview session has ended. If you refreshed mid-interview, resume from
              Sessions when status is suspended.
            </p>
            <Link href="/sessions" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              View session history
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {showStartOptions && (
        <Card>
          <CardHeader>
            <CardTitle>Configure your interview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose mode, company preset, and language before connecting.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeSessionId ? (
              <Alert>
                <AlertTitle>Resuming session</AlertTitle>
                <AlertDescription>
                  Continuing suspended session <code className="text-xs">{resumeSessionId}</code>.
                </AlertDescription>
              </Alert>
            ) : null}

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Interview mode</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {MODES.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="interview-mode"
                      value={value}
                      checked={mode === value}
                      onChange={() => setMode(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="company-preset" className="text-sm font-medium">
                  Company preset
                </label>
                <select
                  id="company-preset"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={companyPreset}
                  onChange={(event) => setCompanyPreset(event.target.value)}
                >
                  {COMPANY_PRESETS.map((preset) => (
                    <option key={preset.value || "none"} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="interview-language" className="text-sm font-medium">
                  Language
                </label>
                <select
                  id="interview-language"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {featureFlags.voiceInterview() ? (
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(event) => setVoiceEnabled(event.target.checked)}
                />
                Enable voice mode (mic sends voice_chunk messages)
              </label>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="job-description" className="text-sm font-medium">
                Job description <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the role requirements to focus the conversation."
                rows={5}
              />
            </div>
            <Button onClick={handleStart}>
              {resumeSessionId ? "Resume interview" : "Start interview"}
            </Button>
          </CardContent>
        </Card>
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
            voiceEnabled={voiceEnabled && featureFlags.voiceInterview()}
            voiceLanguage={language === "ru" ? "ru-RU" : "en-US"}
            onVoiceTranscript={sendVoiceChunk}
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
