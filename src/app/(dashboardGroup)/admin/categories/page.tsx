// src/app/(dashboardGroup)/admin/categories/page.tsx
import { Metadata } from "next";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { ICategory } from "@/types";
import { getAllCategories } from "@/actions/category.actions";
import { AdminCategoriesClient } from "@/components/share/admin-categories-client";

export const metadata: Metadata = {
    title: "Categories | Admin Dashboard",
    description: "Manage service categories for the platform.",
};

async function fetchCategories(): Promise<ICategory[]> {
    try {
        const res = await getAllCategories({ useCache: false });
        if (res?.success && Array.isArray(res.data)) {
            return res.data as ICategory[];
        }
        return [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export default async function CategoriesPage() {
    const queryClient = new QueryClient();


    await queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const initialCategories = queryClient.getQueryData<ICategory[]>(["categories"]) || [];

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminCategoriesClient initialCategories={initialCategories} />
        </HydrationBoundary>
    );
}