"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { cvApi } from "@/lib/api/cv";
import { AppError } from "@/lib/api/client";
import { usePollingQuery } from "@/lib/hooks/use-polling-query";
import { queryKeys } from "@/lib/query-keys";
import type { CVUploadStatus } from "@/lib/types/cv";

const TERMINAL_STATUSES: CVUploadStatus[] = ["completed", "failed"];

export function useCvStatus(correlationId: string | null | undefined) {
  const queryClient = useQueryClient();

  const query = usePollingQuery({
    queryKey: queryKeys.cv.status(correlationId ?? undefined),
    queryFn: () => cvApi.getStatus(correlationId ?? undefined),
    enabled: !!correlationId,
    shouldStop: (data) => !!data?.status && TERMINAL_STATUSES.includes(data.status),
    intervalMs: 3000,
  });

  useEffect(() => {
    if (query.data?.status === "completed") {
      void queryClient.invalidateQueries({ queryKey: ["cv", "status"] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.practice.profile });
    }
  }, [query.data?.status, queryClient]);

  return query;
}

export function useLatestCvStatus(enabled = true) {
  return usePollingQuery({
    queryKey: queryKeys.cv.status(),
    queryFn: async () => {
      try {
        return await cvApi.getStatus();
      } catch (error) {
        if (error instanceof AppError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled,
    shouldStop: (data) => {
      if (data == null) return true;
      return TERMINAL_STATUSES.includes(data.status);
    },
    intervalMs: 3000,
  });
}

export function useCvReady() {
  const { data, isLoading, isError } = useLatestCvStatus();
  return {
    isCvReady: data?.status === "completed",
    cvStatus: data,
    isLoading,
    isError,
  };
}
