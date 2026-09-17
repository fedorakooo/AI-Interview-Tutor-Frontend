"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import {
  resetPasswordConfirmSchema,
  type ResetPasswordConfirmValues,
} from "@/lib/validations/auth";
import { handleApiError } from "@/lib/utils/handle-api-error";

interface ResetPasswordConfirmFormProps {
  token: string;
}

export function ResetPasswordConfirmForm({ token }: ResetPasswordConfirmFormProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordConfirmValues>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const onSubmit = async (values: ResetPasswordConfirmValues) => {
    try {
      await authApi.confirmPasswordReset(token, { new_password: values.new_password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Your password has been reset. Redirecting to sign in...
        </p>
        <Link href="/login" className="text-sm text-primary underline-offset-4 hover:underline">
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new_password">New password</Label>
        <Input
          id="new_password"
          type="password"
          autoComplete="new-password"
          {...register("new_password")}
        />
        {errors.new_password && (
          <p className="text-sm text-destructive">{errors.new_password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm password</Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          {...register("confirm_password")}
        />
        {errors.confirm_password && (
          <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
