// src/app/(dashboardGroup)/admin/categories/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import CategoryTable from "../_components/CategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ICategory } from "@/types";
import { getAllCategories } from "@/actions/category.actions";

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

    // Prefetch data on the server into the QueryCache
    await queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="p-6 w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Manage service categories for the platform.
                        </p>
                    </div>
                    <Link href="/admin/categories/create">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </Link>
                </div>

                <CategoryTable />
            </div>
        </HydrationBoundary>
    );
}