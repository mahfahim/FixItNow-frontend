// src/app/(dashboardGroup)/admin/_components/user-status-card.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserStatus } from "../_actions/admin.actions";
import { UserStatus } from "@/types";
import { useToast } from "@/providers/toast-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

interface UserStatusCardProps {
  userId: string;
  currentStatus?: UserStatus;
}

export function UserStatusCard({
  userId,
  currentStatus = UserStatus.ACTIVE,
}: UserStatusCardProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isPending, startTransition] = useTransition();

  const [optimisticStatus, setOptimisticStatus] = useState<UserStatus>(currentStatus);

  const isActive = optimisticStatus === UserStatus.ACTIVE;

  const handleToggle = (checked: boolean) => {
    const newStatus = checked ? UserStatus.ACTIVE : UserStatus.BLOCKED;

    startTransition(async () => {
      const res = await updateUserStatus(userId, { status: newStatus });

      if (res?.success) {
        setOptimisticStatus(newStatus);
        success(
          "Status Updated",
          `User successfully marked as ${newStatus.toLowerCase()}.`
        );
        router.refresh();
      } else {
        error("Update Failed", res?.message || "Failed to update user status.");
      }
    });
  };

  return (
    <Card className="max-w-xl bg-white shadow-xs border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Account Status
          </CardTitle>
          <Badge
            className={
              isActive
                ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200"
                : "bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border-rose-200"
            }
          >
            {isActive ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Active
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> Blocked
              </span>
            )}
          </Badge>
        </div>
        <CardDescription className="text-slate-500 text-sm">
          Manage this user&apos;s access to the platform. Blocked users cannot log in or use services.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="space-y-0.5">
            <Label
              htmlFor="user-status-switch"
              className="text-sm font-medium text-slate-900 cursor-pointer"
            >
              {isActive ? "User is Active" : "User is Blocked"}
            </Label>
            <p className="text-xs text-slate-500">
              {isActive
                ? "They have full access to their account."
                : "Their access is currently restricted."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
            <Switch
              id="user-status-switch"
              checked={isActive}
              onCheckedChange={handleToggle}
              disabled={isPending}
              className="cursor-pointer"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}