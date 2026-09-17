import { apiRequest } from "./client";

export type FeatureFlagsMap = Record<string, boolean>;

export interface HealthSummary {
  queues: Record<string, { lag: number | null; note?: string }>;
  llm_spend: {
    period: string;
    estimated_usd: number | null;
    note?: string;
  };
  dlq: Record<string, { depth: number | null }>;
}

export const adminOpsApi = {
  getFeatureFlags: () => apiRequest<FeatureFlagsMap>("/api/v1/admin/ops/feature-flags"),

  getHealthSummary: () => apiRequest<HealthSummary>("/api/v1/admin/ops/health-summary"),
};
