"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userApi } from "@/lib/api/user";
import { useAuth } from "@/lib/hooks/use-auth";
import { queryKeys } from "@/lib/query-keys";
import { handleApiError } from "@/lib/utils/handle-api-error";

const accountSchema = z.object({
  first_name: z.string().trim().min(3).max(30),
  second_name: z.string().trim().min(3).max(30),
  email: z.email(),
  phone_number: z
    .string()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine((v) => /^\+?\d{10,15}$/.test(v), "Invalid phone number"),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export function AccountTab() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    values: user
      ? {
          first_name: user.first_name,
          second_name: user.second_name,
          email: user.email,
          phone_number: user.phone_number,
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.me });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteMe,
    onSuccess: () => logout(),
  });

  const onSubmit = async (values: AccountFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
    } catch (error) {
      handleApiError(error, { onBlocked: logout });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      handleApiError(error, { onBlocked: logout });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input id="first_name" {...register("first_name")} />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="second_name">Last name</Label>
            <Input id="second_name" {...register("second_name")} />
            {errors.second_name && (
              <p className="text-sm text-destructive">{errors.second_name.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Username</Label>
          <Input value={user.username} disabled />
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={user.role} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone</Label>
          <Input id="phone_number" {...register("phone_number")} />
          {errors.phone_number && (
            <p className="text-sm text-destructive">{errors.phone_number.message}</p>
          )}
        </div>

        <Button type="submit" disabled={!isDirty || isSubmitting || updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>

      <div className="rounded-lg border border-destructive/30 p-4">
        <h3 className="font-medium text-destructive">Danger zone</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete your account and all associated data.
        </p>
        <Button
          variant="destructive"
          className="mt-3"
          onClick={() => setDeleteOpen(true)}
        >
          Delete account
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your account and all data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
