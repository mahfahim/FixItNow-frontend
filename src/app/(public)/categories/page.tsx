// src/app/(public)/categories/page.tsx
import CategoryGrid from "@/components/share/public-category-grid";
import { getAllCategories } from "@/actions/category.actions";
import { ICategory, IPaginationOptions } from "@/types";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        searchTerm?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const searchKeyword = resolvedParams.searchTerm || resolvedParams.search || "";
    const currentPage = Math.max(1, Number(resolvedParams.page) || 1);
    const limit = Math.max(1, Number(resolvedParams.limit) || 8);

    // Fetch categories from server action
    const response = await getAllCategories({
        searchTerm: searchKeyword,
        isActive: true,
        page: currentPage,
        limit,
    });

    const categories: ICategory[] = (response.data as ICategory[]) || [];

    const meta: IPaginationOptions = {
        page: response.meta?.page ?? currentPage,
        limit: response.meta?.limit ?? limit,
        total: response.meta?.total ?? categories.length,
        totalPage: response.meta?.totalPage ?? (Math.ceil(categories.length / limit) || 1),
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CategoryGrid
                    categories={categories}
                    meta={meta}
                    searchTerm={searchKeyword}
                />
            </div>
        </div>
    );
}