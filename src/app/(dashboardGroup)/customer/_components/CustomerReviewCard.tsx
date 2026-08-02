
"use client";

import React from "react";
import { Star, Calendar, Wrench } from "lucide-react";
import { IReview } from "@/types";

interface CustomerReviewCardProps {
    review: IReview;
}

export default function CustomerReviewCard({ review }: CustomerReviewCardProps) {
    const serviceTitle = review.booking?.service?.title || "Service Job";
    const technicianName = review.technician?.user?.name || "Technician";
    const formattedDate = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "N/A";

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{serviceTitle}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                        Technician: {technicianName}
                    </h4>
                </div>

                {/* Star Rating Display */}
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-700">{review.rating}.0</span>
                </div>
            </div>

            {/* Review Comment */}
            {review.comment ? (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {review.comment}
                </p>
            ) : (
                <p className="text-xs text-slate-400 italic">No written comment provided.</p>
            )}

            {/* Date Footer */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reviewed on {formattedDate}</span>
            </div>
        </div>
    );
}