"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "@/actions/services.actions";
import { ServiceCustomerCard } from "./service-customer";
import { ServiceFilters, ICategoryOption } from "./service-filters";
import { IService } from "@/types";
import { IServiceFilterOptions } from "@/types/service.types";
import { AlertCircle, Loader2 } from "lucide-react";

interface ServicesClientListProps {
    initialServices: IService[];
    categories: ICategoryOption[];
    queryFilters: IServiceFilterOptions;
    isTechnician: boolean;
}

export function ServicesClientList({
    initialServices,
    categories,
    queryFilters,
    isTechnician,
}: ServicesClientListProps) {
    // TanStack Query দিয়ে ফিল্টার ও ক্যাশিং হ্যান্ডেল করা হচ্ছে
    const { data: services = [], isFetching } = useQuery<IService[]>({
        queryKey: ["services", queryFilters],
        queryFn: async () => {
            const res = await getAllServices(queryFilters);
            return res?.data || res?.result || (Array.isArray(res) ? res : []);
        },
        initialData: initialServices,
        staleTime: 1000 * 60 * 5, // ৫ মিনিট ক্লায়েন্ট সাইডে ক্যাশ থাকবে
    });

    return (
        <div className="space-y-6">
            {/* Filter Dropdowns Component */}
            <ServiceFilters initialCategories={categories} />

            {/* Background Re-fetching Indicator */}
            {isFetching && (
                <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    <span>Updating service list...</span>
                </div>
            )}

            {/* Services Grid */}
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <ServiceCustomerCard
                            key={service.id}
                            service={service}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-slate-500" />
                    <h3 className="text-lg font-semibold text-slate-200">
                        {isTechnician ? "No Services Created Yet" : "No Services Found"}
                    </h3>
                    <p className="text-sm text-slate-400 max-w-sm">
                        {isTechnician
                            ? "You haven't added any services to your profile yet."
                            : "We could not find any services matching your request. Try adjusting your search or filters."}
                    </p>
                </div>
            )}
        </div>
    );
}