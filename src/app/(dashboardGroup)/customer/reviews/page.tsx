
"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getCustomerReviews } from "../_actions/review.actions";
import CustomerReviewCard from "../_components/CustomerReviewCard";
import { IReview } from "@/types";
import { Star, Loader2, MessageSquare } from "lucide-react";

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
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">My Submitted Reviews</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        All reviews you have submitted for past completed service jobs.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-2xl">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900">
                        Total Reviews: {reviews.length}
                    </span>
                </div>
            </div>

            {/* Loading State */}
            {isPending && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Loading your reviews...</p>
                </div>
            )}

            {/* Error Message */}
            {!isPending && errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-2xl">
                    {errorMsg}
                </div>
            )}

            {/* Empty State */}
            {!isPending && !errorMsg && reviews.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <Star className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Reviews Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        You have not submitted any reviews yet. Complete a booking to leave feedback for technicians!
                    </p>
                </div>
            )}

            {/* Review List */}
            {!isPending && reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review) => (
                        <CustomerReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}