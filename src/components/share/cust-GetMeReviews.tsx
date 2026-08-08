"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getMyReviews } from "@/actions/review.actions";
import { CustomerReviewCard } from "@/components/share/cust-CustomerReviewCard";
import { CreateReviewModal } from "@/components/share/cust-CreateReviewModal";
import { ActionResponse, IReview } from "@/types";
import { Star, Loader2, MessageSquare, AlertCircle } from "lucide-react";

export interface GetMeReviewsProps {
    className?: string;
}

export function GetMeReviews({ className = "" }: GetMeReviewsProps) {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [reloadKey, setReloadKey] = useState<number>(0);


    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        setReloadKey((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let isMounted = true;


        async function fetchReviews() {
            try {
                const res: ActionResponse<IReview[] | { data: IReview[] }> = await getMyReviews();
                if (isMounted) {
                    if (res.success && res.data) {
                        const rawData = res.data;
                        const fetchedReviews: IReview[] = Array.isArray(rawData)
                            ? rawData
                            : Array.isArray(rawData?.data)
                                ? rawData.data
                                : [];

                        setReviews(fetchedReviews);
                        setErrorMsg("");
                    } else {
                        setErrorMsg(res.message || res.error || "Failed to load reviews.");
                    }
                }
            } catch {
                if (isMounted) {
                    setErrorMsg("An unexpected error occurred while fetching reviews.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchReviews();

        return () => {
            isMounted = false;
        };
    }, [reloadKey]);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header with Add Review Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Star className="h-5 w-5 fill-blue-600/20" />
                        </div>
                        My Submitted Reviews
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        All reviews and ratings you have submitted for completed service jobs.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 bg-blue-50/80 border border-blue-200/70 px-3.5 py-2 rounded-xl">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-900">
                            Total Reviews: {reviews.length}
                        </span>
                    </div>

                    {/* Modal Component */}
                    <CreateReviewModal onSuccess={handleRefresh} />
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Loading your reviews...</p>
                </div>
            )}

            {/* Error Alert */}
            {!isLoading && errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm shadow-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <p className="font-medium">{errorMsg}</p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !errorMsg && reviews.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/60">
                        <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">No Reviews Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        You have not submitted any reviews yet. Click the &quot;Write a Review&quot; button above to leave feedback for a completed service!
                    </p>
                </div>
            )}

            {/* Review Grid */}
            {!isLoading && reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reviews.map((review) => (
                        <CustomerReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default GetMeReviews;