import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { getAllCategories } from "@/actions/category.actions";
import { getAllTechnicians } from "@/actions/technician.actions"; // 1. Import technician action
import { ServiceForm } from "../../_components/service-form_";
import { ArrowLeft } from "lucide-react";
import { ICategory, ITechnician, IUser } from "@/types";

export const dynamic = "force-dynamic";

export default async function CreateServicePage() {
    
    const [profileRes, categoriesRes, techniciansRes] = await Promise.all([
        getMyProfile(),
        getAllCategories({ useCache: false }),
        getAllTechnicians(),
    ]);

    const user = profileRes?.data as IUser | undefined;
    const technicianId = user?.technicianProfile?.id || user?.id;

    const categories = ((categoriesRes?.data) as ICategory[]) || [];
    const technicians = ((techniciansRes?.data) as ITechnician[]) || []; // 3. Get technicians list

    return (
        <div className="max-w-3xl mx-auto space-y-6 ">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/technician/services"
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Services
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Add New Service</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Fill in the details below to publish a new service offer.
                </p>
            </div>

            {/* 4. Pass technicians prop to ServiceForm */}
            <ServiceForm
                categories={categories}
                technicians={technicians}
                technicianId={technicianId}
            />
        </div>
    );
}