//src/components/share/BookingCard.tsx

"use client";

import React, { useState, useTransition } from "react";
import { IBooking, BookingStatus, PaymentStatus, PaymentProvider } from "@/types";
import { cancelCustomerBooking } from "@/actions/booking.actions";
import { createPaymentIntent } from "@/actions/payment.actions";
import { cancelBookingSchema } from "@/act-schema/booking.schema";
import { CreateReviewModal } from "@/components/share/cust-CreateReviewModal";
import { useToast } from "@/providers/toast-provider";

import { Button } from "@/components/ui/button";
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
    ExternalLink,

} from "lucide-react";

export interface BookingCardProps {
    booking: IBooking;
    onCancelSuccess?: (id: string) => void;
    onReviewSuccess?: (id: string) => void;
}

export function BookingCard({ booking, onCancelSuccess, onReviewSuccess }: BookingCardProps) {
    const { success, error: toastError } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isPaying, setIsPaying] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);


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
                return { label: "Requested", className: "bg-amber-50 text-amber-700 border-amber-200/80" };
            case BookingStatus.ACCEPTED:
                return { label: "Accepted", className: "bg-blue-50 text-blue-700 border-blue-200/80" };
            case BookingStatus.IN_PROGRESS:
                return { label: "In Progress", className: "bg-indigo-50 text-indigo-700 border-indigo-200/80" };
            case BookingStatus.COMPLETED:
                return { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200/80" };
            case BookingStatus.DECLINED:
                return { label: "Declined", className: "bg-rose-50 text-rose-700 border-rose-200/80" };
            case BookingStatus.CANCELLED:
                return { label: "Cancelled", className: "bg-slate-100 text-slate-600 border-slate-200" };
            default:
                return { label: status, className: "bg-slate-50 text-slate-700 border-slate-200" };
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


            const gatewayUrl = res?.data?.gatewayUrl;

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
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <CardHeader className="p-4 border-b border-slate-100 bg-white space-y-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="font-semibold text-slate-900 text-base line-clamp-1">
                                {serviceTitle}
                            </CardTitle>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                ID: {bookingId?.slice(-8)}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusInfo.className}`}>
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>

            {/* Content Details */}
            <CardContent className="p-4 space-y-3 bg-white">
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
                            <strong className="font-medium text-slate-800">Technician:</strong> {techName} {techPhone ? `(${techPhone})` : ""}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">
                            <strong className="font-medium text-slate-800">Address:</strong> {booking.address}
                        </span>
                    </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                    <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="line-clamp-2 leading-relaxed">{booking.notes}</p>
                    </div>
                )}

                {errorMsg && !showCancelModal && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}
            </CardContent>

            {/* Footer */}
            <CardFooter className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Total Price
                    </span>
                    <span className="text-lg font-bold text-slate-900">${booking.price}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Payment Status Badge */}
                    <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border ${booking.paymentStatus === PaymentStatus.COMPLETED
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        {booking.paymentStatus === PaymentStatus.COMPLETED ? "Paid" : "Unpaid"}
                    </Badge>

                    {/* Cancel Action */}
                    {canBeCancelled && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setErrorMsg("");
                                setShowCancelModal(true);
                            }}
                            className="px-3 py-1.5 h-8 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </Button>
                    )}

                    {/* Pay Action */}
                    {canPayNow && (
                        <Button
                            type="button"
                            onClick={handlePayNow}
                            disabled={isPaying}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3.5 rounded-lg gap-1.5 shadow-xs font-medium"
                        >
                            {isPaying ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ExternalLink className="w-3.5 h-3.5" />
                            )}
                            Pay Now
                        </Button>
                    )}

                    {/* Review Action */}
                    {booking.status === BookingStatus.COMPLETED && (
                        isReviewed ? (
                            <Button
                                disabled
                                variant="outline"
                                className="px-3 py-1.5 h-8 text-xs font-semibold text-slate-500 bg-slate-100 border-slate-200 rounded-lg gap-1.5 opacity-90"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {booking.review?.rating ? `${booking.review.rating}.0 Rated` : "Rated"}
                            </Button>
                        ) : (
                            <CreateReviewModal
                                onSuccess={() => {
                                    setIsReviewed(true);
                                    if (onReviewSuccess && bookingId) onReviewSuccess(bookingId);
                                }}
                            />
                        )
                    )}
                </div>
            </CardFooter>

            {/* Cancel Modal */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            Cancel Booking
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 pt-1">
                            Are you sure you want to cancel this booking? Please provide a reason below:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            rows={3}
                            className="text-xs resize-none rounded-xl border-slate-200 focus:ring-1 focus:ring-blue-600"
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
                            className="text-xs font-semibold rounded-xl border-slate-200"
                        >
                            Keep Booking
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleCancelSubmit}
                            disabled={isPending}
                            className="text-xs font-semibold rounded-xl gap-1.5 bg-rose-600 hover:bg-rose-700"
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

            {/* Review Modal */}

        </Card>
    );
}