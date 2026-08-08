// src/app/(dashboardGroup)/customer/profile/page.tsx
import { getMyProfile } from "@/actions/getMe.action";
import { GetMeCustomer } from "@/components/share/cust-GetMeCustomer";
import { ActionResponse, IUser } from "@/types";
import { AlertCircle } from "lucide-react";

export const metadata = {
    title: "My Profile | FixItNow Customer",
    description: "View and manage your account details",
};

export default async function CustomerProfilePage() {
    const response = (await getMyProfile()) as ActionResponse<IUser>;
    const user = response?.data;

    if (!response?.success || !user) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm font-medium">
                    {response?.message || "Failed to load profile details. Please try again."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <GetMeCustomer user={user} />
        </div>
    );
}