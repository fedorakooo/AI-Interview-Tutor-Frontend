"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CvUploadZone } from "@/components/onboarding/cv-upload-zone";
import { Skeleton } from "@/components/ui/skeleton";
import { useLatestCvStatus } from "@/lib/hooks/use-cv-status";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: cvStatus, isLoading } = useLatestCvStatus();

  useEffect(() => {
    if (!isLoading && cvStatus?.status === "completed") {
      router.replace("/dashboard");
    }
  }, [cvStatus?.status, isLoading, router]);
  const initialCorrelationId =
    cvStatus?.status === "pending" ||
    cvStatus?.status === "processing" ||
    cvStatus?.status === "failed"
      ? cvStatus.correlation_id
      : null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (cvStatus?.status === "completed") {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
        <p className="text-muted-foreground">
          Upload your CV to unlock AI-powered interview practice
        </p>
      </div>

      <CvUploadZone initialCorrelationId={initialCorrelationId} />
    </div>
  );
}
