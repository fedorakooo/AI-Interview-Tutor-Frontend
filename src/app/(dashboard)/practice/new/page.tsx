import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePlanForm } from "@/components/practice/create-plan-form";
import { cn } from "@/lib/utils";

export default function NewPracticePlanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/practice"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
      >
        <ArrowLeft className="size-4" />
        Back to plans
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create practice plan</h1>
        <p className="text-muted-foreground">
          Configure a personalized set of exercises based on your goals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan settings</CardTitle>
          <CardDescription>Adjust difficulty, exercise types, and focus areas.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePlanForm />
        </CardContent>
      </Card>
    </div>
  );
}
