import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceById } from "@/actions/services.actions";
import { ServiceForm } from "../../_components/service-form";
import { ArrowLeft, Wrench } from "lucide-react";
import { ICategory, IService, ActionResponse } from "@/types";

const BASE_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getCategories(): Promise<ICategory[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/categories`, { cache: "no-store" });
        if (!res.ok) return [];
        const data = await res.json();
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

interface PageProps {
    searchParams: Promise<{
        id?: string;
    }>;
}

export default async function EditServicePage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const serviceId = resolvedSearchParams.id;

    if (!serviceId) {
        notFound();
    }

    const [serviceRes, categories] = await Promise.all([
        getServiceById(serviceId) as Promise<ActionResponse<IService>>,
        getCategories(),
    ]);

    const service: IService | null = serviceRes?.data || null;

    if (!service) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Top Navigation Back Link */}
            <div>
                <Link
                    href="/technician/services"
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Services
                </Link>
            </div>

            {/* Page Header */}
            <div className="flex items-center gap-3.5 border-b border-slate-200/80 pb-5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/80">
                    <Wrench className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Service</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Update your service details, pricing, estimated duration, or availability.
                    </p>
                </div>
            </div>

            {/* Service Form Component */}
            <ServiceForm categories={categories} initialData={service} />
        </div>
    );
}