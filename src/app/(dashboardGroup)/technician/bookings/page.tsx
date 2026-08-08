// src/app/(dashboardGroup)/technician/bookings/page.tsx

import Link from "next/link";
import { getTechnicianBookings } from "@/actions/booking.actions";
import { IBooking, BookingStatus, ActionResponse } from "@/types";
import { StatusBadge } from "../_components/booking-status-badge_";
import { BookingActionsClient } from "../_components/booking-actions-client_";
import { Calendar, Clock, MapPin, Eye, Search, Filter } from "lucide-react";

interface PageProps {
    searchParams: Promise<{
        status?: string;
        searchTerm?: string;
        page?: string;
    }>;
}

export default async function TechnicianBookingsPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const statusFilter = resolvedSearchParams.status as BookingStatus | undefined;
    const searchTerm = resolvedSearchParams.searchTerm || "";
    const page = Number(resolvedSearchParams.page) || 1;

    const response = (await getTechnicianBookings({
        status: statusFilter,
        searchTerm,
        page,
        limit: 10,
    })) as ActionResponse<IBooking[]>;

    console.log("Technician Bookings API Response:", JSON.stringify(response, null, 2));

    const rawData = response?.data;

    const bookings: IBooking[] = Array.isArray(rawData)
        ? rawData
        : Array.isArray((rawData as unknown as { data?: IBooking[] })?.data)
            ? (rawData as unknown as { data: IBooking[] }).data
            : [];

    const meta = response?.meta || { total: bookings.length, totalPage: 1 };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Booking Management</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        View, accept, decline and update all assigned job requests.
                    </p>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search Input Form */}
                <form className="w-full md:w-80 flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-indigo-500">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                        type="text"
                        name="searchTerm"
                        defaultValue={searchTerm}
                        placeholder="Search by customer or service..."
                        className="w-full bg-transparent focus:outline-none text-xs sm:text-sm"
                    />
                </form>

                {/* Status Filter Tabs */}
                <div className="w-full md:w-auto overflow-x-auto flex items-center gap-1 pb-1 md:pb-0 scrollbar-none">
                    <Link
                        href="/technician/bookings"
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${!statusFilter
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        All
                    </Link>
                    {Object.values(BookingStatus).map((st) => (
                        <Link
                            key={st}
                            href={`/technician/bookings?status=${st}`}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === st
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {st.replace("_", " ")}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                    <Filter className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-semibold text-slate-800">No Bookings Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        There are no booking requests matching your selected filters right now.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => {
                        const bookingId = booking.id || (booking as unknown as { _id: string })._id;

                        return (
                            <div
                                key={bookingId}
                                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                            >
                                {/* Top Row: Service & Status */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                    <div>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            ID: {bookingId}
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900">
                                            {booking.service?.title || "Requested Service"}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={booking.status} />
                                        <StatusBadge status={booking.paymentStatus} type="payment" />
                                    </div>
                                </div>

                                {/* Middle Row: Date, Customer, Address & Price */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                                    <div className="space-y-1.5">
                                        <p className="font-semibold text-slate-800">Customer Details:</p>
                                        <p className="text-slate-700 font-medium">
                                            {booking.customer?.name || "N/A"}
                                        </p>
                                        <p className="text-slate-500">{booking.customer?.email}</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <p className="font-semibold text-slate-800">Schedule & Location:</p>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>
                                                {booking.scheduledDate
                                                    ? new Date(booking.scheduledDate).toLocaleDateString()
                                                    : "N/A"}
                                            </span>
                                            <Clock className="w-3.5 h-3.5 text-indigo-600 ml-2" />
                                            <span>{booking.scheduledTime || "N/A"}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                                            <span className="line-clamp-1">{booking.address || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 md:text-right">
                                        <p className="font-semibold text-slate-800">Total Price:</p>
                                        <p className="text-lg font-bold text-indigo-600">${booking.price || 0}</p>
                                    </div>
                                </div>

                                {/* Bottom Action Bar */}
                                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                    <BookingActionsClient
                                        bookingId={bookingId}
                                        currentStatus={booking.status}
                                    />

                                    <Link
                                        href={`/technician/bookings/${bookingId}`}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}