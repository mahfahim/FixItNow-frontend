"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getTechnicianReviews } from "@/actions/review.actions";
import ReviewStatsSummary from "../_components/ReviewStatsSummary";
import TechnicianReviewCard from "../_components/TechnicianReviewCard";
import { IReview } from "@/types";
import { Loader2, Star } from "lucide-react";

interface TechnicianReviewsClientProps {
    technicianId: string;
}

export default function TechnicianReviewsClient({ technicianId }: TechnicianReviewsClientProps) {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isPending, startTransition] = useTransition();
    const [apiError, setApiError] = useState<string>("");

    // technicianId না থাকলে Derived State ব্যবহার করা হয়েছে যাতে cascading render error না হয়
    const errorMsg = !technicianId ? "Technician ID is required to fetch reviews." : apiError;

    const totalReviews = reviews.length;
    const avgRating =
        totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

    useEffect(() => {
        if (!technicianId) return;

        startTransition(async () => {
            const res = await getTechnicianReviews(technicianId);
            if (res.success && res.data) {
                setReviews(res.data);
                setApiError("");
            } else {
                setApiError(res.error || "Failed to fetch reviews.");
            }
        });
    }, [technicianId]);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header Stats */}
            <ReviewStatsSummary averageRating={avgRating} totalReviews={totalReviews} />

            {/* Loading State */}
            {isPending && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Loading your reviews...</p>
                </div>
            )}

            {/* Error State */}
            {!isPending && errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-2xl">
                    {errorMsg}
                </div>
            )}

            {/* Empty State */}
            {!isPending && !errorMsg && reviews.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <Star className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Feedback Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Reviews from customers after completed jobs will appear here.
                    </p>
                </div>
            )}

            {/* Reviews List */}
            {!isPending && !errorMsg && reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review) => (
                        <TechnicianReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}