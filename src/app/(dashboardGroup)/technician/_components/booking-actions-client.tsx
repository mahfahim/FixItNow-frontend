// src/app/(dashboardGroup)/technician/_components/booking-actions-client.tsx
"use client";

import { useState } from "react";
import { BookingStatus } from "@/types";
import {
    acceptBookingRequest,
    declineBookingRequest,
    startBookingJob,
    completeBookingJob,
} from "../_actions/booking.actions";
import { CheckCircle2, XCircle, Play, CheckCheck, Loader2 } from "lucide-react";

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
    const [loading, setLoading] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [completionNote, setCompletionNote] = useState("");

    const handleAction = async (actionFn: () => Promise<{ success: boolean; message?: string }>) => {
        try {
            setLoading(true);
            const res = await actionFn();
            if (res?.success) {
                setShowDeclineModal(false);
                setShowCompleteModal(false);
                if (onSuccess) onSuccess();
            } else {
                alert(res?.message || "Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to perform action");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* 1. REQUESTED State -> Accept / Decline */}
            {currentStatus === BookingStatus.REQUESTED && (
                <>
                    <button
                        disabled={loading}
                        onClick={() => handleAction(() => acceptBookingRequest(bookingId))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Accept
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => setShowDeclineModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        Decline
                    </button>
                </>
            )}

            {/* 2. ACCEPTED or PAID State -> Start Job */}
            {(currentStatus === BookingStatus.ACCEPTED || currentStatus === BookingStatus.PAID) && (
                <button
                    disabled={loading}
                    onClick={() => handleAction(() => startBookingJob(bookingId))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    Start Job
                </button>
            )}

            {/* 3. IN_PROGRESS State -> Complete Job */}
            {currentStatus === BookingStatus.IN_PROGRESS && (
                <button
                    disabled={loading}
                    onClick={() => setShowCompleteModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                    Mark Completed
                </button>
            )}

            {/* Decline Reason Modal */}
            {showDeclineModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Decline Booking</h3>
                        <p className="text-xs text-slate-500">
                            Please provide a reason for declining this request.
                        </p>
                        <textarea
                            rows={3}
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            placeholder="E.g., Schedule conflict, out of coverage area..."
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDeclineModal(false)}
                                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    handleAction(() => declineBookingRequest(bookingId, declineReason))
                                }
                                className="px-4 py-2 text-xs font-medium bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
                            >
                                Confirm Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Note Modal */}
            {showCompleteModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Complete Job</h3>
                        <p className="text-xs text-slate-500">
                            Add any optional completion note or service details for the customer.
                        </p>
                        <textarea
                            rows={3}
                            value={completionNote}
                            onChange={(e) => setCompletionNote(e.target.value)}
                            placeholder="E.g., Replaced broken parts, tested successfully..."
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCompleteModal(false)}
                                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    handleAction(() => completeBookingJob(bookingId, completionNote))
                                }
                                className="px-4 py-2 text-xs font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                            >
                                Mark as Completed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}