import { cn } from "@/lib/utils";

const STAGES = [
  { key: "Greeting", label: "Introduction", step: 1 },
  { key: "Soft Questions", label: "Warm-up questions", step: 2 },
  { key: "Hard Questions", label: "Technical deep-dive", step: 3 },
  { key: "Wrap Up", label: "Closing", step: 4 },
] as const;

interface StageIndicatorProps {
  stage: string | null;
  status: "idle" | "connecting" | "connected" | "completed" | "error" | "disconnected";
}

export function StageIndicator({ stage, status }: StageIndicatorProps) {
  const isDone = status === "completed" || stage === "Completed";
  const currentIndex = isDone
    ? STAGES.length
    : STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Interview progress</span>
        {isDone ? (
          <span className="text-muted-foreground">Interview finished</span>
        ) : currentIndex >= 0 ? (
          <span className="text-muted-foreground">
            Step {STAGES[currentIndex]?.step ?? 0} of {STAGES.length}
          </span>
        ) : (
          <span className="text-muted-foreground">Waiting to start…</span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {STAGES.map((s, index) => {
          const isActive = !isDone && index === currentIndex;
          const isComplete = isDone || index < currentIndex;

          return (
            <div key={s.key} className="space-y-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  isComplete && "bg-primary",
                  isActive && "bg-primary/60",
                  !isComplete && !isActive && "bg-muted",
                )}
              />
              <p
                className={cn(
                  "text-xs",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
