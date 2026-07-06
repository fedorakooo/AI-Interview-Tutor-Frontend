import { toast } from "sonner";
import { AppError } from "@/lib/api/client";

export type ApiErrorHandlerOptions = {
  onUnauthorized?: () => void;
  onBlocked?: () => void;
};

export function handleApiError(
  error: unknown,
  options?: ApiErrorHandlerOptions,
): void {
  if (error instanceof AppError) {
    if (error.status === 403 && error.message.toLowerCase().includes("blocked")) {
      toast.error("Your account has been suspended.");
      options?.onBlocked?.();
      return;
    }

    if (error.status === 401) {
      options?.onUnauthorized?.();
    }

    toast.error(error.message);
    return;
  }

  toast.error("An unexpected error occurred");
}
