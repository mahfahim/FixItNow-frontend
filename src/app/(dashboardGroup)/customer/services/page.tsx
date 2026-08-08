// src/app/(dashboardGroup)/customer/services/page.tsx
import { getAllServices } from "@/actions/services.actions";
import ServicesGrid from "@/components/share/cust-servicesGrid";
import { IService, IPaginationOptions } from "@/types";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        categoryId?: string;
        technicianId?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const searchTerm = resolvedParams.search || "";
    const categoryIdTerm =
        resolvedParams.categoryId || resolvedParams.category || "";


    const technicianIdTerm = resolvedParams.technicianId || "";


    const currentPage = Math.max(1, Number(resolvedParams.page) || 1);
    const limit = Math.max(1, Number(resolvedParams.limit) || 8);


    const response = await getAllServices({
        search: searchTerm,
        categoryId: categoryIdTerm,
        technicianId: technicianIdTerm || undefined,
        page: currentPage,
        limit,
    });

    const services: IService[] = (response?.data as IService[]) || [];

    const meta: IPaginationOptions = {
        page: response?.meta?.page ?? currentPage,
        limit: response?.meta?.limit ?? limit,
        total: response?.meta?.total ?? services.length,
        totalPage:
            response?.meta?.totalPage ??
            (Math.ceil(services.length / limit) || 1),
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ServicesGrid
                    services={services}
                    meta={meta}
                    searchTerm={searchTerm}
                    categoryIdTerm={categoryIdTerm}
                    baseUrl="/services"
                />
            </div>
        </div>
    );
}