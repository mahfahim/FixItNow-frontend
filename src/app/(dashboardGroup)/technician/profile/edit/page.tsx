import { getMyProfile } from "@/actions/getMe.action";
import { ProfileForm } from "../../_components/profile-form";
import { IUser, ITechnician } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
    const profileRes = await getMyProfile();
    const user: IUser = profileRes?.data || profileRes?.result;
    const techProfile: ITechnician | null = user?.technicianProfile || null;

    // React-কে কম্পোনেন্টটি রি-রেন্ডার করতে বাধ্য করার জন্য একটি key তৈরি করা হলো
    const updateKey = techProfile?.updatedAt
        ? new Date(techProfile.updatedAt).getTime()
        : user?.id || "profile-form";

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Update your professional bio, rates, personal details, and address.
                </p>
            </div>

            {/* Profile PATCH Form with initial data and key */}
            <ProfileForm key={updateKey} initialUser={user} initialTechData={techProfile} />
        </div>
    );
}