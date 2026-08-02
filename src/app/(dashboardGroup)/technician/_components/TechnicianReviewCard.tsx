
"use client";

import React from "react";
import { Star, Calendar, User, Wrench } from "lucide-react";
import { IReview } from "@/types";

interface TechnicianReviewCardProps {
    review: IReview;
}

export default function TechnicianReviewCard({ review }: TechnicianReviewCardProps) {
    const customerName = review.customer?.name || "Customer";
    const serviceTitle = review.booking?.service?.title || "Service Job";

    const formattedDate = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "N/A";

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span>{customerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Wrench className="w-3.5 h-3.5 text-slate-400" />
                        <span>{serviceTitle}</span>
                    </div>
                </div>

                {/* Rating Stars */}
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
                <p className="text-xs text-slate-400 italic">No comment provided.</p>
            )}

            {/* Date */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted on {formattedDate}</span>
            </div>
        </div>
    );
}