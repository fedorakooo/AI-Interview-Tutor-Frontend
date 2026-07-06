"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useCvReady } from "@/lib/hooks/use-cv-status";

export default function InterviewPage() {
  const router = useRouter();
  const { isCvReady, isLoading } = useCvReady();

  useEffect(() => {
    if (!isLoading && !isCvReady) {
      router.replace("/onboarding");
    }
  }, [isCvReady, isLoading, router]);

  if (isLoading) {
    return <Skeleton className="h-40 w-full max-w-2xl" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Interview</h1>
      <p className="text-muted-foreground">Live interview module coming in the next update.</p>
    </div>
  );
}
