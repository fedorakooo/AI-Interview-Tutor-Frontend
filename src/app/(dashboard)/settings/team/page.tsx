"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TeamSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team settings</h1>
        <p className="text-muted-foreground">
          Organization workspace stub — invite teammates and manage seats on the Team plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Organization
          </CardTitle>
          <CardDescription>Placeholder for org name, billing owner, and seat count.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="org-name" className="text-sm font-medium">
              Organization name
            </label>
            <Input id="org-name" placeholder="Acme Interview Prep" disabled />
          </div>
          <div className="space-y-2">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Invite teammate
            </label>
            <Input id="invite-email" type="email" placeholder="colleague@company.com" disabled />
          </div>
          <p className="text-sm text-muted-foreground">
            Team management will connect to billing entitlements and admin user provisioning.
          </p>
          <Link href="/pricing" className={cn(buttonVariants({ variant: "outline" }))}>
            View Team plan
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
