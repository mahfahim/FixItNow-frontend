"use client";

import React, { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Loader2, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

import { createReview } from "@/actions/review.actions";
import { getMyBookings } from "@/actions/booking.actions";
import { useToast } from "@/providers/toast-provider";
import {
    createReviewSchema,
    CreateReviewFormValues,
} from "@/act-schema/review.schema";
import { IBooking, BookingStatus } from "@/types";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CreateReviewModalProps {
    onSuccess?: () => void;
}

export function CreateReviewModal({ onSuccess }: CreateReviewModalProps) {
    const [open, setOpen] = useState(false);
    const [completedBookings, setCompletedBookings] = useState<IBooking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [hoveredStar, setHoveredStar] = useState<number>(0);
    const [serverError, setServerError] = useState<string>("");

    const [isPending, startTransition] = useTransition();
    const { success, error: toastError } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateReviewFormValues>({
        resolver: zodResolver(createReviewSchema),
        defaultValues: {
            bookingId: "",
            rating: 0,
            comment: "",
        },
    });

    // React Compiler compatible watch method using useWatch hook
    const selectedRating = useWatch({
        control,
        name: "rating",
        defaultValue: 0,
    });

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);

        if (isOpen) {
            setLoadingBookings(true);
            setServerError("");

            try {
                const res = await getMyBookings({ status: BookingStatus.COMPLETED });
                if (res.success && res.data) {
                    const rawData = res.data;
                    const bookingsArray: IBooking[] = Array.isArray(rawData)
                        ? rawData
                        : Array.isArray((rawData as { data?: IBooking[] })?.data)
                            ? (rawData as { data: IBooking[] }).data
                            : [];

                    const eligible = bookingsArray.filter((booking) => !booking.review);
                    setCompletedBookings(eligible);
                }
            } catch {
                setServerError("Failed to fetch completed bookings.");
            } finally {
                setLoadingBookings(false);
            }
        } else {
            reset();
            setHoveredStar(0);
            setServerError("");
        }
    };

    const handleRatingClick = (ratingValue: number) => {
        setValue("rating", ratingValue, { shouldValidate: true });
    };

    const onSubmit = (data: CreateReviewFormValues) => {
        setServerError("");
        startTransition(async () => {
            const res = await createReview({
                bookingId: data.bookingId,
                rating: data.rating,
                comment: data.comment,
            });

            if (res.success) {
                success("Review Submitted", "Thank you for your feedback!");
                handleOpenChange(false);
                if (onSuccess) onSuccess();
            } else {
                const msg = res.message || res.error || "Failed to submit review.";
                setServerError(msg);
                toastError("Submission Failed", msg);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs font-semibold gap-2 inline-flex items-center justify-center px-4 py-2 text-sm cursor-pointer">
                <Plus className="w-4 h-4" />
                Write a Review
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 border border-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        Write a Service Review
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        Share your experience for completed services to help us maintain quality.
                    </DialogDescription>
                </DialogHeader>

                {serverError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <p>{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    {/* Booking Selection */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                            Select Completed Service <span className="text-rose-500">*</span>
                        </label>
                        {loadingBookings ? (
                            <div className="flex items-center gap-2 p-3 bg-slate-50 border rounded-xl text-xs text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                Loading eligible completed bookings...
                            </div>
                        ) : completedBookings.length === 0 ? (
                            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-800">
                                No unreviewed completed services found. Complete a job first to leave feedback!
                            </div>
                        ) : (
                            <select
                                {...register("bookingId")}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Choose a completed service --</option>
                                {completedBookings.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.service?.title || "Service"} (Tech: {b.technician?.user?.name || "Technician"})
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.bookingId && (
                            <p className="text-xs text-rose-500 mt-1">{errors.bookingId.message}</p>
                        )}
                    </div>

                    {/* Star Rating Picker */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                            Your Rating <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 py-1">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = star <= (hoveredStar || selectedRating);
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingClick(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-hidden"
                                    >
                                        <Star
                                            className={`w-7 h-7 ${isFilled
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-300 fill-slate-100"
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                            <span className="text-xs font-bold text-slate-600 ml-2">
                                {selectedRating > 0 ? `${selectedRating}.0 / 5.0` : ""}
                            </span>
                        </div>
                        {errors.rating && (
                            <p className="text-xs text-rose-500">{errors.rating.message}</p>
                        )}
                    </div>

                    {/* Comment Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                            Your Review Feedback <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <Textarea
                            {...register("comment")}
                            placeholder="Tell us about the service performance, punctuality, or quality..."
                            rows={3}
                            className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        {errors.comment && (
                            <p className="text-xs text-rose-500">{errors.comment.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                            className="rounded-xl text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || completedBookings.length === 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold px-5"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    Submit Review
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}