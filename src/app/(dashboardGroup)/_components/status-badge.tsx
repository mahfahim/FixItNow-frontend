// src/app/(dashboardGroup)/_components/status-badge.tsx
import React from "react";

export type StatusType =
    | "PENDING"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "REJECTED"
    | string;

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

const statusConfig: Record<string, { label: string; style: string }> = {
    PENDING: {
        label: "Pending",
        style: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400",
    },
    ACCEPTED: {
        label: "Accepted",
        style: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400",
    },
    IN_PROGRESS: {
        label: "In Progress",
        style: "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
    COMPLETED: {
        label: "Completed",
        style: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    CANCELLED: {
        label: "Cancelled",
        style: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400",
    },
    REJECTED: {
        label: "Rejected",
        style: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
    },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
    const normalizedStatus = status?.toUpperCase() || "PENDING";
    const config = statusConfig[normalizedStatus] || {
        label: status,
        style: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.style} ${className}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {config.label}
        </span>
    );
};