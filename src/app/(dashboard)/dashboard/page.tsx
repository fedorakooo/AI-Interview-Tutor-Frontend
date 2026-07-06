"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to AI Interview Tutor</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Hello, {user?.first_name ?? "there"}!
          </CardTitle>
          <CardDescription>
            Complete onboarding by uploading your CV to unlock interview practice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">@{user?.username}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
