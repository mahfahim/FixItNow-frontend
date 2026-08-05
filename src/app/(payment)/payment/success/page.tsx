"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPayment } from "@/actions/payment.actions";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying payment transaction...");

    const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");
    const bookingId = searchParams.get("bookingId");
    const tranId = searchParams.get("tran_id");

    useEffect(() => {
        startTransition(async () => {
            const res = await confirmPayment({
                sessionId: sessionId || "",
                bookingId: bookingId || "",
                tranId: tranId || "",
            });

            if (res?.success) {
                setStatus("success");
                setMessage(res.message || "Payment verified successfully!");
            } else {
                setStatus("error");
                setMessage(res?.message || "Failed to confirm payment status.");
            }
        });
    }, [sessionId, bookingId, tranId]);

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
            {status === "loading" && (
                <div className="space-y-3 py-6">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                    <h3 className="text-lg font-bold text-slate-800">Processing Payment</h3>
                    <p className="text-xs text-slate-500">{message}</p>
                </div>
            )}

            {status === "success" && (
                <div className="space-y-4 py-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">Payment Successful!</h3>
                    <p className="text-xs text-slate-600">{message}</p>

                    <Link
                        href="/customer/bookings"
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                    >
                        Go to My Bookings
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div className="space-y-4 py-4">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <XCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">Payment Verification Failed</h3>
                    <p className="text-xs text-slate-600">{message}</p>

                    <Link
                        href="/customer/bookings"
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-semibold text-xs rounded-xl hover:bg-slate-900 transition-all"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <Suspense
                fallback={
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
                        <div className="space-y-3 py-6">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                            <h3 className="text-lg font-bold text-slate-800">Verifying Payment...</h3>
                        </div>
                    </div>
                }
            >
                <PaymentSuccessContent />
            </Suspense>
        </div>
    );
}