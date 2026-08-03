// src/(dashboardGroup)/technician/_components/TechnicianReviewCard.tsx
"use client";

import React from "react";
import { Star, Calendar, User, Wrench } from "lucide-react";
import { IReview } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
            <CardContent className="p-5 space-y-3">
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
                    <Badge
                        variant="outline"
                        className="bg-amber-50 border-amber-200 text-amber-700 font-bold gap-1 px-2.5 py-1 rounded-full text-xs shrink-0"
                    >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{Number(review.rating || 0).toFixed(1)}</span>
                    </Badge>
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
            </CardContent>
        </Card>
    );
}