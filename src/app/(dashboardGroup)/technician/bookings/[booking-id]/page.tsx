// src/app/(dashboardGroup)/technician/bookings/[booking-id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechnicianBookingById } from "@/actions/booking.actions";
import { IBooking } from "@/types";
import { StatusBadge } from "../../_components/booking-status-badge_";
import { BookingActionsClient } from "../../_components/booking-actions-client_";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    FileText,
    History,
} from "lucide-react";

interface PageProps {
    params: Promise<{
        "booking-id": string;
    }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const bookingId = resolvedParams["booking-id"];

    const res = await getTechnicianBookingById(bookingId);
    const booking: IBooking | null = res?.data || null;

    if (!booking) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/technician/bookings"
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Bookings
                </Link>
                <div className="flex items-center gap-2">
                    <StatusBadge status={booking.status} />
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                </div>
            </div>

            {/* Main Content Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                        <span className="text-xs font-mono text-slate-400">Booking ID: {booking.id}</span>
                        <h1 className="text-2xl font-bold text-slate-900 mt-1">
                            {booking.service?.title || "Service Details"}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Category: {booking.service?.category?.name || "General"}
                        </p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-right shrink-0">
                        <span className="text-xs text-indigo-600 font-medium">Service Fee</span>
                        <p className="text-2xl font-bold text-indigo-700">${booking.price}</p>
                    </div>
                </div>

                {/* Quick Action Bar inside detail */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-slate-800">Available Status Actions</p>
                        <p className="text-[11px] text-slate-500">
                            Update booking progress to keep customer notified.
                        </p>
                    </div>
                    <BookingActionsClient bookingId={booking.id} currentStatus={booking.status} />
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <User className="w-4 h-4 text-indigo-600" />
                            Customer Information
                        </div>
                        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
                            <p className="font-semibold text-slate-800">{booking.customer?.name || "N/A"}</p>
                            <p className="text-slate-600">Email: {booking.customer?.email || "N/A"}</p>
                        </div>
                    </div>

                    {/* Schedule & Location */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            Schedule & Location
                        </div>
                        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>
                                    {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                                </span>
                            </div>
                            <div className="flex items-start gap-2 text-slate-700">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span>{booking.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Notes */}
                {booking.notes && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            Customer Instructions / Notes
                        </div>
                        <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-900">
                            {booking.notes}
                        </div>
                    </div>
                )}

                {/* Status History Timeline */}
                {booking.statusHistory && booking.statusHistory.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <History className="w-4 h-4 text-indigo-600" />
                            Status Audit History
                        </div>
                        <div className="space-y-3">
                            {booking.statusHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100"
                                >
                                    <StatusBadge status={item.status} />
                                    <div className="space-y-0.5">
                                        <p className="text-slate-700 font-medium">{item.note || "Status updated"}</p>
                                        <p className="text-[10px] text-slate-400">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}