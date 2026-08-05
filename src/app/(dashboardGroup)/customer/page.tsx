import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { ActionResponse, IUser } from "@/types";
import {
    User,
    ArrowRight,
    Settings,
} from "lucide-react";

export default async function CustomerDashboardPage() {
    const profileRes = (await getMyProfile()) as ActionResponse<IUser>;
    const user = profileRes?.data;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Dynamic Welcome Banner */}
            <div className="bg-linear-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                            Customer Dashboard
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                            Welcome back, {user?.name || "Customer"}!
                        </h1>
                        <p className="text-indigo-100 text-xs sm:text-sm mt-1">
                            Here is an overview of your profile account settings.
                        </p>
                    </div>
                    <Link
                        href="/customer/profile"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium px-4 py-2.5 rounded-xl transition-all backdrop-blur-sm"
                    >
                        <User className="h-4 w-4" />
                        View Profile
                    </Link>
                </div>
            </div>

            {/* Quick Profile Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href="/customer/profile"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            My Profile
                        </h3>
                        <p className="text-xs text-slate-500">View personal details and account information</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/customer/profile/edit"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Edit Profile
                        </h3>
                        <p className="text-xs text-slate-500">Update your name, contact info, and address</p>
                    </div>
                    <Settings className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </Link>
            </div>
        </div>
    );
}