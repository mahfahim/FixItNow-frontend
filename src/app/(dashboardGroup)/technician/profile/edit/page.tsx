import { getMyProfile } from "@/actions/getMe.action";
import { ProfileForm } from "../../_components/profile-form_";
import { IUser, ITechnician, ActionResponse } from "@/types";
import { UserCog } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
    const profileRes = (await getMyProfile()) as ActionResponse<IUser>;
    const user = profileRes?.data;
    const techProfile: ITechnician | null = user?.technicianProfile || null;

    const updateKey = techProfile?.updatedAt
        ? new Date(techProfile.updatedAt).getTime()
        : user?.id || "profile-form";

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3.5 border-b border-slate-200/80 pb-5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/80">
                    <UserCog className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Profile</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Update your professional bio, service rates, contact info, and operational address.
                    </p>
                </div>
            </div>

            {/* Profile Form Component */}
            <ProfileForm key={updateKey} initialUser={user} initialTechData={techProfile} />
        </div>
    );
}