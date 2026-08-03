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
        <Card className="bg-linear-to-r from-slate-900 via-slate-900 to-indigo-950 text-white border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                    <CardTitle className="text-xl font-extrabold text-white">
                        Ratings & Customer Reviews
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-300">
                        Track customer feedback and service ratings for completed jobs.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-amber-400">
                                <Star className="w-5 h-5 fill-amber-400" />
                                <span className="text-2xl font-black">{avg.toFixed(1)}</span>
                            </div>
                            <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                                Avg Rating
                            </p>
                        </div>

                        <div className="h-8 w-px bg-white/20" />

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-indigo-300">
                                <MessageSquare className="w-5 h-5" />
                                <span className="text-2xl font-black">{totalReviews}</span>
                            </div>
                            <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                                Total Reviews
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="text-slate-300 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 shrink-0"
                        title="Share stats"
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}