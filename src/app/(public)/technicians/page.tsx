// src/app/(public)/technicians/page.tsx
import { ShieldCheck, UserX } from "lucide-react";
import { getAllTechnicians } from "@/actions/technician.actions";
import { TechnicianCard } from "@/components/share/public-technician-card";
import { TechnicianFilters } from "@/components/share/public-technician-filters";
import { Pagination } from "@/components/share/public-pagination";
import { ITechnician, IPaginationOptions } from "@/types";

export const metadata = {
    title: "Expert Technicians | FixItNow",
    description: "Browse and hire verified professional technicians near you.",
};

interface PageProps {
    searchParams: Promise<{
        search?: string;
        city?: string;
        district?: string;
        minRating?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function TechniciansPage({ searchParams }: PageProps) {
    // Extract URL search filters
    const filters = await searchParams;

    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 8);

    const result = await getAllTechnicians({
        search: filters.search,
        city: filters.city,
        district: filters.district,
        minRating: filters.minRating ? Number(filters.minRating) : undefined,
        page,
        limit,
    });

    const technicians: ITechnician[] = Array.isArray(result?.data)
        ? (result.data as ITechnician[])
        : [];

    const meta: IPaginationOptions = {
        page: result?.meta?.page ?? page,
        limit: result?.meta?.limit ?? limit,
        total: result?.meta?.total ?? technicians.length,
        totalPage:
            result?.meta?.totalPage ??
            (Math.ceil((result?.meta?.total ?? technicians.length) / limit) || 1),
    };

    const totalPages = meta.totalPage || 1;
    const totalItems = meta.total || 0;

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                        <ShieldCheck className="h-4 w-4" />
                        Verified & Background Checked
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Our Professional Technicians
                    </h1>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Find experienced, top-rated experts near you for instant home repairs,
                        electrical, plumbing, and maintenance services.
                    </p>
                </div>

                {/* Client Filters Component */}
                <TechnicianFilters />

                {/* Technicians Grid / Empty State */}
                {technicians.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto shadow-sm">
                        <UserX className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-slate-900 mb-1">
                            No Technicians Available
                        </h3>
                        <p className="text-xs text-slate-500">
                            We could not find any technicians matching your criteria. Please try
                            adjusting your search or filters!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {technicians.map((tech: ITechnician) => (
                                <TechnicianCard key={tech.id} technician={tech} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                limit={limit}
                                searchParams={filters}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}