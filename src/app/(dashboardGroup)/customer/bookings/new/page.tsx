"use client";

import React, { useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBooking } from "@/actions/booking.actions";
import { createPaymentIntent } from "@/actions/payment.actions";
import { PaymentProvider } from "@/types";
import {
    Calendar,
    Clock,
    MapPin,
    FileText,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";

function BookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const serviceId = searchParams.get("serviceId") || "";
    const serviceTitle = searchParams.get("serviceTitle") || "Selected Service";
    const servicePrice = Number(searchParams.get("price")) || 0;
    const technicianId = searchParams.get("technicianId") || undefined;

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

    const handleSubmitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceId) {
            setErrorMsg("Invalid service selected. Please choose a service first.");
            return;
        }

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

            if (res?.success && res?.data) {
                const id = res.data.id || (res.data as unknown as { _id: string })._id;
                setCreatedBookingId(id);
            } else {
                setErrorMsg(res?.error || res?.message || "Failed to create booking.");
            }
        });
    };

    const handleProceedToPayment = async () => {
        if (!createdBookingId) return;
        setIsPaying(true);
        setErrorMsg("");

        try {
            const res = await createPaymentIntent({
                bookingId: createdBookingId,
                provider: "STRIPE" as PaymentProvider,
            });

            const gatewayUrl = res?.data?.gatewayUrl;

            if (res?.success && gatewayUrl) {
                window.location.href = gatewayUrl;
            } else {
                setErrorMsg(res?.error || res?.message || "Failed to initialize payment gateway.");
                setIsPaying(false);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("An unexpected error occurred during payment.");
            setIsPaying(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <Link
                    href="/customer/dashboard/bookings"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Bookings
                </Link>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                    New Service Request
                </span>
            </div>

            {!createdBookingId ? (
                /* Booking Request Form */
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Book Service</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Provide your preferred date, time, and service location details.
                        </p>
                    </div>

                    {/* Service Summary Card */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Selected Service
                            </span>
                            <h3 className="font-bold text-slate-800 text-sm">{serviceTitle}</h3>
                        </div>
                        {servicePrice > 0 && (
                            <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                    Est. Price
                                </span>
                                <span className="text-lg font-extrabold text-blue-600">৳{servicePrice}</span>
                            </div>
                        )}
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">
                                    Scheduled Date *
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
                                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">
                                    Scheduled Time *
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
                                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">
                                Service Address *
                            </label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Street address, apartment number, area..."
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
                                    placeholder="Special instructions for the technician..."
                                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ShieldCheck className="w-4 h-4" />
                            )}
                            Confirm Booking Request
                        </button>
                    </form>
                </div>
            ) : (
                /* Success & Payment Step */
                <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-lg">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-900">Booking Created Successfully!</h2>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                        Your booking request has been submitted. You can pay now or finish the payment later from your dashboard.
                    </p>

                    {errorMsg && (
                        <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                            {errorMsg}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                        <button
                            onClick={() => router.push("/customer/dashboard/bookings")}
                            className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={handleProceedToPayment}
                            disabled={isPaying}
                            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                        >
                            {isPaying && <Loader2 className="w-4 h-4 animate-spin" />}
                            Pay Now {servicePrice > 0 ? `(৳${servicePrice})` : ""}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


export default function NewBookingPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-xs">Loading booking form...</div>}>
            <BookingForm />
        </Suspense>
    );
}