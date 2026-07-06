import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types/interview";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <p className="rounded-md bg-amber-100 px-3 py-1.5 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground ring-1 ring-border",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.stage && !isUser && (
          <p className="mt-1 text-xs text-muted-foreground">{message.stage}</p>
        )}
      </div>
    </div>
  );
}
