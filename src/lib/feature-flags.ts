const truthy = new Set(["1", "true", "yes", "on"]);

/**
 * Feature flags from NEXT_PUBLIC_FEATURE_* env vars.
 * Values are referenced statically so Next can inline them at build time.
 */
const FLAG_VALUES = {
  CODING_INTERVIEW: process.env.NEXT_PUBLIC_FEATURE_CODING_INTERVIEW,
  JD_MATCH: process.env.NEXT_PUBLIC_FEATURE_JD_MATCH,
  JD_MATCHER: process.env.NEXT_PUBLIC_FEATURE_JD_MATCHER,
  BILLING: process.env.NEXT_PUBLIC_FEATURE_BILLING,
  ADMIN_OPS: process.env.NEXT_PUBLIC_FEATURE_ADMIN_OPS,
  VOICE_INTERVIEW: process.env.NEXT_PUBLIC_FEATURE_VOICE_INTERVIEW,
} as const;

export type FeatureFlagName = keyof typeof FLAG_VALUES;

export function isFeatureEnabled(name: FeatureFlagName | string): boolean {
  const key = name
    .replace(/^NEXT_PUBLIC_FEATURE_/, "")
    .toUpperCase() as FeatureFlagName;
  return truthy.has((FLAG_VALUES[key] ?? "").toLowerCase());
}

/** @deprecated Prefer isFeatureEnabled */
export function featureEnabled(name: string): boolean {
  return isFeatureEnabled(name);
}

export const featureFlags = {
  codingInterview: () => isFeatureEnabled("CODING_INTERVIEW"),
  jdMatch: () => isFeatureEnabled("JD_MATCH") || isFeatureEnabled("JD_MATCHER"),
  billing: () => isFeatureEnabled("BILLING"),
  adminOps: () => isFeatureEnabled("ADMIN_OPS"),
  voiceInterview: () => isFeatureEnabled("VOICE_INTERVIEW"),
};

export const features = {
  get codingInterview() {
    return featureFlags.codingInterview();
  },
  get jdMatcher() {
    return featureFlags.jdMatch();
  },
  get billing() {
    return featureFlags.billing();
  },
  get adminOps() {
    return featureFlags.adminOps();
  },
  get voiceInterview() {
    return featureFlags.voiceInterview();
  },
};
