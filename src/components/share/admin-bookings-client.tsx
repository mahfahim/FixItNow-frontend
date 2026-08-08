// src/components/share/admin-bookings-client.tsx
"use client";

import {
    IBooking,
    BookingStatus,
    PaymentStatus,
    IPaginationOptions,
    PaginatedActionResponse,
} from "@/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllBookingsAdmin } from "@/actions/admin.actions";
import { DataTable, Column } from "@/components/share/admin-data-table";
import { StatusBadge, BadgeVariant } from "@/components/share/admin-status-badge";
import { Calendar, User, Wrench, Clock, UserCheck, Filter } from "lucide-react";

interface AdminBookingsClientProps {
    initialBookings?: IBooking[];
    initialMeta?: IPaginationOptions;
    title?: string;
    description?: string;
}

export function AdminBookingsClient({
    initialBookings = [],
    initialMeta = { page: 1, limit: 5, total: 0 },
    title = "All Bookings",
    description = "Manage and monitor all platform service bookings.",
}: AdminBookingsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL Search Params
    const page = Number(searchParams.get("page")) || initialMeta.page || 1;
    const limit = Number(searchParams.get("limit")) || initialMeta.limit || 5;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const paymentStatus = searchParams.get("paymentStatus") || "ALL";

    // Update URL Query Params Helper
    const updateQueryParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "ALL") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearchChange = (value: string) => {
        updateQueryParams("search", value);
    };

    const handleStatusFilterChange = (val: string) => {
        updateQueryParams("status", val);
    };

    const handlePaymentStatusFilterChange = (val: string) => {
        updateQueryParams("paymentStatus", val);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // React Query for Dynamic Server Fetching
    const { data, isLoading, isFetching } = useQuery<PaginatedActionResponse<IBooking>>({
        queryKey: ["admin-bookings", page, limit, search, status, paymentStatus],
        queryFn: async () => {
            const res = (await getAllBookingsAdmin({
                page,
                limit,
                search: search || undefined,
                status: status !== "ALL" ? status : undefined,
                paymentStatus: paymentStatus !== "ALL" ? paymentStatus : undefined,
            })) as PaginatedActionResponse<IBooking>;
            return res;
        },
        initialData:
            page === initialMeta.page && !search && status === "ALL" && paymentStatus === "ALL"
                ? { success: true, data: initialBookings, meta: initialMeta }
                : undefined,
        placeholderData: keepPreviousData,
    });

    const activeBookings: IBooking[] = data?.data || data?.bookings || initialBookings;
    const activeMeta = data?.meta || initialMeta;

    const getBookingStatusVariant = (status: BookingStatus): BadgeVariant => {
        switch (status) {
            case BookingStatus.COMPLETED:
                return "emerald";
            case BookingStatus.CANCELLED:
            case BookingStatus.DECLINED:
                return "rose";
            case BookingStatus.IN_PROGRESS:
                return "amber";
            case BookingStatus.ACCEPTED:
                return "blue";
            case BookingStatus.PAID:
                return "teal";
            default:
                return "slate";
        }
    };

    const getPaymentStatusVariant = (status: PaymentStatus): BadgeVariant => {
        switch (status) {
            case PaymentStatus.COMPLETED:
                return "emerald";
            case PaymentStatus.FAILED:
                return "rose";
            case PaymentStatus.REFUNDED:
                return "purple";
            default:
                return "amber";
        }
    };

    // Table Columns
    const columns: Column<IBooking>[] = [
        {
            header: "Service Info",
            cell: (booking) => (
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
            ),
        },
        {
            header: "Customer",
            cell: (booking) => (
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
            ),
        },
        {
            header: "Technician",
            cell: (booking) =>
                booking.technician?.user?.name ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                        <span>{booking.technician.user.name}</span>
                    </div>
                ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-normal text-slate-400 bg-slate-50 border border-slate-200/60">
                        Unassigned
                    </span>
                ),
        },
        {
            header: "Schedule",
            cell: (booking) => (
                <div>
                    <div className="text-slate-700 flex items-center gap-1.5 text-xs font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {booking.scheduledTime}
                    </div>
                </div>
            ),
        },
        {
            header: "Amount",
            cell: (booking) => (
                <span className="text-sm font-bold text-slate-900">
                    ৳{booking.price}
                </span>
            ),
        },
        {
            header: "Status",
            cell: (booking) => (
                <div className="flex flex-wrap gap-1.5 items-center">
                    <StatusBadge
                        label={booking.status || "Requested"}
                        variant={getBookingStatusVariant(booking.status)}
                    />
                    <StatusBadge
                        label={booking.paymentStatus === PaymentStatus.COMPLETED ? "Paid" : "Unpaid"}
                        variant={getPaymentStatusVariant(booking.paymentStatus)}
                        showDot={false}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 w-full space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                </div>
            </div>

            {/* Table Component */}
            <DataTable
                data={activeBookings}
                columns={columns}
                keyExtractor={(booking) => booking.id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyMessage="No bookings found"
                emptyDescription="There are no booking records matching your active filters."
                searchPlaceholder="Search customer, service or ID..."
                searchQuery={search}
                onSearchChange={handleSearchChange}
                enableClientSearch={false}
                filterElement={
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />

                        {/* Booking Status Filter */}
                        <select
                            value={status}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                        >
                            <option value="ALL">All Booking Status</option>
                            <option value={BookingStatus.REQUESTED}>Requested</option>
                            <option value={BookingStatus.ACCEPTED}>Accepted</option>
                            <option value={BookingStatus.IN_PROGRESS}>In Progress</option>
                            <option value={BookingStatus.COMPLETED}>Completed</option>
                            <option value={BookingStatus.CANCELLED}>Cancelled</option>
                            <option value={BookingStatus.DECLINED}>Declined</option>
                        </select>

                        {/* Payment Status Filter */}
                        <select
                            value={paymentStatus}
                            onChange={(e) => handlePaymentStatusFilterChange(e.target.value)}
                            className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                        >
                            <option value="ALL">All Payment Status</option>
                            <option value={PaymentStatus.PENDING}>Unpaid / Pending</option>
                            <option value={PaymentStatus.COMPLETED}>Paid</option>
                            <option value={PaymentStatus.FAILED}>Failed</option>
                            <option value={PaymentStatus.REFUNDED}>Refunded</option>
                        </select>
                    </div>
                }
                pagination={{
                    page: Number(activeMeta.page || page),
                    limit: Number(activeMeta.limit || limit),
                    total: Number(activeMeta.total || 0),
                    onPageChange: handlePageChange,
                }}
            />
        </div>
    );
}