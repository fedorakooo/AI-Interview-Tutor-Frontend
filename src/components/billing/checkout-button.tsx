"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { billingApi } from "@/lib/api/billing";
import { tokenStore } from "@/lib/auth/token-store";
import { env } from "@/lib/env";
import { featureFlags } from "@/lib/feature-flags";
import { AppError } from "@/lib/api/client";

type CheckoutButtonProps = {
  plan: "pro" | "team";
  label?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
};

export function CheckoutButton({
  plan,
  label = "Upgrade",
  className,
  variant = "default",
}: CheckoutButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const billingEnabled = featureFlags.billing();
  const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  async function startCheckout() {
    if (!tokenStore.getAccessToken()) {
      router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }

    setPending(true);
    setError(null);
    try {
      const data = await billingApi.createCheckoutSession(
        plan,
        `${appUrl}/dashboard?tier=${plan}`,
        `${appUrl}/pricing`,
      );
      if (!data.checkout_url) {
        setError("Checkout session did not return a redirect URL.");
        return;
      }
      window.location.assign(data.checkout_url);
    } catch (err) {
      if (err instanceof AppError) {
        setError(
          err.status >= 500 || err.status === 404
            ? "Billing is temporarily unavailable. Please try again later."
            : err.message,
        );
      } else {
        setError("Could not reach the billing service.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        className={className}
        variant={variant}
        disabled={pending}
        onClick={() => void startCheckout()}
      >
        {pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        {label}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {!billingEnabled ? (
        <p className="text-xs text-muted-foreground">
          Tip: set NEXT_PUBLIC_FEATURE_BILLING=true when the backend is ready.
        </p>
      ) : null}
    </div>
  );
}
