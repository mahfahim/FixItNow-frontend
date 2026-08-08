"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    ArrowRight,
    Layers,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2,
} from "lucide-react";
import { ICategory, IPaginationOptions } from "@/types";

interface CategoryGridProps {
    categories: ICategory[];
    meta?: IPaginationOptions;
    searchTerm?: string;
    title?: string;
    subtitle?: string;
    baseUrl?: string;
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

export default function CategoryGrid({
    categories = [],
    meta,
    searchTerm = "",
    title,
    subtitle = "Select a category to view specialised technicians and available services.",
    baseUrl = "/categories",
}: CategoryGridProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [query, setQuery] = useState(searchTerm);

    const currentPage = meta?.page ?? 1;
    const limit = meta?.limit ?? 8;
    const totalCategories = meta?.total ?? categories.length;
    const totalPages = meta?.totalPage ?? (Math.ceil(totalCategories / limit) || 1);

    // Search Handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (query.trim()) {
            params.set("searchTerm", query.trim());
        } else {
            params.delete("searchTerm");
            params.delete("search");
        }
        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // Clear Search Input
    const handleClear = () => {
        setQuery("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("searchTerm");
        params.delete("search");
        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // Dynamic Pagination URL Builder
    const buildPaginationUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    const headerTitle = title
        ? title
        : searchTerm
            ? `Categories for "${searchTerm}"`
            : "Browse All Categories";

    return (
        <div className="space-y-8">
            {/* Header & Search Controls */}
            <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Service Categories
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {headerTitle}
                        </h1>
                        {subtitle && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Interactive Search Bar */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rounded-full transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-2xl transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Search"
                            )}
                        </button>
                    </form>
                </div>

                {/* Result Counter Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                        {totalCategories} {totalCategories === 1 ? "Category" : "Categories"} Found
                    </span>
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            </div>

            {/* Category Grid */}
            {categories.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category: ICategory) => {
                            const iconSrc = getValidIconUrl(category.icon);
                            const serviceCount =
                                (category as ICategory & { _count?: { services?: number } })._count?.services ??
                                category.services?.length ??
                                0;

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

                    {/* Pagination Section (Always visible when items exist) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm gap-4">
                        <p className="text-xs sm:text-sm text-slate-500">
                            Showing page{" "}
                            <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
                            <span className="font-bold text-slate-800">{totalPages}</span>
                        </p>

                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <Link
                                href={buildPaginationUrl(currentPage - 1)}
                                aria-disabled={currentPage <= 1}
                                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${currentPage <= 1
                                        ? "border-slate-200 text-slate-300 pointer-events-none opacity-50"
                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Prev
                            </Link>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <Link
                                        key={pageNum}
                                        href={buildPaginationUrl(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-xl border transition ${pageNum === currentPage
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                ))}
                            </div>

                            {/* Next Button */}
                            <Link
                                href={buildPaginationUrl(currentPage + 1)}
                                aria-disabled={currentPage >= totalPages}
                                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${currentPage >= totalPages
                                        ? "border-slate-200 text-slate-300 pointer-events-none opacity-50"
                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </>
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
                            We couldn&apos;t find any categories matching &quot;{searchTerm}&quot;. Try searching with another keyword.
                        </p>
                    </div>
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-indigo-700 transition"
                        >
                            Reset Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}