import { getAllTechnicians } from "@/actions/technician.actions";
import { TechniciansClientList } from "../_components/technicians-client-list_";
import { Users } from "lucide-react";
import {
    ITechnicianFilterOptions,
    IPaginationOptions,
    ActionResponse,
    ITechnician,
} from "@/types";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        searchTerm?: string;
        city?: string;
        district?: string;
        minRating?: string;
        page?: string;
        limit?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}

export default async function TechniciansPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;

    
    const queryFilters: ITechnicianFilterOptions & IPaginationOptions = {
        search: resolvedSearchParams.search || resolvedSearchParams.searchTerm,
        city: resolvedSearchParams.city,
        district: resolvedSearchParams.district,
        minRating: resolvedSearchParams.minRating,
        page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
        limit: resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : 9,
        sortBy: resolvedSearchParams.sortBy || "createdAt",
        sortOrder: resolvedSearchParams.sortOrder || "desc",
    };

    
    const initialData = (await getAllTechnicians(queryFilters)) as ActionResponse<ITechnician[]>;

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
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

            {/* TanStack Query Managed Technicians Component */}
            <TechniciansClientList
                initialData={initialData}
                queryFilters={queryFilters}
            />
        </div>
    );
}