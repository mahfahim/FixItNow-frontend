// src/app/(dashboardGroup)/technician/_components/booking-actions-client_.tsx
"use client";

import { useState } from "react";
import { BookingStatus } from "@/types";
import {
    acceptBookingRequest,
    declineBookingRequest,
    startBookingJob,
    completeBookingJob,
} from "@/actions/booking.actions";
import { useToast } from "@/providers/toast-provider";
import { CheckCircle2, XCircle, Play, CheckCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BookingActionsClientProps {
    bookingId: string;
    currentStatus: BookingStatus;
    onSuccess?: () => void;
}

export function BookingActionsClient({
    bookingId,
    currentStatus,
    onSuccess,
}: BookingActionsClientProps) {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [completionNote, setCompletionNote] = useState("");

    const handleAction = async (
        actionFn: () => Promise<{ success: boolean; message?: string }>,
        successMsg: string
    ) => {
        try {
            setLoading(true);
            const res = await actionFn();

            if (res?.success) {
                setShowDeclineModal(false);
                setShowCompleteModal(false);
                success("Success", successMsg);
                if (onSuccess) onSuccess();
            } else {
                error("Action Failed", res?.message || "Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            error("Error", "Failed to perform action");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* 1. REQUESTED State -> Accept / Decline */}
            {currentStatus === BookingStatus.REQUESTED && (
                <>
                    <Button
                        disabled={loading}
                        onClick={() =>
                            handleAction(
                                () => acceptBookingRequest(bookingId),
                                "Booking request accepted successfully."
                            )
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 px-3 text-xs gap-1.5"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Accept
                    </Button>
                    <Button
                        variant="outline"
                        disabled={loading}
                        onClick={() => setShowDeclineModal(true)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 rounded-lg h-8 px-3 text-xs gap-1.5"
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        Decline
                    </Button>
                </>
            )}

            {/* 2. ACCEPTED or PAID State -> Start Job */}
            {(currentStatus === BookingStatus.ACCEPTED ||
                currentStatus === BookingStatus.PAID) && (
                    <Button
                        disabled={loading}
                        onClick={() =>
                            handleAction(
                                () => startBookingJob(bookingId),
                                "Job started successfully."
                            )
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 px-3 text-xs gap-1.5"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Play className="w-3.5 h-3.5" />
                        )}
                        Start Job
                    </Button>
                )}

            {/* 3. IN_PROGRESS State -> Complete Job */}
            {currentStatus === BookingStatus.IN_PROGRESS && (
                <Button
                    disabled={loading}
                    onClick={() => setShowCompleteModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-8 px-3 text-xs gap-1.5"
                >
                    {loading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <CheckCheck className="w-3.5 h-3.5" />
                    )}
                    Mark Completed
                </Button>
            )}

            {/* Decline Reason Modal */}
            <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Decline Booking
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Please provide a reason for declining this request.
                        </DialogDescription>
                    </DialogHeader>

                    <Textarea
                        rows={3}
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="E.g., Schedule conflict, out of coverage area..."
                        className="rounded-xl text-sm border-slate-200"
                    />

                    <DialogFooter className="flex sm:justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowDeclineModal(false)}
                            className="rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                handleAction(
                                    () => declineBookingRequest(bookingId, declineReason),
                                    "Booking request declined."
                                )
                            }
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs gap-1.5"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Confirm Decline
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Complete Note Modal */}
            <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Complete Job
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Add any optional completion note or service details for the customer.
                        </DialogDescription>
                    </DialogHeader>

                    <Textarea
                        rows={3}
                        value={completionNote}
                        onChange={(e) => setCompletionNote(e.target.value)}
                        placeholder="E.g., Replaced broken parts, tested successfully..."
                        className="rounded-xl text-sm border-slate-200"
                    />

                    <DialogFooter className="flex sm:justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowCompleteModal(false)}
                            className="rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                handleAction(
                                    () => completeBookingJob(bookingId, completionNote),
                                    "Job marked as completed successfully."
                                )
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs gap-1.5"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Mark as Completed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
