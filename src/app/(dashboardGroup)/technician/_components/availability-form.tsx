// src/app/(dashboardGroup)/technician/_components/availability-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAvailability } from "../_actions/technician.action";
import { Weekday, IAvailabilitySlot, IAvailabilitySlotPayload } from "@/types";
import { Loader2, Clock, CalendarDays } from "lucide-react";

interface AvailabilityFormProps {
    initialData?: IAvailabilitySlot[];
}

const WEEKDAYS = Object.values(Weekday);

export function AvailabilityForm({ initialData = [] }: AvailabilityFormProps) {
    const router = useRouter();
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
                router.push("/technician/availability");
                router.refresh();
            } else {
                setErrorMsg(res?.message || "Failed to update availability");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6"
        >
            {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {errorMsg}
                </div>
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
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={slot.isAvailable}
                                    onChange={() => handleToggle(slot.weekday)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
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
                                <input
                                    type="time"
                                    required={slot.isAvailable}
                                    value={slot.startTime}
                                    onChange={(e) =>
                                        handleTimeChange(slot.weekday, "startTime", e.target.value)
                                    }
                                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                />
                            </div>
                            <span className="text-slate-400 text-sm font-medium">to</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    required={slot.isAvailable}
                                    value={slot.endTime}
                                    onChange={(e) =>
                                        handleTimeChange(slot.weekday, "endTime", e.target.value)
                                    }
                                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Availability
                </button>
            </div>
        </form>
    );
}