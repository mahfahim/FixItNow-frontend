"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getCustomerReviews } from "../_actions/review.actions";
import CustomerReviewCard from "../_components/CustomerReviewCard";
import { IReview } from "@/types";
import { Star, Loader2, MessageSquare, AlertCircle } from "lucide-react";

export default function CustomerReviewsPage() {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isPending, startTransition] = useTransition();
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        startTransition(async () => {
            const res = await getCustomerReviews();
            if (res.success && res.data) {
                setReviews(res.data);
            } else {
                setErrorMsg(res.error || "Failed to load reviews.");
            }
        });
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Star className="h-5 w-5 fill-blue-600/20" />
                        </div>
                        My Submitted Reviews
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        All reviews and ratings you have submitted for past completed service jobs.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200/70 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-900">
                        Total Reviews: {reviews.length}
                    </span>
                </div>
            </div>

            {/* Loading State */}
            {isPending && (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Loading your reviews...</p>
                </div>
            )}

            {/* Error Alert */}
            {!isPending && errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm shadow-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <p className="font-medium">{errorMsg}</p>
                </div>
            )}

            {/* Empty State */}
            {!isPending && !errorMsg && reviews.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/60">
                        <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">No Reviews Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        You have not submitted any reviews yet. Complete a booking to leave feedback for your technicians!
                    </p>
                </div>
            )}

            {/* Review Grid */}
            {!isPending && reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reviews.map((review) => (
                        <CustomerReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}