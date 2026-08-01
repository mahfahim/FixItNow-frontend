// src/app/(dashboardGroup)/technician/availability/edit/page.tsx

import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { AvailabilityForm } from "../../_components/availability-form";
import { ArrowLeft } from "lucide-react";

export default async function EditAvailabilityPage() {
    const profileRes = await getMyProfile();
    const user = profileRes?.data || profileRes?.result;
    const availabilitySlots = user?.technicianProfile?.availabilitySlots || [];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/technician/availability"
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Schedule
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Update Schedule</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Enable or disable working days and adjust your active hours.
                </p>
            </div>

            {/* Form Component */}
            <AvailabilityForm initialData={availabilitySlots} />
        </div>
    );
}