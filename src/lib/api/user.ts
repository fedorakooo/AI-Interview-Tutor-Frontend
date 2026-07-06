import { apiRequest } from "./client";
import type { UserResponse, UserUpdateRequest, UsersResponse } from "@/lib/types/auth";

export const userApi = {
  getMe: () => apiRequest<UserResponse>("/api/v1/user/me/"),

  updateMe: (data: UserUpdateRequest) =>
    apiRequest<UserResponse>("/api/v1/user/me/", { method: "PATCH", body: data }),

  deleteMe: () => apiRequest<void>("/api/v1/user/me/", { method: "DELETE" }),

  getUserById: (userId: string) =>
    apiRequest<UserResponse>(`/api/v1/user/${userId}`),

  listUsers: (params: {
    page?: number;
    limit?: number;
    filter_by_name?: string;
    sort_by?: "first_name" | "second_name" | "username" | "email" | "created_at";
    order_by?: "asc" | "desc";
  }) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) qs.set(k, String(v));
    });
    return apiRequest<UsersResponse>(`/api/v1/users?${qs}`);
  },

  updateUser: (userId: string, data: UserUpdateRequest) =>
    apiRequest<UserResponse>(`/api/v1/user/${userId}`, { method: "PATCH", body: data }),
};
