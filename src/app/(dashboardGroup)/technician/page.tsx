// src/app/(dashboardGroup)/technician/page.tsx

import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { IUser, ActionResponse } from "@/types";
import {
    User,
    ArrowRight,
    Wrench,
    Calendar,
    Briefcase,
} from "lucide-react";

export default async function TechnicianDashboardPage() {
    const profileRes = (await getMyProfile()) as ActionResponse<IUser>;
    const user = profileRes?.data;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Dynamic Welcome Banner */}
            <div className="bg-linear-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                            Technician Dashboard
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                            Welcome back, {user?.name || "Technician"}!
                        </h1>
                        <p className="text-indigo-100 text-xs sm:text-sm mt-1">
                            Manage your services, set work availability, and view active booking requests.
                        </p>
                    </div>
                    <Link
                        href="/technician/profile"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium px-4 py-2.5 rounded-xl transition-all backdrop-blur-sm shrink-0"
                    >
                        <User className="h-4 w-4" />
                        View Profile
                    </Link>
                </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Profile Management */}
                <Link
                    href="/technician/profile"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-indigo-600" />
                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                Profile Settings
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500">
                            Update bio, experience, hourly rate, and contact info
                        </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>

                {/* 2. Services Management */}
                <Link
                    href="/technician/services"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-indigo-600" />
                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                My Services
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500">
                            Add, update, or pause the service packages you offer
                        </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>

                {/* 3. Availability & Schedule */}
                <Link
                    href="/technician/availability"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-600" />
                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                Work Availability
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500">
                            Set your working days, hours, and available time slots
                        </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>

                {/* 4. Bookings & Job Management */}
                <Link
                    href="/technician/bookings"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-indigo-600" />
                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                Booking Requests
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500">
                            Accept/decline new jobs and update ongoing job status
                        </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
            </div>
        </div>
    );
}