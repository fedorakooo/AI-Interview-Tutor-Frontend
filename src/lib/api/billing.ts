import { apiRequest } from "./client";

export type SubscriptionTier = "free" | "pro" | "team";

export interface Entitlements {
  tier: SubscriptionTier;
  limits: Record<string, number>;
  usage: Record<string, number>;
}

export const billingApi = {
  getEntitlements: () => apiRequest<Entitlements>("/api/v1/billing/entitlements"),

  createCheckoutSession: (tier: "pro" | "team", successUrl: string, cancelUrl: string) =>
    apiRequest<{ checkout_url: string; session_id: string }>(
      "/api/v1/billing/checkout-session",
      {
        method: "POST",
        body: { tier, success_url: successUrl, cancel_url: cancelUrl },
      },
    ),
};
