// src/app/(dashboardGroup)/technician/_components/service-delete-button.tsx
"use client";

import { useState } from "react";
import { deleteService } from "@/actions/services.actions";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ServiceDeleteButtonProps {
    serviceId: string;
    serviceTitle: string;
}

export function ServiceDeleteButton({
    serviceId,
    serviceTitle,
}: ServiceDeleteButtonProps) {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await deleteService(serviceId);

            if (res?.success) {
                success(
                    "Service Deleted",
                    res?.message || `"${serviceTitle}" has been removed.`
                );
                setOpen(false);
            } else {
                error("Delete Failed", res?.message || "Failed to delete service.");
            }
        } catch (err) {
            console.error(err);
            error("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors inline-flex items-center justify-center h-9 w-9 shrink-0 cursor-pointer"
                title="Delete Service"
            >
                <Trash2 className="w-4 h-4" />
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-slate-900">
                        Delete Service?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-slate-500">
                        Are you sure you want to delete{" "}
                        <strong className="text-slate-800">&quot;{serviceTitle}&quot;</strong>?
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="pt-2 gap-2">
                    <AlertDialogCancel
                        disabled={loading}
                        className="rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 border-slate-200 mt-0"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={loading}
                        onClick={handleDelete}
                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium gap-1.5"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}