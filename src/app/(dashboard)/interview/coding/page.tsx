"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AppError, apiRequest } from "@/lib/api/client";
import { featureFlags } from "@/lib/feature-flags";

export default function CodingInterviewPage() {
  const [code, setCode] = useState(
    `# Write your solution here\ndef solve(input: str) -> str:\n    return input\n`,
  );
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function runCode() {
    setIsRunning(true);
    setError(null);
    setOutput(null);
    try {
      const result = await apiRequest<{
        status?: string;
        stdout?: string;
        stderr?: string;
        message?: string;
      }>("/api/v1/interview/coding/run", {
        method: "POST",
        body: { language, source_code: code },
      });
      if (result.status === "unsupported") {
        setError(result.message ?? "Language is not supported by the sandbox.");
        return;
      }
      setOutput(result.stdout ?? result.message ?? "Run completed with no output.");
      if (result.stderr) setError(result.stderr);
    } catch (err) {
      if (err instanceof AppError && (err.status === 404 || err.status === 501)) {
        setError("Coding runner API is not available yet. This button is wired for the future endpoint.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to run code.");
      }
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coding interview</h1>
        <p className="text-muted-foreground">
          Monaco-like workspace stub for live coding interviews.
          {!featureFlags.codingInterview() && " Feature flag NEXT_PUBLIC_FEATURE_CODING_INTERVIEW is off."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
          <CardDescription>
            Choose a language, write a solution, then call the future coding runner API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            Language
            <select
              className="rounded-md border bg-background px-2 py-1"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </label>
          <Textarea
            aria-label="Code editor"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-h-96 resize-y bg-slate-950 font-mono text-sm text-emerald-100"
            spellCheck={false}
          />
          <Button onClick={() => void runCode()} disabled={isRunning}>
            <Play className="mr-2 size-4" />
            {isRunning ? "Running…" : "Run"}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Runner response</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {output && (
            <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">{output}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
