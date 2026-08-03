// src/app/(dashboardGroup)/customer/_components/CreateReviewModal.tsx
"use client";

import React, { useState, useTransition } from "react";
import { Star, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { createReview } from "../_actions/review.actions";
import { useToast } from "@/providers/toast-provider";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

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
    const { success, error: toastError } = useToast();
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isPending, startTransition] = useTransition();

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
                success("Review Submitted", "Thank you for sharing your feedback!");
                if (onSuccess) onSuccess();
                onClose();
            } else {
                const msg = res.error || res.message || "Failed to submit review.";
                setErrorMsg(msg);
                toastError("Submission Failed", msg);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900">
                        Leave a Review
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 pt-1">
                        Share your feedback for{" "}
                        <span className="font-semibold text-slate-700">{serviceTitle}</span> by{" "}
                        <span className="font-semibold text-slate-700">{technicianName}</span>.
                    </DialogDescription>
                </DialogHeader>

                {errorMsg && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating Selection */}
                    <div className="space-y-1.5 text-center py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <Label className="text-xs font-semibold text-slate-600 block">
                            Overall Rating
                        </Label>
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
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Your Feedback (Optional)
                        </Label>
                        <Textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was the technician's service?"
                            className="text-xs resize-none rounded-xl border-slate-200"
                        />
                    </div>

                    {/* Action Buttons */}
                    <DialogFooter className="flex items-center gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 text-xs font-semibold rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl gap-2 shadow-xs"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}