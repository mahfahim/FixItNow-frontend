// src/app/(dashboardGroup)/technician/_components/availability-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAvailability } from "@/actions/technician.actions";
import { Weekday, IAvailabilitySlot, IAvailabilitySlotPayload } from "@/types";
import { useToast } from "@/providers/toast-provider";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AvailabilityFormProps {
    initialData?: IAvailabilitySlot[];
}

const WEEKDAYS = Object.values(Weekday);

export function AvailabilityForm({ initialData = [] }: AvailabilityFormProps) {
    const router = useRouter();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [slots, setSlots] = useState<IAvailabilitySlotPayload[]>(() => {
        return WEEKDAYS.map((day) => {
            const existing = initialData.find((slot) => slot.weekday === day);
            return {
                weekday: day,
                startTime: existing?.startTime || "09:00",
                endTime: existing?.endTime || "17:00",
                isAvailable: existing?.isAvailable ?? false,
            };
        });
    });

    const handleToggle = (day: Weekday) => {
        setSlots((prev) =>
            prev.map((slot) =>
                slot.weekday === day
                    ? { ...slot, isAvailable: !slot.isAvailable }
                    : slot
            )
        );
    };

    const handleTimeChange = (
        day: Weekday,
        field: "startTime" | "endTime",
        value: string
    ) => {
        setSlots((prev) =>
            prev.map((slot) =>
                slot.weekday === day ? { ...slot, [field]: value } : slot
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        try {
            setLoading(true);
            const res = await setAvailability(slots);

            if (res?.success) {
                success(
                    "Availability Updated",
                    "Your weekly availability schedule has been saved."
                );
                router.push("/technician/availability");
                router.refresh();
            } else {
                const msg = res?.message || "Failed to update availability";
                setErrorMsg(msg);
                error("Update Failed", msg);
            }
        } catch (err) {
            console.error(err);
            const msg = "An unexpected error occurred.";
            setErrorMsg(msg);
            error("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <form onSubmit={handleSubmit}>
                <CardContent className="p-6 sm:p-8 space-y-6">
                    {errorMsg && (
                        <Alert
                            variant="destructive"
                            className="bg-red-50 border-red-200 text-red-700 text-xs rounded-xl"
                        >
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-3">
                        {slots.map((slot) => {
                            const dayName =
                                slot.weekday.charAt(0) + slot.weekday.slice(1).toLowerCase();

                            return (
                                <div
                                    key={slot.weekday}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 ${slot.isAvailable
                                        ? "border-blue-200/80 bg-blue-50/40 shadow-2xs"
                                        : "border-slate-200/60 bg-slate-50/60"
                                        }`}
                                >
                                    {/* Day Name & Switch */}
                                    <div className="flex items-center gap-3.5 sm:w-48">
                                        <Switch
                                            checked={slot.isAvailable}
                                            onCheckedChange={() => handleToggle(slot.weekday)}
                                            className="data-unchecked:bg-slate-300! data-[state=unchecked]:bg-slate-300! data-checked:bg-blue-600! data-[state=checked]:bg-blue-600! transition-colors"
                                        />
                                        <span
                                            className={`text-sm font-semibold transition-colors ${slot.isAvailable ? "text-slate-900" : "text-slate-500"
                                                }`}
                                        >
                                            {dayName}
                                        </span>
                                    </div>

                                    {/* Time Inputs */}
                                    <div
                                        className={`flex items-center gap-3 transition-opacity duration-200 ${slot.isAvailable
                                            ? "opacity-100"
                                            : "opacity-50 pointer-events-none"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Clock
                                                className={`w-4 h-4 ${slot.isAvailable ? "text-blue-600" : "text-slate-400"
                                                    }`}
                                            />
                                            <Input
                                                type="time"
                                                disabled={!slot.isAvailable}
                                                required={slot.isAvailable}
                                                value={slot.startTime}
                                                onChange={(e) =>
                                                    handleTimeChange(
                                                        slot.weekday,
                                                        "startTime",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-32 h-10 text-xs sm:text-sm border-slate-200 bg-white rounded-xl font-medium text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs disabled:bg-slate-100 disabled:text-slate-400"
                                            />
                                        </div>

                                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                            to
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="time"
                                                disabled={!slot.isAvailable}
                                                required={slot.isAvailable}
                                                value={slot.endTime}
                                                onChange={(e) =>
                                                    handleTimeChange(
                                                        slot.weekday,
                                                        "endTime",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-32 h-10 text-xs sm:text-sm border-slate-200 bg-white rounded-xl font-medium text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs disabled:bg-slate-100 disabled:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 px-5 h-10 transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 h-10 shadow-xs transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Save Availability
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}