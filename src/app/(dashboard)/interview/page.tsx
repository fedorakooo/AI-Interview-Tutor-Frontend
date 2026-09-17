import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import InterviewPageClient from "./interview-client";

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      }
    >
      <InterviewPageClient />
    </Suspense>
  );
}
