import { apiRequest } from "./client";
import type { CVStatusResponse, CVUploadAcceptedResponse } from "@/lib/types/cv";

export const cvApi = {
  upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest<CVUploadAcceptedResponse>("/api/v1/user/me/cv/", {
      method: "POST",
      body: formData,
    });
  },

  getStatus(correlationId?: string) {
    const qs = correlationId ? `?correlation_id=${correlationId}` : "";
    return apiRequest<CVStatusResponse>(`/api/v1/user/me/cv/status${qs}`);
  },
};
