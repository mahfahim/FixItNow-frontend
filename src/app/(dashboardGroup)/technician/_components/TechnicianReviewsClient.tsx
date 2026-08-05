// src/app/(dashboardGroup)/technician/_components/TechnicianReviewsClient.tsx
"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getTechnicianReviews } from "@/actions/review.actions";
import ReviewStatsSummary from "../_components/ReviewStatsSummary";
import TechnicianReviewCard from "../_components/TechnicianReviewCard";
import { ActionResponse, IReview } from "@/types";
import { Loader2, Star, AlertCircle } from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TechnicianReviewsClientProps {
    technicianId: string;
}

export default function TechnicianReviewsClient({ technicianId }: TechnicianReviewsClientProps) {
    const { error: toastError } = useToast();
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isPending, startTransition] = useTransition();
    const [apiError, setApiError] = useState<string>("");

    const errorMsg = !technicianId ? "Technician ID is required to fetch reviews." : apiError;

    const totalReviews = reviews.length;
    const avgRating =
        totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

    useEffect(() => {
        if (!technicianId) {
            toastError("Missing Information", "Technician ID is required to fetch reviews.");
            return;
        }

        startTransition(async () => {
            const res = (await getTechnicianReviews(technicianId)) as ActionResponse<IReview[]>;

            if (res.success && res.data) {
                setReviews(res.data);
                setApiError("");
            } else {
                const errMsg = res.error || res.message || "Failed to fetch reviews.";
                setApiError(errMsg);
                toastError("Fetch Error", errMsg);
            }
        });
    }, [technicianId, toastError]);

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            {/* Header Stats */}
            <ReviewStatsSummary averageRating={avgRating} totalReviews={totalReviews} />

            {/* Loading State */}
            {isPending && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                    <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Loading customer reviews...</p>
                </div>
            )}

            {/* Error State */}
            {!isPending && errorMsg && (
                <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-xs font-bold">Failed to load reviews</AlertTitle>
                    <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
                </Alert>
            )}

            {/* Empty State */}
            {!isPending && !errorMsg && reviews.length === 0 && (
                <Card className="border-dashed border-slate-200/80 bg-white rounded-2xl shadow-xs">
                    <CardContent className="text-center py-16 space-y-3">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 flex items-center justify-center mx-auto">
                            <Star className="w-6 h-6 fill-blue-600 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">No Feedback Yet</h3>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            Reviews from customers after completed jobs will appear here.
                        </p>
                    </CardContent>
                </Card>
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