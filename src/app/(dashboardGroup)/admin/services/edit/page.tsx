// src/app/(dashboardGroup)/admin/services/edit/page.tsx
// src/app/(dashboardGroup)/admin/services/edit/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceById } from "@/actions/services.actions";
import { getAllCategories } from "@/actions/category.actions";
import { ServiceForm } from "../../_components/service-form_";
import { ArrowLeft } from "lucide-react";
import { ActionResponse, ICategory, IService } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params?: Promise<{ id?: string }>;
  searchParams?: Promise<{ id?: string }>;
}

export default async function EditServicePage({ params, searchParams }: PageProps) {
  const resolvedParams = params ? await params : undefined;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const serviceId = resolvedParams?.id || resolvedSearchParams?.id;

  if (!serviceId) {
    notFound();
  }

  const [serviceRes, categoriesRes] = await Promise.all([
    getServiceById(serviceId) as Promise<ActionResponse<IService>>,
    getAllCategories({ useCache: false }) as Promise<ActionResponse<ICategory[]>>,
  ]);

  const service = serviceRes?.data || null;
  const categories = categoriesRes?.data || [];

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Service</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Update your service details, pricing, estimated duration, or availability.
        </p>
      </div>

      {/* Service Form Component */}
      <ServiceForm
        categories={categories}
        initialData={service}
        technicianId={service.technicianId}
        redirectPath="/admin/services"
      />
    </div>
  );
}