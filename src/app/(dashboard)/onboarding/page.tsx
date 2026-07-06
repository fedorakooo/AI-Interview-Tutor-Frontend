import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
        <p className="text-muted-foreground">
          Upload your CV to get started with AI-powered interviews
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CV upload</CardTitle>
          <CardDescription>
            CV upload and analysis will be available in Phase 2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You are authenticated and ready for the next implementation phase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
