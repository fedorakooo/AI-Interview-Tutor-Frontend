"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, Coins, Flag, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminOpsApi } from "@/lib/api/admin-ops";
import { featureFlags } from "@/lib/feature-flags";
import { queryKeys } from "@/lib/query-keys";

export default function AdminOpsPage() {
  const opsEnabled = featureFlags.adminOps();

  const flagsQuery = useQuery({
    queryKey: queryKeys.admin.opsFlags,
    queryFn: () => adminOpsApi.getFeatureFlags(),
    enabled: opsEnabled,
    retry: false,
  });

  const healthQuery = useQuery({
    queryKey: queryKeys.admin.opsHealth,
    queryFn: () => adminOpsApi.getHealthSummary(),
    enabled: opsEnabled,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
        <p className="text-muted-foreground">
          Admin visibility into feature flags, queues, DLQ depth, and LLM spend.
        </p>
      </div>

      {!opsEnabled ? (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-amber-600" />
              Admin ops disabled
            </CardTitle>
            <CardDescription>
              Set NEXT_PUBLIC_FEATURE_ADMIN_OPS=true to load live ops endpoints.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flag className="size-4" />
              Feature flags
            </CardTitle>
            <CardDescription>GET /api/v1/admin/ops/feature-flags</CardDescription>
          </CardHeader>
          <CardContent>
            {flagsQuery.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : flagsQuery.isError ? (
              <p className="text-sm text-destructive">Could not load feature flags.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {Object.entries(flagsQuery.data ?? {}).map(([name, enabled]) => (
                  <li key={name} className="flex items-center justify-between gap-2">
                    <span>{name}</span>
                    <Badge variant={enabled ? "default" : "secondary"}>
                      {enabled ? "on" : "off"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4" />
              Health summary
            </CardTitle>
            <CardDescription>GET /api/v1/admin/ops/health-summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {healthQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : healthQuery.isError ? (
              <p className="text-destructive">Could not load health summary.</p>
            ) : healthQuery.data ? (
              <>
                <div>
                  <p className="mb-2 flex items-center gap-2 font-medium">
                    <Inbox className="size-4" /> Queues
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {Object.entries(healthQuery.data.queues).map(([name, info]) => (
                      <li key={name}>
                        {name}: lag {info.lag ?? "n/a"}
                        {info.note ? ` — ${info.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 font-medium">
                    <Coins className="size-4" /> LLM spend
                  </p>
                  <p className="text-muted-foreground">
                    {healthQuery.data.llm_spend.period}: $
                    {healthQuery.data.llm_spend.estimated_usd ?? "n/a"}
                    {healthQuery.data.llm_spend.note ? ` — ${healthQuery.data.llm_spend.note}` : ""}
                  </p>
                </div>
                <div>
                  <p className="mb-2 font-medium">Dead-letter queues</p>
                  <ul className="space-y-1 text-muted-foreground">
                    {Object.entries(healthQuery.data.dlq).map(([name, info]) => (
                      <li key={name}>
                        {name}: depth {info.depth ?? "n/a"}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
