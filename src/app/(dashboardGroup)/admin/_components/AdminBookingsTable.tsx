// src/app/(dashboardGroup)/admin/_components/AdminBookingsTable.tsx

"use client";

import { IBooking, BookingStatus, PaymentStatus } from "@/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface AdminBookingsTableProps {
    bookings: IBooking[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

export default function AdminBookingsTable({ bookings, meta }: AdminBookingsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil((meta.total || 0) / (meta.limit || 10));

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    
    const getBookingStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.COMPLETED:
                return "bg-green-100 text-green-800";
            case BookingStatus.CANCELLED:
            case BookingStatus.DECLINED:
                return "bg-red-100 text-red-800";
            case BookingStatus.IN_PROGRESS:
                return "bg-orange-100 text-orange-800";
            case BookingStatus.ACCEPTED:
                return "bg-blue-100 text-blue-800";
            case BookingStatus.PAID:
                return "bg-emerald-100 text-emerald-800";
            default:
                return "bg-gray-100 text-gray-800"; // REQUESTED
        }
    };

    const getPaymentStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.COMPLETED:
                return "bg-green-100 text-green-800";
            case PaymentStatus.FAILED:
                return "bg-red-100 text-red-800";
            case PaymentStatus.REFUNDED:
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-yellow-100 text-yellow-800"; // PENDING
        }
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Service Info</th>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Technician</th>
                            <th className="px-6 py-4 font-semibold">Schedule</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                                    {/* Service Info */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {booking.service?.title || "Unknown Service"}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate w-32">
                                            ID: {booking.id.slice(0, 8)}...
                                        </div>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">
                                            {booking.customer?.name || "N/A"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {booking.customer?.email || ""}
                                        </div>
                                    </td>

                                    {/* Technician */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">
                                            {booking.technician?.user?.name || "Unassigned"}
                                        </div>
                                    </td>

                                    {/* Schedule */}
                                    <td className="px-6 py-4">
                                        <div className="text-gray-800">
                                            {new Date(booking.scheduledDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {booking.scheduledTime}
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        ৳{booking.price}
                                    </td>

                                    {/* Statuses */}
                                    <td className="px-6 py-4 space-y-2">
                                        <div>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                                    booking.paymentStatus
                                                )}`}
                                            >
                                                {booking.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                    <span className="text-sm text-gray-500">
                        Showing page {meta.page} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(meta.page - 1)}
                            disabled={meta.page <= 1}
                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(meta.page + 1)}
                            disabled={meta.page >= totalPages}
                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}