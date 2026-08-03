// src/app/(dashboardGroup)/customer/_components/booking-customer.tsx
"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { IBooking, BookingStatus, PaymentStatus, PaymentProvider } from "@/types";
import { cancelCustomerBooking } from "../_actions/booking.actions";
import { createPaymentIntent } from "@/app/(payment)/_actions/payment.actions";
import { cancelBookingSchema } from "../_schema/booking.schema";
import CreateReviewModal from "../_components/CreateReviewModal";
import { useToast } from "@/providers/toast-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

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
    const { success, error: toastError } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isPaying, setIsPaying] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const [isReviewed, setIsReviewed] = useState<boolean>(
        Boolean(
            booking.review &&
            (typeof booking.review === "object"
                ? Object.keys(booking.review).length > 0
                : true)
        )
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
                return { label: "Requested", className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" };
            case BookingStatus.ACCEPTED:
                return { label: "Accepted", className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50" };
            case BookingStatus.IN_PROGRESS:
                return { label: "In Progress", className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50" };
            case BookingStatus.COMPLETED:
                return { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" };
            case BookingStatus.DECLINED:
                return { label: "Declined", className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50" };
            case BookingStatus.CANCELLED:
                return { label: "Cancelled", className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100" };
            default:
                return { label: status, className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50" };
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
                provider: PaymentProvider.STRIPE,
            });

            const gatewayUrl = res?.data?.gatewayUrl || res?.gatewayUrl || res?.data?.url;

            if (res?.success && gatewayUrl) {
                success("Redirecting", "Taking you to payment gateway...");
                window.location.href = gatewayUrl;
            } else {
                const msg = res?.message || "Failed to initialize payment gateway.";
                setErrorMsg(msg);
                toastError("Payment Failed", msg);
                setIsPaying(false);
            }
        } catch (err) {
            console.error(err);
            const msg = "An unexpected error occurred during payment.";
            setErrorMsg(msg);
            toastError("Payment Error", msg);
            setIsPaying(false);
        }
    };

    const handleCancelSubmit = () => {
        if (!bookingId) return;

        const validation = cancelBookingSchema.safeParse({ cancellationReason: reason });

        if (!validation.success) {
            const firstError = validation.error.issues[0]?.message || "Invalid cancellation reason.";
            setErrorMsg(firstError);
            toastError("Validation Error", firstError);
            return;
        }

        setErrorMsg("");
        startTransition(async () => {
            const res = await cancelCustomerBooking(bookingId, validation.data.cancellationReason);
            if (res.success) {
                success("Booking Cancelled", "Your booking request has been cancelled.");
                setShowCancelModal(false);
                setReason("");
                if (onCancelSuccess) onCancelSuccess(bookingId);
            } else {
                const msg = res.error || res.message || "Failed to cancel booking.";
                setErrorMsg(msg);
                toastError("Cancellation Failed", msg);
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
        <Card className="rounded-2xl border-slate-200 bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-slate-100 space-y-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="font-semibold text-slate-900 text-base line-clamp-1">
                                {serviceTitle}
                            </CardTitle>
                            <p className="text-xs text-slate-400 font-mono">
                                ID: {bookingId?.slice(-8)}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
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
            </CardContent>

            {/* Actions Footer */}
            <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Total Price
                    </span>
                    <span className="text-base font-extrabold text-slate-900">${booking.price}</span>
                </div>

                <div className="flex items-center gap-2">
                    {canBeCancelled && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setErrorMsg("");
                                setShowCancelModal(true);
                            }}
                            className="px-3 py-1.5 h-auto text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 rounded-lg"
                        >
                            Cancel
                        </Button>
                    )}

                    {canPayNow ? (
                        <Button
                            type="button"
                            onClick={handlePayNow}
                            disabled={isPaying}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-auto px-3.5 py-1.5 rounded-lg gap-1.5"
                        >
                            {isPaying ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ExternalLink className="w-3.5 h-3.5" />
                            )}
                            Pay Now
                        </Button>
                    ) : (
                        <Badge
                            variant="outline"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${booking.paymentStatus === PaymentStatus.COMPLETED
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            {booking.paymentStatus === PaymentStatus.COMPLETED ? "Paid" : "Unpaid"}
                        </Badge>
                    )}

                    {/* COMPLETED Booking Review Logic */}
                    {booking.status === BookingStatus.COMPLETED && (
                        isReviewed ? (
                            <Button
                                disabled
                                variant="outline"
                                className="px-3 py-1.5 h-auto text-xs font-semibold text-slate-500 bg-slate-100 border-slate-200 rounded-lg opacity-80 gap-1.5"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {booking.review?.rating ? `${booking.review.rating}.0 Rated` : "Review Done"}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => setIsReviewModalOpen(true)}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-auto px-3 py-1.5 rounded-lg gap-1.5"
                            >
                                <Star className="w-3.5 h-3.5 fill-white" />
                                Write Review
                            </Button>
                        )
                    )}
                </div>
            </CardFooter>

            {/* Cancel Modal */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            Cancel Booking
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-600 pt-1">
                            Are you sure you want to cancel this booking? Please provide a reason below:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            rows={3}
                            className="text-xs resize-none"
                        />
                        {errorMsg && (
                            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                        )}
                    </div>

                    <DialogFooter className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCancelModal(false)}
                            disabled={isPending}
                            className="text-xs font-semibold rounded-xl"
                        >
                            Keep Booking
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleCancelSubmit}
                            disabled={isPending}
                            className="text-xs font-semibold rounded-xl gap-1.5"
                        >
                            {isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <XCircle className="w-3.5 h-3.5" />
                            )}
                            Confirm Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                        success("Review Submitted", "Thank you for sharing your feedback.");
                    }}
                />
            )}
        </Card>
    );
}

export function BookingCustomerView({
    bookings,
    currentStatus,
}: BookingCustomerViewProps) {
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
                            <Button
                                key={tab.value}
                                type="button"
                                variant={isActive ? "default" : "outline"}
                                onClick={() => setActiveTab(tab.value)}
                                className={`text-xs font-semibold rounded-xl whitespace-nowrap px-4 py-2 h-auto ${isActive
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                                    }`}
                            >
                                {tab.label}
                            </Button>
                        );
                    })}
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search service/tech..."
                        className="pl-9 text-xs rounded-xl bg-white border-slate-200"
                    />
                </div>
            </div>

            {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings.map((booking, index) => (
                        <BookingCustomerCard
                            key={
                                booking.id ||
                                (booking as unknown as { _id?: string })._id ||
                                `booking-${index}`
                            }
                            booking={booking}
                        />
                    ))}
                </div>
            ) : (
                <Card className="rounded-2xl border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                    <CheckCircle2 className="w-12 h-12 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-900">No Bookings Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                        {activeTab === "ALL"
                            ? "You haven't placed any service requests yet."
                            : `No bookings found with status "${activeTab}".`}
                    </p>
                    <Link href="/customer/dashboard/technicians">
                        <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl">
                            Browse Technicians
                        </Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}