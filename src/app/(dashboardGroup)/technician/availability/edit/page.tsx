import Link from "next/link";
import { getAvailability } from "@/actions/technician.actions";
import { AvailabilityForm } from "../../_components/availability-form_";
import { ActionResponse, IAvailabilitySlot } from "@/types";
import { ArrowLeft, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditAvailabilityPage() {
    const res = (await getAvailability()) as ActionResponse<IAvailabilitySlot[]>;
    const availabilitySlots = res?.data || [];

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            {/* Navigation & Header */}
            <div className="space-y-4">
                <div>
                    <Link
                        href="/technician/availability"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white hover:bg-slate-100/80 border border-slate-200/80 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                        Back to Schedule
                    </Link>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
                                <CalendarDays className="w-5 h-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                Update Schedule
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Enable or disable working days and adjust your active daily hours.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Component */}
            <AvailabilityForm initialData={availabilitySlots} />
        </div>
    );
}