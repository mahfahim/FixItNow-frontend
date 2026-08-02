
"use client";

import React, { useState, useTransition } from "react";
import { Star, X, Loader2, MessageSquare } from "lucide-react";
import { createReview } from "../_actions/review.actions";

interface CreateReviewModalProps {
    isOpen: boolean;
    bookingId: string;
    serviceTitle?: string;
    technicianName?: string;
    token?: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateReviewModal({
    isOpen,
    bookingId,
    serviceTitle = "Service",
    technicianName = "Technician",
    token,
    onClose,
    onSuccess,
}: CreateReviewModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        startTransition(async () => {
            const res = await createReview(
                {
                    bookingId,
                    rating,
                    comment,
                },
                token
            );

            if (res.success) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                setErrorMsg(res.error || res.message || "Failed to submit review.");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Leave a Review</h3>
                    <p className="text-xs text-slate-500">
                        Share your feedback for <span className="font-semibold text-slate-700">{serviceTitle}</span> by{" "}
                        <span className="font-semibold text-slate-700">{technicianName}</span>.
                    </p>
                </div>

                {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating Selection */}
                    <div className="space-y-1.5 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="text-xs font-semibold text-slate-600 block">Overall Rating</label>
                        <div className="flex justify-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`w-7 h-7 ${star <= (hoverRating || rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-slate-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Textarea */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Your Feedback (Optional)
                        </label>
                        <textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was the technician's service?"
                            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}