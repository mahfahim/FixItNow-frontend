// src/app/(dashboardGroup)/admin/_components/AdminBookingsTable.tsx

"use client";

import { IBooking, BookingStatus, PaymentStatus } from "@/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useToast } from "@/providers/toast-provider";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllBookingsAdmin } from "../_actions/admin.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    User,
    Wrench,
    Clock,
    Loader2,
    CalendarX,
    UserCheck,
} from "lucide-react";

interface AdminBookingsTableProps {
    bookings: IBooking[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

export default function AdminBookingsTable({
    bookings: initialBookings = [],
    meta: initialMeta = { page: 1, limit: 10, total: 0 },
}: AdminBookingsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { info, error: toastError } = useToast();

    const page = Number(searchParams.get("page")) || initialMeta.page || 1;
    const limit = Number(searchParams.get("limit")) || initialMeta.limit || 10;

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["admin-bookings", page, limit],
        queryFn: async () => {
            const res = await getAllBookingsAdmin({ page, limit });
            if (res && !res.success) {
                toastError("Error", res.message || "Failed to fetch bookings.");
            }
            return res;
        },
        initialData:
            page === initialMeta.page
                ? { success: true, data: initialBookings, meta: initialMeta }
                : undefined,
        placeholderData: keepPreviousData,
    });

    const activeBookings: IBooking[] =
        data?.data || data?.bookings || initialBookings;
    const activeMeta = data?.meta || initialMeta;
    const totalPages = Math.ceil(
        (activeMeta.total || 0) / (activeMeta.limit || 10)
    );

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
        info("Page Navigation", `Navigated to page ${newPage}`);
    };

    const badgeBaseClass = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors";

    const getBookingStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.COMPLETED:
                return (
                    <span className={`${badgeBaseClass} bg-emerald-50 text-emerald-700 border-emerald-200/70`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Completed
                    </span>
                );
            case BookingStatus.CANCELLED:
            case BookingStatus.DECLINED:
                return (
                    <span className={`${badgeBaseClass} bg-rose-50 text-rose-700 border-rose-200/70`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        {status.toLowerCase()}
                    </span>
                );
            case BookingStatus.IN_PROGRESS:
                return (
                    <span className={`${badgeBaseClass} bg-amber-50 text-amber-700 border-amber-200/70`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        In Progress
                    </span>
                );
            case BookingStatus.ACCEPTED:
                return (
                    <span className={`${badgeBaseClass} bg-blue-50 text-blue-700 border-blue-200/70`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Accepted
                    </span>
                );
            case BookingStatus.PAID:
                return (
                    <span className={`${badgeBaseClass} bg-teal-50 text-teal-700 border-teal-200/70`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        Paid
                    </span>
                );
            default:
                return (
                    <span className={`${badgeBaseClass} bg-slate-100 text-slate-700 border-slate-200`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        {status || "Requested"}
                    </span>
                );
        }
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.COMPLETED:
                return (
                    <span className={`${badgeBaseClass} bg-emerald-50 text-emerald-700 border-emerald-200/70`}>
                        Paid
                    </span>
                );
            case PaymentStatus.FAILED:
                return (
                    <span className={`${badgeBaseClass} bg-rose-50 text-rose-700 border-rose-200/70`}>
                        Failed
                    </span>
                );
            case PaymentStatus.REFUNDED:
                return (
                    <span className={`${badgeBaseClass} bg-purple-50 text-purple-700 border-purple-200/70`}>
                        Refunded
                    </span>
                );
            default:
                return (
                    <span className={`${badgeBaseClass} bg-amber-50 text-amber-700 border-amber-200/70`}>
                        Unpaid
                    </span>
                );
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Table Container */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden relative transition-all">
                {isFetching && (
                    <div className="absolute top-2.5 right-3 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/80 text-xs font-medium text-slate-600 shadow-xs z-10">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                        Updating...
                    </div>
                )}

                <Table>
                    <TableHeader className="bg-slate-50/80 border-b border-slate-200/80">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Service Info
                            </TableHead>
                            <TableHead className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Customer
                            </TableHead>
                            <TableHead className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Technician
                            </TableHead>
                            <TableHead className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Schedule
                            </TableHead>
                            <TableHead className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Amount
                            </TableHead>
                            <TableHead className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                        <span className="font-medium text-slate-600">
                                            Loading bookings...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : activeBookings.length > 0 ? (
                            activeBookings.map((booking) => (
                                <TableRow
                                    key={booking.id}
                                    className="hover:bg-slate-50/60 transition-colors border-slate-100"
                                >
                                    {/* Service Info */}
                                    <TableCell className="py-3.5 px-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                                                <Wrench className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-slate-800">
                                                    {booking.service?.title || "Unknown Service"}
                                                </div>
                                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                    ID: #{booking.id.slice(0, 8)}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Customer */}
                                    <TableCell className="py-3.5 px-4 align-middle">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm text-slate-800">
                                                    {booking.customer?.name || "N/A"}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {booking.customer?.email || ""}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Technician */}
                                    <TableCell className="py-3.5 px-4 align-middle">
                                        {booking.technician?.user?.name ? (
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <UserCheck className="h-4 w-4 text-emerald-600" />
                                                <span>{booking.technician.user.name}</span>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-normal text-slate-400 bg-slate-50 border border-slate-200/60">
                                                Unassigned
                                            </span>
                                        )}
                                    </TableCell>

                                    {/* Schedule */}
                                    <TableCell className="py-3.5 px-4 align-middle">
                                        <div className="text-slate-700 flex items-center gap-1.5 text-xs font-medium">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            {new Date(booking.scheduledDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            {booking.scheduledTime}
                                        </div>
                                    </TableCell>

                                    {/* Amount */}
                                    <TableCell className="py-3.5 px-4 align-middle text-sm font-bold text-slate-900">
                                        ৳{booking.price}
                                    </TableCell>

                                    {/* Statuses */}
                                    <TableCell className="py-3.5 px-4 align-middle">
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {getBookingStatusBadge(booking.status)}
                                            {getPaymentStatusBadge(booking.paymentStatus)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                            <CalendarX className="h-5 w-5" />
                                        </div>
                                        <p className="text-slate-700 font-semibold text-sm">No bookings found</p>
                                        <p className="text-slate-400 text-xs">There are no booking records to display.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-xs text-slate-500">
                            Showing page{" "}
                            <span className="font-semibold text-slate-800">
                                {activeMeta.page}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-800">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(activeMeta.page - 1)}
                                disabled={activeMeta.page <= 1 || isFetching}
                                className="h-8 px-3 text-xs rounded-xl bg-white text-slate-700 hover:bg-blue-50/60 hover:text-blue-600 hover:border-blue-200 border-slate-200/80 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                            >
                                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(activeMeta.page + 1)}
                                disabled={activeMeta.page >= totalPages || isFetching}
                                className="h-8 px-3 text-xs rounded-xl bg-white text-slate-700 hover:bg-blue-50/60 hover:text-blue-600 hover:border-blue-200 border-slate-200/80 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                            >
                                Next
                                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}