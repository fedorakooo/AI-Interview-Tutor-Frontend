"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;

    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setPending(false);
    setEmail("");
    setReferral("");
    toast.success("You're on the waitlist — we'll reach out soon.");
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          type="email"
          required
          placeholder="Work email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="bg-white"
        />
        <Input
          placeholder="Referral code (optional)"
          value={referral}
          onChange={(event) => setReferral(event.target.value)}
          className="bg-white"
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-amber-400 text-slate-950 hover:bg-amber-300"
      >
        {pending ? "Joining…" : "Join waitlist"}
      </Button>
      <p className="text-xs text-slate-500">
        Stub form for early access and referral tracking — wire to CRM when ready.
      </p>
    </form>
  );
}
