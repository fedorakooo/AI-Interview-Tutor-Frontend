import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanFailedProps {
  errorMessage?: string | null;
  errorCode?: string | null;
}

export function PlanFailed({ errorMessage, errorCode }: PlanFailedProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Plan generation failed</AlertTitle>
        <AlertDescription>
          {errorMessage ?? "Something went wrong while generating your practice plan."}
          {errorCode && (
            <span className="mt-1 block text-xs opacity-80">Error code: {errorCode}</span>
          )}
        </AlertDescription>
      </Alert>
      <Link href="/practice/new" className={cn(buttonVariants())}>
        Try again
      </Link>
    </div>
  );
}
