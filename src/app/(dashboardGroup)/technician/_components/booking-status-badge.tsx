// src/app/(dashboardGroup)/technician/_components/booking-status-badge.tsx
"use client";

import { BookingStatus, PaymentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/providers/toast-provider";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: BookingStatus | PaymentStatus;
    type?: "booking" | "payment";
    showToastOnClick?: boolean;
}

export function StatusBadge({
    status,
    type = "booking",
    showToastOnClick = true,
}: StatusBadgeProps) {
    const { info } = useToast();

    const getBookingStatusStyle = (s: BookingStatus) => {
        switch (s) {
            case BookingStatus.REQUESTED:
                return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
            case BookingStatus.ACCEPTED:
                return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
            case BookingStatus.IN_PROGRESS:
                return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
            case BookingStatus.COMPLETED:
                return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
            case BookingStatus.PAID:
                return "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100";
            case BookingStatus.DECLINED:
            case BookingStatus.CANCELLED:
                return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
        }
    };

    const getPaymentStatusStyle = (s: PaymentStatus) => {
        switch (s) {
            case PaymentStatus.COMPLETED:
                return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
            case PaymentStatus.PENDING:
                return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
            case PaymentStatus.FAILED:
            case PaymentStatus.REFUNDED:
                return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
        }
    };

    const style =
        type === "booking"
            ? getBookingStatusStyle(status as BookingStatus)
            : getPaymentStatusStyle(status as PaymentStatus);

    const formattedStatus = status.replace(/_/g, " ");

    const handleClick = () => {
        if (!showToastOnClick) return;
        info(
            `${type === "booking" ? "Booking" : "Payment"} Status`,
            `Current status: ${formattedStatus}`
        );
    };

    return (
        <Badge
            variant="outline"
            onClick={handleClick}
            className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors shadow-none cursor-pointer",
                style
            )}
        >
            {formattedStatus.toLowerCase()}
        </Badge>
    );
}