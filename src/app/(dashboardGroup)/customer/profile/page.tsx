// src/app/(dashboardGroup)/customer/dashboard/profile/page.tsx
import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { GetMeCustomer } from "../_components/getMe-customer";
import { Edit3, User, Mail, Shield, AlertCircle } from "lucide-react";

export const metadata = {
    title: "My Profile | FixItNow Customer",
    description: "View and manage your account details",
};

export default async function CustomerProfilePage() {
    const response = await getMyProfile();
    const user = response?.data || response?.result;

    if (!response?.success || !user) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">
                    {response?.message || "Failed to load profile details. Please try again."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Bar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Account Profile</h1>
                    <p className="text-xs text-slate-500">
                        Overview of your personal customer profile details
                    </p>
                </div>
                {/* Updated Route Path */}
                <Link
                    href="/customer/profile/edit"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Profile
                </Link>
            </div>

            {/* Shared Customer Overview Header */}
            <GetMeCustomer user={user} />

            {/* Profile Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            Full Name
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.name || "N/A"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            Email Address
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.email}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5 text-slate-400" />
                            Account Role
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.role}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            Account Status
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}