"use client";

import React, { useState, useTransition } from "react";
import { createBooking } from "../_actions/booking.actions";
import { createPaymentIntent } from "@/app/(payment)/_actions/payment.actions";
import { PaymentProvider } from "@/types/enums"; // 👈 PaymentProvider Enum টি ইমপোর্ট করুন
import { Loader2, Calendar, Clock, MapPin, FileText, CheckCircle2 } from "lucide-react";

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

    if (!isOpen) return null;

    // step 1: Submit Booking
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
            } else {
                setErrorMsg(res.error || res.message || "Failed to create booking.");
            }
        });
    };

    // step 2: Direct Redirect to Payment Gateway
    const handleProceedToPayment = async () => {
        if (!createdBookingId) return;
        setIsPaying(true);
        setErrorMsg("");

        try {
            const res = await createPaymentIntent({
                bookingId: createdBookingId,
                provider: "STRIPE" as PaymentProvider // 👈 String literal এর বদলে Enum ব্যবহার করা হয়েছে
            });

            const gatewayUrl = res?.gatewayUrl || res?.data?.url || res?.url;

            if (res?.success && gatewayUrl) {
                window.location.href = gatewayUrl;
            } else {
                setErrorMsg(res?.message || "Failed to initiate payment gateway.");
                setIsPaying(false);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("An error occurred while redirecting to payment.");
            setIsPaying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                {!createdBookingId ? (
                    /* Booking Form */
                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg font-bold text-slate-900">Book {serviceTitle}</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {errorMsg && (
                            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                                {errorMsg}
                            </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">
                                    Scheduled Date
                                </label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="date"
                                        required
                                        value={formData.scheduledDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, scheduledDate: e.target.value })
                                        }
                                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">
                                    Scheduled Time
                                </label>
                                <div className="relative">
                                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="time"
                                        required
                                        value={formData.scheduledTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, scheduledTime: e.target.value })
                                        }
                                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter full address..."
                                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">
                                Additional Notes (Optional)
                            </label>
                            <div className="relative">
                                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <textarea
                                    rows={2}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Specific requirements or details..."
                                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t flex justify-between items-center">
                            <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                                    Total Price
                                </span>
                                <span className="text-base font-extrabold text-slate-900">৳{servicePrice}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all inline-flex items-center gap-2 disabled:opacity-50"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Success & Pay Now Step */
                    <div className="text-center py-6 space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-900">Booking Requested!</h3>
                        <p className="text-xs text-slate-600 max-w-xs mx-auto">
                            Your service request has been created successfully. Proceed to payment to finalize
                            your booking.
                        </p>

                        {errorMsg && (
                            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                                {errorMsg}
                            </p>
                        )}

                        <div className="flex justify-center gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                            >
                                Pay Later
                            </button>
                            <button
                                onClick={handleProceedToPayment}
                                disabled={isPaying}
                                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl inline-flex items-center gap-2 disabled:opacity-50"
                            >
                                {isPaying && <Loader2 className="w-4 h-4 animate-spin" />}
                                Pay Now (৳{servicePrice})
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}