"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LocaleToggle } from "@/lib/i18n/locale-toggle";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="marketing-shell flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_45%),linear-gradient(180deg,#0b1418_0%,#102027_42%,#f4efe6_42%,#f7f3ec_100%)] text-slate-100">
      <header className="border-b border-white/10 bg-[#0b1418]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-teal-50">
            AI Interview Tutor
          </Link>
          <nav className="flex items-center gap-2">
            <LocaleToggle />
            <Link
              href="/pricing"
              className={cn(buttonVariants({ variant: "ghost" }), "hidden text-teal-50 sm:inline-flex")}
            >
              {t("nav.pricing")}
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "text-teal-50")}>
              {t("nav.signIn")}
            </Link>
            <Link href="/signup" className={cn(buttonVariants(), "bg-amber-400 text-slate-950 hover:bg-amber-300")}>
              {t("nav.getStarted")}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-300/60 bg-[#f7f3ec] text-slate-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">{t("landing.footerTagline")}</p>
          <div className="flex gap-4 text-sm">
            <Link href="/pricing" className="hover:text-teal-800">
              {t("nav.pricing")}
            </Link>
            <Link href="/login" className="hover:text-teal-800">
              {t("nav.signIn")}
            </Link>
            <Link href="/signup" className="hover:text-teal-800">
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
