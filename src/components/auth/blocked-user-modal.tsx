"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BlockedUserModalProps {
  open: boolean;
  onLogout: () => void;
}

export function BlockedUserModal({ open, onLogout }: BlockedUserModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Account suspended</DialogTitle>
          <DialogDescription>
            Your account has been blocked and you cannot access the platform. Please contact
            support if you believe this is a mistake.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onLogout}>Sign out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
