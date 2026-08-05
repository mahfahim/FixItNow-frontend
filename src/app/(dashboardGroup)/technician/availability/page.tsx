// src/app/(dashboardGroup)/technician/availability/page.tsx

import Link from "next/link";
import { getAvailability } from "@/actions/technician.actions";
import { Edit, Clock, CalendarX2 } from "lucide-react";
import { ActionResponse, IAvailabilitySlot, Weekday } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AvailabilityViewPage() {
    const res = (await getAvailability()) as ActionResponse<IAvailabilitySlot[]>;
    const availabilitySlots: IAvailabilitySlot[] = res?.data || [];

    const WEEKDAYS = Object.values(Weekday);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Working Hours</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Manage your daily availability for customer bookings.
                    </p>
                </div>
                <Link
                    href="/technician/availability/edit"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
                >
                    <Edit className="w-4 h-4" />
                    Edit Schedule
                </Link>
            </div>

            {/* Schedule List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {WEEKDAYS.map((day, idx) => {
                    const slot = availabilitySlots.find((s: IAvailabilitySlot) => s.weekday === day);
                    const isAvailable = slot?.isAvailable;

                    return (
                        <div
                            key={day}
                            className={`flex items-center justify-between p-5 ${idx !== WEEKDAYS.length - 1 ? "border-b border-slate-100" : ""
                                } ${isAvailable ? "bg-white" : "bg-slate-50/50"}`}
                        >
                            <div className="flex items-center gap-3 w-32 sm:w-48">
                                <span
                                    className={`text-sm font-semibold capitalize ${isAvailable ? "text-slate-800" : "text-slate-400"
                                        }`}
                                >
                                    {day.toLowerCase()}
                                </span>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isAvailable
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-slate-100 text-slate-500 border-slate-200"
                                        }`}
                                >
                                    {isAvailable ? "Open" : "Closed"}
                                </span>
                            </div>

                            {isAvailable ? (
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Clock className="w-4 h-4 text-indigo-500 hidden sm:block" />
                                    <span>
                                        {slot.startTime} - {slot.endTime}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <CalendarX2 className="w-4 h-4" />
                                    Not working
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}