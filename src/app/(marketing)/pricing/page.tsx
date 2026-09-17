"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="bg-[#f7f3ec] py-20 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-800">Pricing</p>
          <h1 className="text-4xl font-semibold tracking-tight">Choose the prep intensity that fits</h1>
          <p className="text-slate-600">
            Start free, upgrade when you need unlimited interviews, JD matching, and team tooling.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-teal-900/10 bg-white">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For candidates exploring the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-semibold">$0</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> CV onboarding</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Limited mock interviews</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Practice starter plans</li>
              </ul>
              <Link href="/signup" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                Get started
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-400/70 bg-white shadow-md shadow-amber-200/50">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Daily prep with deeper personalization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-semibold">
                $29<span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Unlimited interviews</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> JD matcher + transcripts</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Priority plan generation</li>
              </ul>
              <CheckoutButton
                plan="pro"
                label="Checkout Pro"
                className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300"
              />
            </CardContent>
          </Card>

          <Card className="border-teal-900/10 bg-white">
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>For cohorts, bootcamps, and coaching orgs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-semibold">
                $79<span className="text-base font-normal text-muted-foreground">/seat</span>
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Shared seats</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Admin users + ops stubs</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Usage visibility</li>
              </ul>
              <CheckoutButton plan="team" label="Checkout Team" className="w-full" variant="outline" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
