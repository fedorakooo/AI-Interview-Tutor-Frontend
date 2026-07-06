import type { ChatMessage } from "@/lib/types/interview";
import { MessageBubble } from "./message-bubble";

interface ChatPanelProps {
  messages: ChatMessage[];
}

export function ChatPanel({ messages }: ChatPanelProps) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-muted/30 p-4">
      {messages.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Connecting to your interviewer…
        </p>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}
    </div>
  );
}
