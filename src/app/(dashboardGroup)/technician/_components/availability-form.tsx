// src/app/(dashboardGroup)/technician/_components/availability-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAvailability } from "../_actions/technician.action";
import { Weekday, IAvailabilitySlot, IAvailabilitySlotPayload } from "@/types";
import { useToast } from "@/providers/toast-provider";
import { Loader2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

    // Initialize state merging default values and initial data
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
        <Card className="bg-white rounded-2xl border border-slate-200/80 shadow-xs py-0">
            <form onSubmit={handleSubmit}>
                <CardContent className="p-6 sm:p-8 space-y-6">
                    {errorMsg && (
                        <Alert
                            variant="destructive"
                            className="bg-rose-50 border-rose-200 text-rose-700 text-xs rounded-xl"
                        >
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        {slots.map((slot) => (
                            <div
                                key={slot.weekday}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${slot.isAvailable
                                        ? "border-indigo-100 bg-indigo-50/30"
                                        : "border-slate-100 bg-slate-50"
                                    }`}
                            >
                                {/* Day & Toggle */}
                                <div className="flex items-center gap-4 w-48">
                                    <Switch
                                        checked={slot.isAvailable}
                                        onCheckedChange={() => handleToggle(slot.weekday)}
                                    />
                                    <span
                                        className={`text-sm font-semibold capitalize ${slot.isAvailable ? "text-indigo-900" : "text-slate-400"
                                            }`}
                                    >
                                        {slot.weekday.toLowerCase()}
                                    </span>
                                </div>

                                {/* Time Inputs */}
                                <div
                                    className={`flex items-center gap-3 transition-opacity ${slot.isAvailable
                                            ? "opacity-100"
                                            : "opacity-40 pointer-events-none"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400 hidden sm:block" />
                                        <Input
                                            type="time"
                                            required={slot.isAvailable}
                                            value={slot.startTime}
                                            onChange={(e) =>
                                                handleTimeChange(
                                                    slot.weekday,
                                                    "startTime",
                                                    e.target.value
                                                )
                                            }
                                            className="w-32 h-9 text-xs border-slate-200 bg-white rounded-lg focus:ring-indigo-500"
                                        />
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium">
                                        to
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            required={slot.isAvailable}
                                            value={slot.endTime}
                                            onChange={(e) =>
                                                handleTimeChange(
                                                    slot.weekday,
                                                    "endTime",
                                                    e.target.value
                                                )
                                            }
                                            className="w-32 h-9 text-xs border-slate-200 bg-white rounded-lg focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl gap-2"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Availability
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}