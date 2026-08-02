// src/app/(dashboardGroup)/technician/services/create/page.tsx
import Link from "next/link";
import { getMyProfile } from "@/actions/getMe.action";
import { ServiceForm } from "../../_components/service-form";
import { ArrowLeft } from "lucide-react";
import { ICategory } from "@/types";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getCategories(): Promise<ICategory[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/categories`, { cache: "no-store" });
        const data = await res.json();
        return data?.data || data?.result || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export default async function CreateServicePage() {
    const [profileRes, categories] = await Promise.all([
        getMyProfile(),
        getCategories(),
    ]);

    const user = profileRes?.data || profileRes?.result;
    const technicianId = user?.technicianProfile?.id || user?.id;

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
                <h1 className="text-2xl font-bold text-slate-900">Add New Service</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Fill in the details below to publish a new service offer.
                </p>
            </div>

            <ServiceForm categories={categories} technicianId={technicianId} />
        </div>
    );
}