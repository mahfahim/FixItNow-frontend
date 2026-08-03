// src/app/(dashboardGroup)/customer/_components/book-service-modal.tsx
"use client";

import React, { useState, useTransition } from "react";
import { createBooking } from "../_actions/booking.actions";
import { createPaymentIntent } from "@/app/(payment)/_actions/payment.actions";
import { PaymentProvider } from "@/types/enums";
import { useToast } from "@/providers/toast-provider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Loader2,
    Calendar,
    Clock,
    MapPin,
    FileText,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

interface BookServiceModalProps {
    serviceId: string;
    serviceTitle: string;
    servicePrice: number;
    technicianId?: string;
    isOpen: boolean;
    onClose: () => void;
}

export function BookServiceModal({
    serviceId,
    serviceTitle,
    servicePrice,
    technicianId,
    isOpen,
    onClose,
}: BookServiceModalProps) {
    const { success, error: toastError } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isPaying, setIsPaying] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        scheduledDate: "",
        scheduledTime: "",
        address: "",
        notes: "",
    });

    // Step 1: Submit Booking
    const handleSubmitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        startTransition(async () => {
            const res = await createBooking({
                serviceId,
                technicianId,
                scheduledDate: formData.scheduledDate,
                scheduledTime: formData.scheduledTime,
                address: formData.address,
                notes: formData.notes,
            });

            if (res.success && res.data) {
                const id = res.data.id || (res.data as unknown as { _id: string })._id;
                setCreatedBookingId(id);
                success(
                    "Booking Requested",
                    "Your service booking has been created successfully."
                );
            } else {
                const msg = res.error || res.message || "Failed to create booking.";
                setErrorMsg(msg);
                toastError("Booking Failed", msg);
            }
        });
    };

    // Step 2: Redirect to Payment Gateway
    const handleProceedToPayment = async () => {
        if (!createdBookingId) return;
        setIsPaying(true);
        setErrorMsg("");

        try {
            const res = await createPaymentIntent({
                bookingId: createdBookingId,
                provider: PaymentProvider.STRIPE,
            });

            const gatewayUrl = res?.gatewayUrl || res?.data?.url || res?.url;

            if (res?.success && gatewayUrl) {
                success("Redirecting", "Taking you to payment gateway...");
                window.location.href = gatewayUrl;
            } else {
                const msg = res?.message || "Failed to initiate payment gateway.";
                setErrorMsg(msg);
                toastError("Payment Failed", msg);
                setIsPaying(false);
            }
        } catch (err) {
            console.error(err);
            const msg = "An error occurred while redirecting to payment.";
            setErrorMsg(msg);
            toastError("Error", msg);
            setIsPaying(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-white p-6 rounded-2xl">
                {!createdBookingId ? (
                    /* Booking Form */
                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                        <DialogHeader className="border-b pb-3">
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Book {serviceTitle}
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                Fill out the form to schedule a service booking.
                            </DialogDescription>
                        </DialogHeader>

                        {errorMsg && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="scheduledDate"
                                    className="text-xs font-semibold text-slate-700"
                                >
                                    Scheduled Date
                                </Label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                                    <Input
                                        id="scheduledDate"
                                        type="date"
                                        required
                                        value={formData.scheduledDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, scheduledDate: e.target.value })
                                        }
                                        className="pl-9 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label
                                    htmlFor="scheduledTime"
                                    className="text-xs font-semibold text-slate-700"
                                >
                                    Scheduled Time
                                </Label>
                                <div className="relative">
                                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                                    <Input
                                        id="scheduledTime"
                                        type="time"
                                        required
                                        value={formData.scheduledTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, scheduledTime: e.target.value })
                                        }
                                        className="pl-9 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="address"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Address
                            </Label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 z-10 pointer-events-none" />
                                <Textarea
                                    id="address"
                                    required
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    placeholder="Enter full address..."
                                    className="pl-9 text-xs resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="notes"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Additional Notes (Optional)
                            </Label>
                            <div className="relative">
                                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 z-10 pointer-events-none" />
                                <Textarea
                                    id="notes"
                                    rows={2}
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    placeholder="Specific requirements or details..."
                                    className="pl-9 text-xs resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t flex justify-between items-center">
                            <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                                    Total Price
                                </span>
                                <span className="text-base font-extrabold text-slate-900">
                                    ৳{servicePrice}
                                </span>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-2"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Confirm Booking
                            </Button>
                        </div>
                    </form>
                ) : (
                    /* Success & Pay Now Step */
                    <div className="text-center py-4 space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-xl font-bold text-slate-900 text-center">
                                Booking Requested!
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-600 max-w-xs mx-auto text-center pt-1">
                                Your service request has been created successfully. Proceed to payment
                                to finalize your booking.
                            </DialogDescription>
                        </DialogHeader>

                        {errorMsg && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2 text-left">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <div className="flex justify-center gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="text-xs font-semibold"
                            >
                                Pay Later
                            </Button>
                            <Button
                                type="button"
                                onClick={handleProceedToPayment}
                                disabled={isPaying}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2"
                            >
                                {isPaying && <Loader2 className="w-4 h-4 animate-spin" />}
                                Pay Now (৳{servicePrice})
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}