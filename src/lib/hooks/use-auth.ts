"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useSyncExternalStore } from "react";
import { authApi } from "@/lib/api/auth";
import { AppError } from "@/lib/api/client";
import { userApi } from "@/lib/api/user";
import { tokenStore } from "@/lib/auth/token-store";
import { decodeAccessToken } from "@/lib/auth/jwt";
import type { UserCreateRequest } from "@/lib/types/auth";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isBlocked, setIsBlocked] = useState(false);

  const tokens = useSyncExternalStore(
    tokenStore.subscribe,
    tokenStore.getSnapshot,
    tokenStore.getServerSnapshot,
  );
  const hasToken = !!tokens.access;

  const userQuery = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        return await userApi.getMe();
      } catch (error) {
        if (error instanceof AppError && error.status === 403) {
          if (error.message.toLowerCase().includes("blocked")) {
            setIsBlocked(true);
          }
          tokenStore.clear();
        } else if (error instanceof AppError && error.status === 401) {
          tokenStore.clear();
        }
        throw error;
      }
    },
    enabled: hasToken,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: (newTokens) => {
      tokenStore.setAccessToken(newTokens.access_token);
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: UserCreateRequest) => {
      await authApi.signup(data);
      const newTokens = await authApi.login(data.username, data.password);
      return newTokens;
    },
    onSuccess: (newTokens) => {
      tokenStore.setAccessToken(newTokens.access_token);
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logout = useCallback(() => {
    void authApi.logout();
    tokenStore.clear();
    setIsBlocked(false);
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  const claims = tokens.access ? decodeAccessToken(tokens.access) : null;
  const blocked = isBlocked || claims?.is_blocked === true;

  const isAuthenticated = hasToken && !!userQuery.data;
  const isLoading =
    (hasToken && userQuery.isLoading) ||
    loginMutation.isPending ||
    signupMutation.isPending;

  return {
    user: userQuery.data,
    claims,
    isAuthenticated,
    isAdmin: claims?.role === "ADMIN" || claims?.role === "MODERATOR",
    isBlocked: blocked,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout,
    isLoading,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  };
}
