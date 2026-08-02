// src/app/(dashboardGroup)/technician/services/edit/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceById } from "@/actions/services.actions";
import { ServiceForm } from "../../_components/service-form";
import { ArrowLeft } from "lucide-react";
import { ICategory, IService } from "@/types";

const BASE_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getCategories(): Promise<ICategory[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/categories`, { cache: "no-store" });
        if (!res.ok) return [];
        const data = await res.json();
        return data?.data || data?.result || [];
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
        getServiceById(serviceId),
        getCategories(),
    ]);

    const service: IService | null = serviceRes?.data || serviceRes?.result || null;

    if (!service) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/technician/services"
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Services
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Edit Service</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Update your service details, price, duration or availability status.
                </p>
            </div>

            <ServiceForm categories={categories} initialData={service} />
        </div>
    );
}