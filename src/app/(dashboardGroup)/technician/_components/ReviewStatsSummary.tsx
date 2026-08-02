
"use client";

import React from "react";
import { Star, MessageSquare } from "lucide-react";

interface ReviewStatsSummaryProps {
    averageRating: number | string;
    totalReviews: number;
}

export default function ReviewStatsSummary({
    averageRating,
    totalReviews,
}: ReviewStatsSummaryProps) {
    const avg = Number(averageRating) || 0;

    return (
        <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-xl font-extrabold">Ratings & Customer Reviews</h2>
                <p className="text-xs text-slate-300">
                    Track customer feedback and service ratings for completed jobs.
                </p>
            </div>

            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                        <Star className="w-5 h-5 fill-amber-400" />
                        <span className="text-2xl font-black">{avg.toFixed(1)}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                        Avg Rating
                    </p>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-indigo-300">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-2xl font-black">{totalReviews}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                        Total Reviews
                    </p>
                </div>
            </div>
        </div>
    );
}