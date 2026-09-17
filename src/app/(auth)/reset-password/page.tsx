import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordConfirmForm } from "@/components/auth/reset-password-confirm-form";
import { ResetPasswordRequestForm } from "@/components/auth/reset-password-request-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{token ? "Set new password" : "Reset password"}</CardTitle>
        <CardDescription>
          {token
            ? "Enter your new password below."
            : "Enter your email and we will send you a reset link."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {token ? <ResetPasswordConfirmForm token={token} /> : <ResetPasswordRequestForm />}
      </CardContent>
    </Card>
  );
}
