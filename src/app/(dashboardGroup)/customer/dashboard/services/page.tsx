// src/app/(dashboardGroup)/customer/dashboard/services/page.tsx

import { getAllServices } from "@/actions/services.actions";
import { ServiceCustomerCard, IService } from "../../_components/service-customer";
import { Wrench, AlertCircle } from "lucide-react";

interface PageProps {
    searchParams: Promise<{
        searchTerm?: string;
        category?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const res = await getAllServices(resolvedSearchParams);

    const services: IService[] = res?.data || res?.result || (Array.isArray(res) ? res : []);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Wrench className="h-6 w-6 text-blue-500" />
                        Browse Available Services
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Choose a service and book expert technicians instantly.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <ServiceCustomerCard
                            key={service._id || service.id}
                            service={service}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-slate-500" />
                    <h3 className="text-lg font-semibold text-slate-200">
                        No Services Found
                    </h3>
                    <p className="text-sm text-slate-400 max-w-sm">
                        We could not find any services matching your request right now. Please check back later.
                    </p>
                </div>
            )}
        </div>
    );
}