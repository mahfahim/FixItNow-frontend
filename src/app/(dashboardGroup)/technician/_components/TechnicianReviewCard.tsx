// src/app/(dashboardGroup)/technician/_components/TechnicianReviewCard.tsx
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
    const customerName =
        review.customer?.name ||
        review.booking?.customer?.name ||
        "Customer";

    const serviceTitle =
        review.booking?.service?.title ||
        "Service Job";

    const formattedDate = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "N/A";

    return (
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-slate-300 transition-all">
            <CardContent className="p-5 space-y-3.5">
                {/* Header: User, Service & Rating */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* User Icon Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                            <User className="w-4 h-4 text-slate-500" />
                        </div>

                        <div className="space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                {customerName}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="line-clamp-1">{serviceTitle}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rating Badge */}
                    <Badge
                        variant="outline"
                        className="bg-amber-50/80 border-amber-200/80 text-amber-800 font-bold gap-1 px-2.5 py-1 rounded-lg text-xs shrink-0 shadow-2xs"
                    >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{Number(review.rating || 0).toFixed(1)}</span>
                    </Badge>
                </div>

                {/* Review Comment Box */}
                {review.comment ? (
                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                        &quot;{review.comment}&quot;
                    </div>
                ) : (
                    <div className="text-xs text-slate-400 italic bg-slate-50/50 p-3 rounded-xl border border-slate-100/80">
                        No comment provided.
                    </div>
                )}

                {/* Footer Date */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Submitted on {formattedDate}</span>
                </div>
            </CardContent>
        </Card>
    );
}