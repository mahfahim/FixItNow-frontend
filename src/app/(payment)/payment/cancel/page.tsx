"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(3);

    useEffect(() => {

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);


        const redirectTimeout = setTimeout(() => {
            router.push("/customer/bookings");
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [router]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
                <div className="space-y-4 py-4">
                    {/* Icon Header */}
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <XCircle className="w-10 h-10" />
                    </div>

                    {/* Title & Message */}
                    <h3 className="text-xl font-extrabold text-slate-900">
                        Payment Cancelled
                    </h3>
                    <p className="text-xs text-slate-600">
                        You have cancelled the payment process. No money was deducted.
                    </p>

                    {/* Auto Redirect Info */}
                    <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 py-2 px-4 rounded-xl">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Redirecting to My Bookings in {timeLeft} seconds...</span>
                    </div>

                    {/* Manual Button */}
                    <div className="pt-2">
                        <Link
                            href="/customer/bookings"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-all w-full"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back Immediately
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}