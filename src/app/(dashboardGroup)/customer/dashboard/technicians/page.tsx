// src/app/(dashboardGroup)/customer/dashboard/technicians/page.tsx

import { getAllTechnicians } from "@/actions/technician.actions";
import { TechnicianCustomerCard } from "../../_components/technician-view-customer";
import { Users, AlertCircle } from "lucide-react";
import { ITechnician } from "@/types";

interface PageProps {
    searchParams: Promise<{
        searchTerm?: string;
        specialization?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function TechniciansPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const res = await getAllTechnicians(resolvedSearchParams);

    const technicians: ITechnician[] =
        res?.data || res?.result || (Array.isArray(res) ? res : []);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        Verified Technicians
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Browse top-rated professionals for your service needs.
                    </p>
                </div>
            </div>

            {/* Technicians Grid */}
            {technicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {technicians.map((technician, index) => {
                        // Safe key extraction without TypeScript errors
                        const techKey =
                            technician.id ||
                            (technician as unknown as { _id?: string })._id ||
                            `tech-${index}`;

                        return (
                            <TechnicianCustomerCard
                                key={techKey}
                                technician={technician}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
                    <AlertCircle className="w-12 h-12 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-900">
                        No Technicians Found
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm">
                        We could not find any technicians matching your search criteria. Please try again later.
                    </p>
                </div>
            )}
        </div>
    );
}