// src/app/(dashboardGroup)/admin/categories/[category-id]/edit/page.tsx

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryForm from "../../../_components/CategoryForm";
import { ICategory } from "@/types";

interface EditCategoryPageProps {
    params: Promise<{
        "category-id": string;
    }>;
}

async function getCategoryById(id: string): Promise<ICategory | null> {
    try {
        const cookieStore = await cookies();
        const token =
            cookieStore.get("accessToken")?.value ||
            cookieStore.get("token")?.value;

        const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            console.error("Backend API URL is not defined in environment variables.");
            return null;
        }

        const res = await fetch(`${apiUrl}/api/categories/${id}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data?.data || null;
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: EditCategoryPageProps): Promise<Metadata> {
    const { "category-id": categoryId } = await params;
    const category = await getCategoryById(categoryId);

    if (!category) {
        return { title: "Category Not Found" };
    }

    return {
        title: `Edit ${category.name} | Admin Dashboard`,
    };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { "category-id": categoryId } = await params;
    const category = await getCategoryById(categoryId);

    if (!category) {
        notFound();
    }

    return (
        <div className="p-6 w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Edit Category</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Update details for{" "}
                    <span className="font-medium text-slate-700">{category.name}</span>.
                </p>
            </div>

            <CategoryForm initialData={category} isEditing={true} />
        </div>
    );
}