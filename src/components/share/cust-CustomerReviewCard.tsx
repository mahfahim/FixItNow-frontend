// src/components/share/cust-CustomerReviewCard.tsx
"use client";

import React from "react";
import { Star, Calendar, Wrench, Copy, User } from "lucide-react";
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

export interface CustomerReviewCardProps {
    review: IReview;
    className?: string;
}

export function CustomerReviewCard({ review, className = "" }: CustomerReviewCardProps) {
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
        <Card className={`rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden ${className}`}>
            {/* Header */}
            <CardHeader className="p-4 border-b border-slate-100 bg-white space-y-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                            <Wrench className="w-3.5 h-3.5 shrink-0" />
                            <span className="line-clamp-1">{serviceTitle}</span>
                        </div>
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{technicianName}</span>
                        </CardTitle>
                    </div>

                    <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-amber-50/80 border-amber-200/80 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
                    >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{review.rating}.0</span>
                    </Badge>
                </div>
            </CardHeader>

            {/* Comment Section */}
            <CardContent className="p-4 space-y-3 bg-white flex-1">
                {review.comment ? (
                    <div className="relative group bg-slate-50/80 p-3 rounded-xl border border-slate-100 min-h-17.5">
                        <p className="text-xs text-slate-700 leading-relaxed pr-6">
                            &quot;{review.comment}&quot;
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleCopyComment}
                            className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-md transition-colors"
                            title="Copy review text"
                        >
                            <Copy className="w-3 h-3" />
                        </Button>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic py-2">No written comment provided.</p>
                )}
            </CardContent>

            {/* Clean & Light Footer */}
            <CardFooter className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto rounded-b-2xl">
                <div className="flex items-center gap-1.5 font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reviewed on {formattedDate}</span>
                </div>
            </CardFooter>
        </Card>
    );
}

export default CustomerReviewCard;