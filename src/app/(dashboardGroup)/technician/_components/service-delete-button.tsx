// src/app/(dashboardGroup)/technician/_components/service-delete-button.tsx
"use client";

import { useState } from "react";
import { deleteService } from "../_actions/services.actions";
import { Trash2, Loader2 } from "lucide-react";

interface ServiceDeleteButtonProps {
    serviceId: string;
    serviceTitle: string;
}

export function ServiceDeleteButton({
    serviceId,
    serviceTitle,
}: ServiceDeleteButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await deleteService(serviceId);
            if (res?.success) {
                setShowConfirm(false);
            } else {
                alert(res?.message || "Failed to delete service");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Service"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
                        <h3 className="text-base font-bold text-slate-900">
                            Delete Service?
                        </h3>
                        <p className="text-xs text-slate-500">
                            Are you sure you want to delete <strong>`&quot;`{serviceTitle}`&quot;`</strong>?
                            This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleDelete}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}