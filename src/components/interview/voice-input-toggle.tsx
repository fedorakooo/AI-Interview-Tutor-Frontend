"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featureFlags } from "@/lib/feature-flags";

interface SpeechRecognitionEvent {
  results: { 0: { 0: { transcript: string } } };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface VoiceInputToggleProps {
  disabled?: boolean;
  language?: string;
  onTranscript: (transcript: string) => void;
}

export function VoiceInputToggle({ disabled, language = "en-US", onTranscript }: VoiceInputToggleProps) {
  const [listening, setListening] = useState(false);
  const supported = useSyncExternalStore(
    () => () => undefined,
    () => !!getSpeechRecognition(),
    () => false,
  );
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) onTranscript(transcript);
    };
    recognition.onerror = () => stopListening();
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [language, onTranscript, stopListening]);

  useEffect(() => () => stopListening(), [stopListening]);

  if (!featureFlags.voiceInterview()) return null;

  return (
    <Button
      type="button"
      variant={listening ? "default" : "outline"}
      size="icon-lg"
      disabled={disabled || !supported}
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      title={
        supported
          ? listening
            ? "Stop listening"
            : "Speak your answer"
          : "Voice input is not supported in this browser"
      }
      onClick={() => (listening ? stopListening() : startListening())}
    >
      {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
    </Button>
  );
}
