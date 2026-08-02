// src/app/(dashboardGroup)/admin/categories/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import CategoryTable from "../_components/CategoryTable";

async function fetchCategories() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/categories`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { tags: ["categories"] }
    });

    if (!res.ok) return { data: [] };
    return res.json();
}

export default async function CategoriesPage() {
    const response = await fetchCategories();
    const categories = response?.data || [];

    return (
        <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage service categories for the platform.
                    </p>
                </div>
                <Link
                    href="/admin/categories/create"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    + Add Category
                </Link>
            </div>

            <CategoryTable categories={categories} />
        </div>
    );
}