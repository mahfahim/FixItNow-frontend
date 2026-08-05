// src/components/share/status-toggle-card.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

export interface StatusToggleCardProps {
    entityId: string;
    initialStatus: boolean;
    onUpdateStatus: (
        id: string,
        newStatus: boolean
    ) => Promise<{ success?: boolean; message?: string } | void>;
    title?: string;
    description?: string;
    activeLabel?: string;
    inactiveLabel?: string;
    activeSubtext?: string;
    inactiveSubtext?: string;
    activeBadgeText?: string;
    inactiveBadgeText?: string;
    entityName?: string;
    className?: string;
}

export function StatusToggleCard({
    entityId,
    initialStatus,
    onUpdateStatus,
    title = "Account Status",
    description = "Manage status access and visibility settings.",
    activeLabel = "Active",
    inactiveLabel = "Inactive / Blocked",
    activeSubtext = "Full access and visibility enabled.",
    inactiveSubtext = "Access or visibility is currently restricted.",
    activeBadgeText = "Active",
    inactiveBadgeText = "Blocked",
    entityName = "Item",
    className = "max-w-xl bg-white shadow-xs border-slate-200",
}: StatusToggleCardProps) {
    const router = useRouter();
    const { success, error } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isActive, setIsActive] = useState<boolean>(initialStatus);

    const switchId = `status-switch-${entityId}`;

    const handleToggle = (checked: boolean) => {
        startTransition(async () => {
            try {
                const res = await onUpdateStatus(entityId, checked);

                if (!res || res.success) {
                    setIsActive(checked);
                    success(
                        "Status Updated",
                        res?.message || `${entityName} status marked as ${checked ? "active" : "inactive"}.`
                    );
                    router.refresh();
                } else {
                    error("Update Failed", res?.message || `Failed to update ${entityName.toLowerCase()} status.`);
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
                error("Update Error", errorMessage);
            }
        });
    };

    return (
        <Card className={className}>
            <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                        {title}
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
                                <ShieldCheck className="h-3.5 w-3.5" /> {activeBadgeText}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <ShieldAlert className="h-3.5 w-3.5" /> {inactiveBadgeText}
                            </span>
                        )}
                    </Badge>
                </div>
                {description && (
                    <CardDescription className="text-slate-500 text-sm">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="space-y-0.5">
                        <Label
                            htmlFor={switchId}
                            className="text-sm font-medium text-slate-900 cursor-pointer"
                        >
                            {isActive ? activeLabel : inactiveLabel}
                        </Label>
                        <p className="text-xs text-slate-500">
                            {isActive ? activeSubtext : inactiveSubtext}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isPending && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
                        <Switch
                            id={switchId}
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