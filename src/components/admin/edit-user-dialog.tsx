"use client";

import { useEffect, useState } from "react";
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
import { queryKeys } from "@/lib/query-keys";
import type { UserResponse } from "@/lib/types/auth";
import { handleApiError } from "@/lib/utils/handle-api-error";

const editUserSchema = z.object({
  first_name: z.string().trim().min(3).max(30),
  second_name: z.string().trim().min(3).max(30),
  email: z.email(),
  phone_number: z
    .string()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine((v) => /^\+?\d{10,15}$/.test(v), "Invalid phone number"),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  user: UserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listParams: object;
}

export function EditUserDialog({ user, open, onOpenChange, listParams }: EditUserDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        second_name: user.second_name,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: EditUserFormValues) => userApi.updateUser(user!.id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users(listParams) });
      onOpenChange(false);
    },
  });

  const onSubmit = async (values: EditUserFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update profile for @{user?.username}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit_first_name">First name</Label>
              <Input id="edit_first_name" {...register("first_name")} />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_second_name">Last name</Label>
              <Input id="edit_second_name" {...register("second_name")} />
              {errors.second_name && (
                <p className="text-sm text-destructive">{errors.second_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_email">Email</Label>
            <Input id="edit_email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_phone">Phone</Label>
            <Input id="edit_phone" {...register("phone_number")} />
            {errors.phone_number && (
              <p className="text-sm text-destructive">{errors.phone_number.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
