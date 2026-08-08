// src/app/(dashboardGroup)/technician/services/page.tsx
import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { getAllServices } from "@/actions/services.actions";
import { IService, IUser, ActionResponse, IPaginationOptions } from "@/types";
import { TechnicianServiceList } from "../_components/technician-service-list_";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TechnicianServicesPage() {
    const profileRes = (await getMyProfile()) as ActionResponse<IUser>;
    const user = profileRes?.data;
    const technicianId = user?.technicianProfile?.id || user?.id || "";

    
    const servicesRes = (await getAllServices({
        technicianId,
        page: 1,
        limit: 6,
    })) as ActionResponse<IService[]>;

    const initialServices: IService[] = servicesRes?.data || [];
    const initialMeta: IPaginationOptions | undefined = servicesRes?.meta;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Services</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Manage your offered service packages, pricing, and availability.
                    </p>
                </div>
                <Link
                    href="/technician/services/create"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add New Service
                </Link>
            </div>

            {/* Technician List Wrapper Call */}
            <TechnicianServiceList
                technicianId={technicianId}
                initialServices={initialServices}
                initialMeta={initialMeta}
            />
        </div>
    );
}