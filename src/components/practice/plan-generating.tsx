import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanGeneratingProps {
  message?: string;
}

export function PlanGenerating({ message }: PlanGeneratingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="size-5 animate-spin" />
          Generating your plan
        </CardTitle>
        <CardDescription>
          {message ?? "Our AI is building personalized exercises based on your profile."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This usually takes 30–90 seconds. The page will update automatically.
        </p>
      </CardContent>
    </Card>
  );
}
