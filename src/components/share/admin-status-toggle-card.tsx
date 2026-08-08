// src/components/share/status-toggle-card.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Loader2, ShieldAlert, ShieldCheck, User } from "lucide-react";

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

    // Identity Props
    imageUrl?: string | null;
    displayName?: string;
    displaySubtext?: string;
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
    className = "max-w-xl",
    imageUrl,
    displayName,
    displaySubtext,
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
        <Card className={`group bg-white shadow-sm hover:shadow-xl transition-all duration-500 border-slate-200/80 rounded-2xl overflow-hidden ${className}`}>
            <CardHeader className="border-b border-slate-100/80 pb-5 bg-linear-to-b from-slate-50/50 to-white relative overflow-hidden">
                <div className="flex items-start justify-between gap-4 relative z-10">
                    <div className="space-y-1.5">
                        <CardTitle className="text-lg font-semibold text-slate-900 tracking-tight">
                            {title}
                        </CardTitle>
                        {description && (
                            <CardDescription className="text-slate-500 text-sm max-w-[85%] leading-relaxed">
                                {description}
                            </CardDescription>
                        )}
                    </div>
                    <Badge
                        className={`transition-all duration-500 border shadow-sm px-3 py-1 animate-in fade-in zoom-in ${isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200"
                            }`}
                    >
                        {isActive ? (
                            <span className="flex items-center gap-1.5 font-medium">
                                <ShieldCheck className="h-3.5 w-3.5" /> {activeBadgeText}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 font-medium">
                                <ShieldAlert className="h-3.5 w-3.5" /> {inactiveBadgeText}
                            </span>
                        )}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Identity / Profile Display Row */}
                {(displayName || imageUrl) && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100/80 transition-colors duration-300 hover:bg-slate-50">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-200 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            {/* ✅ Replaced <img> with Next.js <Image /> */}
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={displayName || "Profile avatar"}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-slate-400 z-10" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-[15px] font-semibold text-slate-900">{displayName}</h4>
                            {displaySubtext && <p className="text-sm text-slate-500">{displaySubtext}</p>}
                        </div>
                    </div>
                )}

                {/* Status Toggle Block */}
                <div
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border transition-all duration-500 group/toggle ${isActive
                        ? 'bg-linear-to-br from-emerald-50/80 to-emerald-50/20 border-emerald-200/80 shadow-[0_2px_12px_-4px_rgba(16,185,129,0.15)] hover:border-emerald-300'
                        : 'bg-linear-to-br from-rose-50/80 to-rose-50/20 border-rose-200/80 shadow-[0_2px_12px_-4px_rgba(244,63,94,0.15)] hover:border-rose-300'
                        }`}
                >
                    <div className="space-y-1 mb-4 sm:mb-0">
                        <Label
                            htmlFor={switchId}
                            className={`text-[15px] font-semibold cursor-pointer transition-colors duration-300 ${isActive ? 'text-emerald-900' : 'text-rose-900'
                                }`}
                        >
                            {isActive ? activeLabel : inactiveLabel}
                        </Label>
                        <p className={`text-[13px] font-medium transition-colors duration-300 ${isActive ? 'text-emerald-700/80' : 'text-rose-700/80'
                            }`}>
                            {isActive ? activeSubtext : inactiveSubtext}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-full shadow-sm border border-slate-100 shrink-0">
                        {isPending && (
                            <Loader2 className={`h-4 w-4 animate-spin ml-2 ${isActive ? 'text-emerald-500' : 'text-rose-500'}`} />
                        )}
                        <Switch
                            id={switchId}
                            checked={isActive}
                            onCheckedChange={handleToggle}
                            disabled={isPending}
                            className={`cursor-pointer transition-all duration-300 ${isActive
                                ? 'data-[state=checked]:bg-emerald-500'
                                : 'data-[state=unchecked]:bg-slate-300'
                                }`}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}