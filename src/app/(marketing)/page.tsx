"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles, Target, Workflow } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Target,
    title: "CV-aware interviews",
    body: "Sessions adapt to your experience, stack, and gaps instead of generic scripts.",
  },
  {
    icon: Workflow,
    title: "Practice that closes gaps",
    body: "Weaknesses become streak-friendly plans with MCQs, scenarios, and open questions.",
  },
  {
    icon: Sparkles,
    title: "Reports you can act on",
    body: "Skill scores, strengths, and recommendations after every completed interview.",
  },
] as const;

const FAQ = [
  {
    q: "Do I need a CV to start?",
    a: "Yes for live interviews and JD matching. Upload once during onboarding and we reuse the analysis.",
  },
  {
    q: "What interview modes are supported?",
    a: "Behavioral, technical, system design, and mixed. Coding interview UI is available as a preview.",
  },
  {
    q: "Can teams collaborate?",
    a: "Team plan unlocks shared seats and admin tooling. Checkout is handled via Stripe when billing is enabled.",
  },
] as const;

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 pb-24 pt-16 text-teal-50 md:pt-24">
        <div className="marketing-orb pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="marketing-orb-delayed pointer-events-none absolute left-10 top-40 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl" />
        <p className="rounded-full border border-teal-200/30 bg-teal-950/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-teal-100">
          AI Interview Tutor
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {t("landing.heroTitle")}
        </h1>
        <p className="max-w-2xl text-lg text-teal-100/80">{t("landing.heroSubtitle")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "bg-amber-400 text-slate-950 hover:bg-amber-300")}
          >
            {t("landing.ctaPrimary")}
          </Link>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-teal-200/40 bg-transparent text-teal-50 hover:bg-teal-900/40",
            )}
          >
            {t("landing.ctaSecondary")}
          </Link>
        </div>
      </section>

      <section className="bg-[#f7f3ec] py-20 text-slate-900">
        <div className="mx-auto max-w-6xl space-y-10 px-4">
          <h2 className="text-3xl font-semibold tracking-tight">{t("landing.howTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [t("landing.step1Title"), t("landing.step1Body")],
              [t("landing.step2Title"), t("landing.step2Body")],
              [t("landing.step3Title"), t("landing.step3Body")],
            ].map(([title, body], index) => (
              <Card
                key={title}
                className="marketing-card border-teal-900/10 bg-white/80 shadow-sm"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    <span className="mr-2 inline-flex size-7 items-center justify-center rounded-full bg-teal-900 text-sm text-amber-200">
                      {index + 1}
                    </span>
                    {title}
                  </CardTitle>
                  <CardDescription className="text-slate-600">{body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4efe6] py-20 text-slate-900">
        <div className="mx-auto max-w-6xl space-y-10 px-4">
          <h2 className="text-3xl font-semibold tracking-tight">{t("landing.featuresTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-teal-900/10 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="size-5 text-teal-800" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">{feature.body}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] py-20 text-slate-900">
        <div className="mx-auto max-w-6xl space-y-10 px-4">
          <h2 className="text-3xl font-semibold tracking-tight">{t("landing.pricingTitle")}</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-teal-900/10">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Core interview loop for individuals getting started.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-3xl font-semibold">$0</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> CV upload + analysis</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Limited live interviews</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Basic practice plans</li>
                </ul>
                <Link href="/signup" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                  Create account
                </Link>
              </CardContent>
            </Card>

            <Card className="border-amber-400/60 shadow-md shadow-amber-200/40">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Unlimited focused prep with JD matching and deeper reports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-3xl font-semibold">
                  $29<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Unlimited interviews</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> JD matcher</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Priority practice generation</li>
                </ul>
                <CheckoutButton plan="pro" label="Upgrade to Pro" className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300" />
              </CardContent>
            </Card>

            <Card className="border-teal-900/10">
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>Shared seats, admin ops, and coaching workflows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-3xl font-semibold">
                  $79<span className="text-base font-normal text-muted-foreground">/seat</span>
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Everything in Pro</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Admin users + ops views</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-teal-700" /> Shared reporting</li>
                </ul>
                <CheckoutButton plan="team" label="Start Team plan" className="w-full" variant="outline" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-[#102027] py-20 text-teal-50">
        <div className="mx-auto max-w-3xl space-y-6 px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Join the waitlist</h2>
          <p className="text-teal-100/80">
            Early access, referral codes, and team onboarding — leave your email and we&apos;ll reach out.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <section className="bg-[#f4efe6] py-20 text-slate-900">
        <div className="mx-auto max-w-6xl space-y-8 px-4">
          <h2 className="text-3xl font-semibold tracking-tight">{t("landing.faqTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {FAQ.map((item) => (
              <Card key={item.q} className="border-teal-900/10 bg-white">
                <CardHeader>
                  <CardTitle className="text-base">{item.q}</CardTitle>
                  <CardDescription className="text-slate-600">{item.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
