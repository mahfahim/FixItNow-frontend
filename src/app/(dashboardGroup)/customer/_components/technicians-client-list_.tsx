"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllTechnicians } from "@/actions/technician.actions";
import { TechnicianCustomerCard } from "./technician-view-customer_";
import { TechnicianFilters } from "./technician-filters_";
import { ActionResponse, ITechnician, ITechnicianFilterOptions, IPaginationOptions } from "@/types";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TechniciansClientListProps {
    initialData: ActionResponse<ITechnician[]>;
    queryFilters: ITechnicianFilterOptions & IPaginationOptions;
}

export function TechniciansClientList({
    initialData,
    queryFilters,
}: TechniciansClientListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // TanStack Query for dynamic fetching with explicit ActionResponse typing
    const { data: response, isFetching } = useQuery<ActionResponse<ITechnician[]>>({
        queryKey: ["technicians", queryFilters],
        queryFn: async () => {
            const res = (await getAllTechnicians(queryFilters)) as ActionResponse<ITechnician[]>;
            return res;
        },
        initialData: initialData,
        staleTime: 1000 * 60 * 3,
    });

    const technicians: ITechnician[] = Array.isArray(response?.data) ? response.data : [];

    const meta = {
        page: Number(response?.meta?.page ?? queryFilters.page ?? 1),
        limit: Number(response?.meta?.limit ?? queryFilters.limit ?? 9),
        total: Number(response?.meta?.total ?? technicians.length),
        totalPage: Number(response?.meta?.totalPage ?? 1),
    };

    const updateQueryParams = (newParams: Record<string, string | number>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            params.set(key, String(value));
        });
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > (meta.totalPage || 1)) return;
        updateQueryParams({ page: newPage });
    };

    const handleLimitChange = (newLimit: string | null) => {
        if (!newLimit) return;
        updateQueryParams({ limit: newLimit, page: 1 });
    };

    return (
        <div className="space-y-6">
            {/* Filter Dropdowns */}
            <TechnicianFilters />

            {/* Fetching State Indicator */}
            {isFetching && (
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium px-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Updating technicians list...</span>
                </div>
            )}

            {/* Technicians Grid */}
            {technicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {technicians.map((technician, index) => {
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
                        We could not find any technicians matching your search criteria. Try adjusting your filters.
                    </p>
                </div>
            )}

            {/* Professional Pagination Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                {/* Meta Info & Per Page Dropdown */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
                    <span>
                        Showing Page <strong className="text-slate-900 font-semibold">{meta.page}</strong> of{" "}
                        <strong className="text-slate-900 font-semibold">{meta.totalPage || 1}</strong> ({meta.total || technicians.length} total)
                    </span>

                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                        <span className="text-slate-500">Per page:</span>
                        <Select
                            value={String(meta.limit || 9)}
                            onValueChange={handleLimitChange}
                        >
                            <SelectTrigger className="h-8 w-16 text-xs bg-slate-50 border-slate-200 text-slate-800 font-medium focus:ring-1 focus:ring-blue-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                                <SelectItem value="18">18</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Next / Prev & Page Numbers */}
                <div className="flex items-center gap-2">
                    {/* Prev Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={meta.page <= 1}
                        onClick={() => handlePageChange(meta.page - 1)}
                        className="h-9 px-3.5 text-xs font-medium rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:opacity-100 transition-all shadow-xs"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 text-slate-500 group-disabled:text-slate-300" />
                        Prev
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: meta.totalPage || 1 }, (_, i) => i + 1).map((pageNum) => (
                            <Button
                                key={pageNum}
                                variant={pageNum === meta.page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className={`h-9 w-9 text-xs rounded-xl font-semibold transition-all p-0 ${pageNum === meta.page
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                {pageNum}
                            </Button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={meta.page >= (meta.totalPage || 1)}
                        onClick={() => handlePageChange(meta.page + 1)}
                        className="h-9 px-3.5 text-xs font-medium rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:opacity-100 transition-all shadow-xs"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1 text-slate-500 group-disabled:text-slate-300" />
                    </Button>
                </div>
            </div>
        </div>
    );
}