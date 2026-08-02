// src/app/(dashboardGroup)/admin/_components/user-status-card.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserStatus } from "../_actions/admin.actions";
import { UserStatus } from "@/types";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface UserStatusCardProps {
    userId: string;
    currentStatus?: UserStatus;
}

export function UserStatusCard({ userId, currentStatus = UserStatus.ACTIVE }: UserStatusCardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    
    const [optimisticStatus, setOptimisticStatus] = useState<UserStatus>(currentStatus);

    const isActive = optimisticStatus === UserStatus.ACTIVE;

    const handleToggle = () => {
        const newStatus = isActive ? UserStatus.BLOCKED : UserStatus.ACTIVE;

        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const res = await updateUserStatus(userId, { status: newStatus });

            if (res?.success) {
                setOptimisticStatus(newStatus);
                setSuccess(`User successfully marked as ${newStatus.toLowerCase()}.`);
                router.refresh();
            } else {
                setError(res?.message || "Failed to update user status.");
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-w-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Account Status</h3>
            <p className="text-sm text-slate-500 mb-6">
                Manage this user access to the platform. Blocked users cannot log in or use services.
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {success}
                </div>
            )}

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                    <p className="text-sm font-medium text-slate-900">
                        {isActive ? "User is Active" : "User is Blocked"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        {isActive
                            ? "They have full access to their account."
                            : "Their access is currently restricted."}
                    </p>
                </div>

                <button
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? "bg-green-500" : "bg-slate-300"
                        }`}
                    role="switch"
                    aria-checked={isActive}
                >
                    <span className="sr-only">Toggle user status</span>

                    {/* Toggle Knob */}
                    <span
                        className={`pointer-events-none relative flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                    >
                        {isPending && (
                            <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}