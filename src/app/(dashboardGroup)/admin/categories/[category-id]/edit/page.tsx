// src/app/(dashboardGroup)/admin/categories/[category-id]/edit/page.tsx

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
// Fix: Corrected the import path to point to CategoryForm, not CategoryTable
import CategoryForm from "../../../_components/CategoryForm";

// Fetcher for single category
async function getCategoryById(id: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories/${id}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        cache: "no-store", 
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.data;
}


export default async function EditCategoryPage({ params }: { params: Promise<{ "category-id": string }> | { "category-id": string } }) {
    
    const resolvedParams = await params;
    const categoryId = resolvedParams["category-id"];

    const category = await getCategoryById(categoryId);

    if (!category) {
        notFound();
    }

    return (
        <div className="p-6 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
                <p className="text-sm text-gray-500 mt-1">Update details for {category.name}.</p>
            </div>

            <CategoryForm initialData={category} isEditing={true} />
        </div>
    );
}