// src/app/(dashboardGroup)/technician/_components/ReviewStatsSummary.tsx
"use client";

import React from "react";
import { Star, MessageSquare, Share2 } from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

interface ReviewStatsSummaryProps {
    averageRating: number | string;
    totalReviews: number;
}

export default function ReviewStatsSummary({
    averageRating,
    totalReviews,
}: ReviewStatsSummaryProps) {
    const { success } = useToast();
    const avg = Number(averageRating) || 0;

    const handleShare = () => {
        const summaryText = `Average Rating: ${avg.toFixed(1)} ★ | Total Reviews: ${totalReviews}`;
        navigator.clipboard.writeText(summaryText);
        success("Copied to Clipboard", "Review summary copied successfully.");
    };

    return (
        <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                    <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                        Ratings & Customer Reviews
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500">
                        Track customer feedback and service ratings for completed jobs.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                    <div className="flex items-center gap-6 bg-slate-50/80 px-5 py-3 rounded-2xl border border-slate-200/60">
                        {/* Average Rating */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-slate-900">
                                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                                <span className="text-2xl font-black">{avg.toFixed(1)}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                                Avg Rating
                            </p>
                        </div>

                        <div className="h-8 w-px bg-slate-200" />

                        {/* Total Reviews */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-slate-900">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                                <span className="text-2xl font-black">{totalReviews}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                                Total Reviews
                            </p>
                        </div>
                    </div>

                    {/* Light Styled Share Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/80 rounded-2xl h-11 w-11 shrink-0 transition-colors"
                        title="Share stats"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}