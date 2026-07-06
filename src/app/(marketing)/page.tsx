import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        Practice interviews with AI-powered feedback
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Upload your CV, run realistic mock interviews, and get personalized practice
        plans to improve your skills.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
          Create free account
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}
