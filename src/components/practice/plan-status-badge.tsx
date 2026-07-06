import { Badge } from "@/components/ui/badge";
import type { PlanStatus } from "@/lib/types/practice";

const VARIANTS: Record<
  PlanStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  generating: "secondary",
  ready: "default",
  failed: "destructive",
  archived: "outline",
};

interface PlanStatusBadgeProps {
  status: PlanStatus;
}

export function PlanStatusBadge({ status }: PlanStatusBadgeProps) {
  return <Badge variant={VARIANTS[status]}>{status}</Badge>;
}
