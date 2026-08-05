// src/app/(dashboardGroup)/admin/page.tsx

import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { ActionResponse, IUser } from "@/types";
import {
    Users,
    ArrowRight,
    CalendarDays,
    Layers,
} from "lucide-react";

export default async function AdminDashboardPage() {
    const profileRes = (await getMyProfile()) as ActionResponse<IUser>;
    const user = profileRes?.data;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Dynamic Welcome Banner */}
            <div className="bg-linear-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                            Admin Dashboard
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                            Welcome back, {user?.name || "Admin"}!
                        </h1>
                        <p className="text-indigo-100 text-xs sm:text-sm mt-1">
                            Here is an overview of platform metrics and management tools.
                        </p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium px-4 py-2.5 rounded-xl transition-all backdrop-blur-sm"
                    >
                        <Users className="h-4 w-4" />
                        Manage Users
                    </Link>
                </div>
            </div>

            {/* Quick Admin Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/admin/users"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Manage Users
                        </h3>
                        <p className="text-xs text-slate-500">View, ban, or unban platform accounts</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/admin/bookings"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            All Bookings
                        </h3>
                        <p className="text-xs text-slate-500">Monitor and oversee all system bookings</p>
                    </div>
                    <CalendarDays className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </Link>

                <Link
                    href="/admin/categories"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Categories
                        </h3>
                        <p className="text-xs text-slate-500">Create and manage service categories</p>
                    </div>
                    <Layers className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </Link>
            </div>
        </div>
    );
}