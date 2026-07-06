import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export function usePollingQuery<T>(
  options: UseQueryOptions<T> & {
    shouldStop: (data: T | undefined) => boolean;
    intervalMs?: number;
  },
) {
  const { shouldStop, intervalMs = 3000, ...queryOptions } = options;
  return useQuery({
    ...queryOptions,
    refetchInterval: (query) => (shouldStop(query.state.data) ? false : intervalMs),
  });
}
