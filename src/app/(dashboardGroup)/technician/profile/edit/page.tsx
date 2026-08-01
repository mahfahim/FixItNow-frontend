// src/app/(dashboardGroup)/technician/profile/edit/page.tsx

import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { ProfileForm } from "../../_components/profile-form";
import { ArrowLeft } from "lucide-react";
import { IUser } from "@/types";

export default async function EditProfilePage() {
    const profileRes = await getMyProfile();
    const user: IUser = profileRes?.data || profileRes?.result;
    const techProfile = user?.technicianProfile;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/technician/profile"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Update your professional details to attract more customers.
                </p>
            </div>

            {/* Profile Form Component */}
            <ProfileForm initialData={techProfile} />
        </div>
    );
}