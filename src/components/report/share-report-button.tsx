"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

interface ShareReportButtonProps {
  sessionId: string;
}

export function ShareReportButton({ sessionId }: ShareReportButtonProps) {
  const [pending, setPending] = useState(false);
  const shareUrl = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/sessions/${sessionId}/report`;

  async function handleShare() {
    setPending(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Interview report",
          text: "My AI Interview Tutor session report",
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Report link copied to clipboard");
    } catch {
      toast.error("Could not share the report link");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" disabled={pending} onClick={() => void handleShare()}>
      <Share2 className="mr-2 size-4" />
      Share report
    </Button>
  );
}
