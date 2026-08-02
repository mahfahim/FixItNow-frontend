import { getAllServices } from "@/actions/services.actions";
import { getMyProfile } from "@/actions/getMe.action";
import { getAllCategories } from "@/actions/category.actions"; // 👈 আপনার প্রজেক্টের ক্যাটাগরি ফেচিং অ্যাকশন
import { ServiceCustomerCard, IService } from "../_components/service-customer";
import { ServiceFilters, ICategoryOption } from "../_components/service-filters";
import { Wrench, AlertCircle } from "lucide-react";
import { IServiceFilterOptions } from "@/types/service.types";

interface PageProps {
    searchParams: Promise<{
        searchTerm?: string;
        category?: string;
        page?: string;
        limit?: string;
        technicianId?: string;
        minPrice?: string;
        maxPrice?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}

interface IUserProfile {
    id?: string;
    role?: string;
    technicianProfile?: {
        id?: string;
    };
}

export default async function ServicesPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;

    // ১. সমান্তরালে প্রফাইল ও ক্যাটাগরি ফেচ করুন
    const [profileRes, categoriesRes] = await Promise.all([
        getMyProfile(),
        getAllCategories ? getAllCategories() : Promise.resolve({ data: [] }),
    ]);

    const currentUser: IUserProfile | undefined = profileRes?.data || profileRes?.result;
    const categories: ICategoryOption[] = categoriesRes?.data || categoriesRes?.result || [];

    // ২. URL Param অনুযায়ী Backend Filter Options তৈরি করুন
    const queryFilters: IServiceFilterOptions = {
        search: resolvedSearchParams.searchTerm,
        categoryId: resolvedSearchParams.category,
        minPrice: resolvedSearchParams.minPrice,
        maxPrice: resolvedSearchParams.maxPrice,
        sortBy: resolvedSearchParams.sortBy || "createdAt",
        sortOrder: resolvedSearchParams.sortOrder || "desc",
        page: resolvedSearchParams.page,
        limit: resolvedSearchParams.limit,
    };

    const isTechnician = currentUser?.role?.toUpperCase() === "TECHNICIAN";

    if (isTechnician) {
        const technicianId = currentUser?.technicianProfile?.id || currentUser?.id;
        if (technicianId) {
            queryFilters.technicianId = technicianId;
        }
    }

    // ৩. ফিল্টার অনুযায়ী সার্ভিসসমূহ লোড করুন
    const res = await getAllServices(queryFilters);
    const services: IService[] = res?.data || res?.result || (Array.isArray(res) ? res : []);

    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Wrench className="h-6 w-6 text-blue-500" />
                        {isTechnician ? "My Created Services" : "Browse Available Services"}
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {isTechnician
                            ? "View and manage all services offered by you."
                            : "Choose a service and book expert technicians instantly."}
                    </p>
                </div>
            </div>

            {/* Complete Dropdown Search & Filter Component */}
            <ServiceFilters categories={categories} />

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