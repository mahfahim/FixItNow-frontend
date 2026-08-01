// src/app/(dashboardGroup)/technician/_components/booking-status-badge.tsx
import { BookingStatus, PaymentStatus } from "@/types";

interface StatusBadgeProps {
    status: BookingStatus | PaymentStatus;
    type?: "booking" | "payment";
}

export function StatusBadge({ status, type = "booking" }: StatusBadgeProps) {
    const getBookingStatusStyle = (s: BookingStatus) => {
        switch (s) {
            case BookingStatus.REQUESTED:
                return "bg-amber-50 text-amber-700 border-amber-200";
            case BookingStatus.ACCEPTED:
                return "bg-blue-50 text-blue-700 border-blue-200";
            case BookingStatus.IN_PROGRESS:
                return "bg-purple-50 text-purple-700 border-purple-200";
            case BookingStatus.COMPLETED:
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case BookingStatus.PAID:
                return "bg-teal-50 text-teal-700 border-teal-200";
            case BookingStatus.DECLINED:
            case BookingStatus.CANCELLED:
                return "bg-rose-50 text-rose-700 border-rose-200";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    const getPaymentStatusStyle = (s: PaymentStatus) => {
        switch (s) {
            case PaymentStatus.COMPLETED:
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case PaymentStatus.PENDING:
                return "bg-amber-50 text-amber-700 border-amber-200";
            case PaymentStatus.FAILED:
            case PaymentStatus.REFUNDED:
                return "bg-rose-50 text-rose-700 border-rose-200";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    const style =
        type === "booking"
            ? getBookingStatusStyle(status as BookingStatus)
            : getPaymentStatusStyle(status as PaymentStatus);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
        >
            {status.replace("_", " ")}
        </span>
    );
}