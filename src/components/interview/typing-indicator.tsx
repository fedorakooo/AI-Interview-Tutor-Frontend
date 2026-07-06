export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground">
      <span>Interviewer is typing</span>
      <span className="inline-flex gap-0.5">
        <span className="animate-bounce [animation-delay:0ms]">.</span>
        <span className="animate-bounce [animation-delay:150ms]">.</span>
        <span className="animate-bounce [animation-delay:300ms]">.</span>
      </span>
    </div>
  );
}
