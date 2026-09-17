"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={className ?? "flex gap-0.5"}>
      {(["en", "ru"] as Locale[]).map((code) => (
        <Button
          key={code}
          size="xs"
          variant={locale === code ? "secondary" : "ghost"}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
