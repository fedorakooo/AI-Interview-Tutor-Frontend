"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InterviewInputBarProps {
  disabled?: boolean;
  onSend: (content: string) => void;
}

export function InterviewInputBar({ disabled, onSend }: InterviewInputBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your answer…"
        disabled={disabled}
        rows={2}
        className="min-h-[60px] resize-none"
      />
      <Button
        type="button"
        size="icon-lg"
        disabled={disabled || !value.trim()}
        onClick={handleSubmit}
        aria-label="Send message"
      >
        <Send />
      </Button>
    </div>
  );
}
