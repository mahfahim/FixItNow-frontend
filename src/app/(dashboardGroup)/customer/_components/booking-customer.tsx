"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { IBooking, BookingStatus, PaymentStatus } from "@/types";
import { cancelCustomerBooking } from "../_actions/booking.actions";
import { createPaymentIntent } from "@/app/(payment)/_actions/payment.actions";
import { cancelBookingSchema } from "../_schema/booking.schema";
import CreateReviewModal from "../_components/CreateReviewModal";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Wrench,
    CreditCard,
    AlertCircle,
    XCircle,
    Loader2,
    CheckCircle2,
    Info,
    Search,
    ExternalLink,
    Star,
} from "lucide-react";

interface BookingCustomerViewProps {
    bookings: IBooking[];
    currentStatus?: string;
}

export function BookingCustomerCard({
    booking,
    onCancelSuccess,
}: {
    booking: IBooking;
    onCancelSuccess?: (id: string) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [isPaying, setIsPaying] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // রিভিউ দেওয়া আছে কিনা তা চেক করে লোকাল স্টেট সেট করা
    const [isReviewed, setIsReviewed] = useState<boolean>(
        Boolean(booking.review && (typeof booking.review === "object" ? Object.keys(booking.review).length > 0 : true))
    );

    const [reason, setReason] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const bookingId = booking.id || (booking as unknown as { _id?: string })._id;
    const serviceTitle = booking.service?.title || "Requested Service";
    const techName = booking.technician?.user?.name || "Assigned Technician";
    const techPhone = booking.technician?.phone;

    const formattedDate = booking.scheduledDate
        ? new Date(booking.scheduledDate).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "N/A";

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.REQUESTED:
                return { label: "Requested", bg: "bg-amber-50 text-amber-700 border-amber-200" };
            case BookingStatus.ACCEPTED:
                return { label: "Accepted", bg: "bg-blue-50 text-blue-700 border-blue-200" };
            case BookingStatus.IN_PROGRESS:
                return { label: "In Progress", bg: "bg-purple-50 text-purple-700 border-purple-200" };
            case BookingStatus.COMPLETED:
                return { label: "Completed", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
            case BookingStatus.DECLINED:
                return { label: "Declined", bg: "bg-rose-50 text-rose-700 border-rose-200" };
            case BookingStatus.CANCELLED:
                return { label: "Cancelled", bg: "bg-slate-100 text-slate-600 border-slate-200" };
            default:
                return { label: status, bg: "bg-slate-50 text-slate-700 border-slate-200" };
        }
    };

    const statusInfo = getStatusBadge(booking.status);

    const handlePayNow = async () => {
        if (!bookingId) return;
        setIsPaying(true);
        setErrorMsg("");

        try {
            const res = await createPaymentIntent({
                bookingId,
                provider: "STRIPE",
            });

            const gatewayUrl = res?.data?.gatewayUrl || res?.gatewayUrl || res?.data?.url;

            if (res?.success && gatewayUrl) {
                window.location.href = gatewayUrl;
            } else {
                setErrorMsg(res?.message || "Failed to initialize payment gateway.");
                setIsPaying(false);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("An unexpected error occurred during payment.");
            setIsPaying(false);
        }
    };

    const handleCancelSubmit = () => {
        if (!bookingId) return;

        const validation = cancelBookingSchema.safeParse({ cancellationReason: reason });

        if (!validation.success) {
            const firstError = validation.error.issues[0]?.message || "Invalid cancellation reason.";
            setErrorMsg(firstError);
            return;
        }

        setErrorMsg("");
        startTransition(async () => {
            const res = await cancelCustomerBooking(bookingId, validation.data.cancellationReason);
            if (res.success) {
                setShowCancelModal(false);
                setReason("");
                if (onCancelSuccess) onCancelSuccess(bookingId);
            } else {
                setErrorMsg(res.error || res.message || "Failed to cancel booking.");
            }
        });
    };

    const canBeCancelled =
        booking.status === BookingStatus.REQUESTED ||
        booking.status === BookingStatus.ACCEPTED;

    const canPayNow =
        (booking.status === BookingStatus.ACCEPTED || booking.status === BookingStatus.REQUESTED) &&
        booking.paymentStatus !== PaymentStatus.COMPLETED;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-base line-clamp-1">{serviceTitle}</h3>
                            <p className="text-xs text-slate-400 font-mono">ID: {bookingId?.slice(-8)}</p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusInfo.bg}`}>
                        {statusInfo.label}
                    </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{booking.scheduledTime || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">
                            <strong>Technician:</strong> {techName} {techPhone ? `(${techPhone})` : ""}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">
                            <strong>Address:</strong> {booking.address}
                        </span>
                    </div>
                </div>

                {booking.notes && (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="line-clamp-2">{booking.notes}</p>
                    </div>
                )}

                {errorMsg && !showCancelModal && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Total Price
                    </span>
                    <span className="text-base font-extrabold text-slate-900">${booking.price}</span>
                </div>

                <div className="flex items-center gap-2">
                    {canBeCancelled && (
                        <button
                            onClick={() => {
                                setErrorMsg("");
                                setShowCancelModal(true);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                    )}

                    {canPayNow ? (
                        <button
                            onClick={handlePayNow}
                            disabled={isPaying}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                            {isPaying ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ExternalLink className="w-3.5 h-3.5" />
                            )}
                            Pay Now
                        </button>
                    ) : (
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border ${booking.paymentStatus === PaymentStatus.COMPLETED
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            {booking.paymentStatus === PaymentStatus.COMPLETED ? "Paid" : "Unpaid"}
                        </span>
                    )}

                    {/* COMPLETED বুকিংয়ের জন্য রিভিউ লজিক */}
                    {booking.status === BookingStatus.COMPLETED && (
                        isReviewed ? (
                            <button
                                disabled
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed opacity-80"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {booking.review?.rating ? `${booking.review.rating}.0 Rated` : "Review Done"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all shadow-xs cursor-pointer"
                            >
                                <Star className="w-3.5 h-3.5 fill-white" />
                                Write Review
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                                Cancel Booking
                            </h4>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-xs text-slate-600">
                            Are you sure you want to cancel this booking? Please provide a reason:
                        </p>

                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            rows={3}
                            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                disabled={isPending}
                                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                            >
                                Keep Booking
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelSubmit}
                                disabled={isPending}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Review Modal */}
            {isReviewModalOpen && bookingId && (
                <CreateReviewModal
                    isOpen={isReviewModalOpen}
                    bookingId={bookingId}
                    serviceTitle={serviceTitle}
                    technicianName={techName}
                    onClose={() => setIsReviewModalOpen(false)}
                    onSuccess={() => {
                        setIsReviewModalOpen(false);
                        setIsReviewed(true);
                    }}
                />
            )}
        </div>
    );
}

export function BookingCustomerView({ bookings, currentStatus }: BookingCustomerViewProps) {
    const [activeTab, setActiveTab] = useState<string>(currentStatus || "ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const filterTabs = [
        { label: "All Bookings", value: "ALL" },
        { label: "Requested", value: BookingStatus.REQUESTED },
        { label: "Accepted", value: BookingStatus.ACCEPTED },
        { label: "In Progress", value: BookingStatus.IN_PROGRESS },
        { label: "Completed", value: BookingStatus.COMPLETED },
        { label: "Cancelled", value: BookingStatus.CANCELLED },
    ];

    const filteredBookings = bookings.filter((booking) => {
        const matchesTab = activeTab === "ALL" || booking.status === activeTab;
        const cleanQuery = searchQuery.trim().toLowerCase();
        const matchesSearch =
            cleanQuery === "" ||
            booking.service?.title?.toLowerCase().includes(cleanQuery) ||
            booking.technician?.user?.name?.toLowerCase().includes(cleanQuery) ||
            booking.address?.toLowerCase().includes(cleanQuery);

        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {filterTabs.map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${isActive
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search service/tech..."
                        className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings.map((booking, index) => (
                        <BookingCustomerCard
                            key={booking.id || (booking as unknown as { _id?: string })._id || `booking-${index}`}
                            booking={booking}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                    <CheckCircle2 className="w-12 h-12 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-900">No Bookings Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                        {activeTab === "ALL"
                            ? "You haven't placed any service requests yet."
                            : `No bookings found with status "${activeTab}".`}
                    </p>
                    <Link
                        href="/customer/dashboard/technicians"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all"
                    >
                        Browse Technicians
                    </Link>
                </div>
            )}
        </div>
    );
}