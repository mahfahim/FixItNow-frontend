// src/app/(dashboardGroup)/customer/_components/CustomerReviewCard.tsx
"use client";

import React from "react";
import { Star, Calendar, Wrench, Copy } from "lucide-react";
import { IReview } from "@/types";
import { useToast } from "@/providers/toast-provider";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

interface CustomerReviewCardProps {
    review: IReview;
}

export default function CustomerReviewCard({ review }: CustomerReviewCardProps) {
    const { success } = useToast();

    const serviceTitle = review.booking?.service?.title || "Service Job";
    const technicianName = review.technician?.user?.name || "Technician";
    const formattedDate = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "N/A";

    const handleCopyComment = () => {
        if (review.comment) {
            navigator.clipboard.writeText(review.comment);
            success("Copied", "Review feedback copied to clipboard!");
        }
    };

    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100 space-y-0">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold">
                            <Wrench className="w-3.5 h-3.5" />
                            <span>{serviceTitle}</span>
                        </div>
                        <CardTitle className="text-sm font-bold text-slate-900 mt-1">
                            Technician: {technicianName}
                        </CardTitle>
                    </div>

                    <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-amber-50 border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold"
                    >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{review.rating}.0</span>
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
                {review.comment ? (
                    <div className="relative group bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed pr-6">
                            {review.comment}
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleCopyComment}
                            className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-slate-600 rounded-md"
                            title="Copy review text"
                        >
                            <Copy className="w-3 h-3" />
                        </Button>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No written comment provided.</p>
                )}
            </CardContent>

            <CardFooter className="pt-0 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reviewed on {formattedDate}</span>
            </CardFooter>
        </Card>
    );
}