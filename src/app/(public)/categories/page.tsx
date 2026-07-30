import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Layers, LayoutGrid } from "lucide-react";
import { getCategories } from "../_actions/category.actions";
import { ICategory } from "@/types";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        searchTerm?: string;
    }>;
}


const getValidIconUrl = (iconUrl?: string | null) => {
    if (!iconUrl) return null;
    if (
        iconUrl.startsWith("http://") ||
        iconUrl.startsWith("https://") ||
        iconUrl.startsWith("/")
    ) {
        return iconUrl;
    }
    return null;
};

export default async function CategoriesPage({ searchParams }: PageProps) {

    const resolvedParams = await searchParams;
    const searchKeyword = resolvedParams.searchTerm || resolvedParams.search || "";


    const categories: ICategory[] = await getCategories({
        searchTerm: searchKeyword,
        isActive: true,
    });

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Service Categories
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {searchKeyword
                                ? `Categories for "${searchKeyword}"`
                                : "Browse All Categories"}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Select a category to view specialised technicians and available services.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                            {categories.length} {categories.length === 1 ? "Category" : "Categories"}
                        </span>
                    </div>
                </div>

                {/* Category Grid */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category: ICategory) => {
                            const iconSrc = getValidIconUrl(category.icon);

                            const serviceCount = (category as ICategory & { _count?: { services?: number } })._count?.services ?? 0;

                            return (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div className="space-y-4">
                                        {/* Icon Container */}
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-100/80 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                            {iconSrc ? (
                                                <Image
                                                    src={iconSrc}
                                                    alt={category.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <Layers className="w-7 h-7 text-indigo-600" />
                                            )}
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-1.5">
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                {category.name}
                                            </h3>
                                            {category.description ? (
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                    {category.description}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">
                                                    Explore top-rated services in this category.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Link & Services Badge */}
                                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                            {serviceCount} {serviceCount === 1 ? "Service" : "Services"}
                                        </span>

                                        <Link
                                            href={`/services?categoryId=${category.id}`}
                                            className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 gap-1 group/link"
                                        >
                                            Explore
                                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-800">
                                No Categories Found
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                                We couldn&apos;t find any categories matching &quot;{searchKeyword}&quot;. Try searching with another keyword.
                            </p>
                        </div>
                        <Link
                            href="/categories"
                            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-indigo-700 transition"
                        >
                            Reset Search
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}