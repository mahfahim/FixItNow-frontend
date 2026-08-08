"use client";

import React from "react";

export type BadgeVariant =
    | "emerald"
    | "rose"
    | "amber"
    | "blue"
    | "teal"
    | "purple"
    | "slate";

interface StatusBadgeProps {
    label: string;
    variant?: BadgeVariant;
    showDot?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot?: string }> = {
    emerald: {
        container: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
        dot: "bg-emerald-500",
    },
    rose: {
        container: "bg-rose-50 text-rose-700 border-rose-200/70",
        dot: "bg-rose-500",
    },
    amber: {
        container: "bg-amber-50 text-amber-700 border-amber-200/70",
        dot: "bg-amber-500",
    },
    blue: {
        container: "bg-blue-50 text-blue-700 border-blue-200/70",
        dot: "bg-blue-500",
    },
    teal: {
        container: "bg-teal-50 text-teal-700 border-teal-200/70",
        dot: "bg-teal-500",
    },
    purple: {
        container: "bg-purple-50 text-purple-700 border-purple-200/70",
        dot: "bg-purple-500",
    },
    slate: {
        container: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
    },
};

export function StatusBadge({
    label,
    variant = "slate",
    showDot = true,
}: StatusBadgeProps) {
    const style = variantStyles[variant] || variantStyles.slate;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${style.container}`}
        >
            {showDot && <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />}
            <span className="capitalize">{label}</span>
        </span>
    );
}