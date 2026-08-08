// src/components/share/public-servicesGrid.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    ArrowRight,
    Tag,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2,
} from "lucide-react";
import { IService, IPaginationOptions } from "@/types";

interface ServicesGridProps {
    services: IService[];
    meta?: IPaginationOptions;
    searchTerm?: string;
    categoryIdTerm?: string;
    title?: string;
    subtitle?: string;
    baseUrl?: string;
    currencySymbol?: string;
    placeholderImage?: string;
}

const getValidImageUrl = (images?: string[], fallback = "/images/placeholder-service.jpg") => {
    if (!images || images.length === 0) return fallback;
    const firstImage = images[0];
    if (
        firstImage.startsWith("http://") ||
        firstImage.startsWith("https://") ||
        firstImage.startsWith("/")
    ) {
        return firstImage;
    }
    return fallback;
};

export default function ServicesGrid({
    services = [],
    meta,
    searchTerm = "",
    categoryIdTerm = "",
    title,
    subtitle = "Find verified expert technicians for all your home repair & maintenance needs.",
    baseUrl = "/services",
    currencySymbol = "$",
    placeholderImage = "/images/placeholder-service.jpg",
}: ServicesGridProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [query, setQuery] = useState(searchTerm);

    const currentPage = meta?.page ?? 1;
    const limit = meta?.limit ?? 8;
    const totalServices = meta?.total ?? services.length;
    const totalPages = meta?.totalPage ?? (Math.ceil(totalServices / limit) || 1);

    // Search Handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (query.trim()) {
            params.set("search", query.trim());
        } else {
            params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1 on new search

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // Clear Search Input
    const handleClear = () => {
        setQuery("");
        const params = new URLSearchParams(searchParams.toString());
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
            ? `Search Results for "${searchTerm}"`
            : "Explore Our Services";

    return (
        <div className="space-y-8">
            {/* Header & Search Section */}
            <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {headerTitle}
                        </h1>
                        {subtitle && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                            {totalServices}{" "}
                            {totalServices === 1 ? "Service" : "Services"}{" "}
                            Available
                        </span>
                    </div>
                </div>

                {/* Interactive Search Bar */}
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for services (e.g. AC Repair, Plumbing)..."
                            className="w-full pl-11 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-20 p-1 text-slate-400 hover:text-slate-600 rounded-full transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 disabled:opacity-70"
                        >
                            {isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                "Search"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Services Grid */}
            {services.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service: IService) => {
                            const categoryName =
                                typeof service.category === "object"
                                    ? service.category?.name
                                    : null;

                            return (
                                <div
                                    key={service.id}
                                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Image Box */}
                                        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                                            <Image
                                                src={getValidImageUrl(service.images, placeholderImage)}
                                                alt={service.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {categoryName && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                                                        <Tag className="w-3 h-3 text-indigo-600" />
                                                        {categoryName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Box */}
                                        <div className="p-5 space-y-2">
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                {service.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer & Price */}
                                    <div className="p-5 pt-0 mt-2">
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                                    Price
                                                </span>
                                                <span className="text-lg font-black text-slate-900">
                                                    {currencySymbol}{Number(service.price).toLocaleString()}
                                                </span>
                                            </div>
                                            {/* 🛠️ UPDATED: Browse Service Button Redirecting to Single Service Page */}
                                            <Link
                                                href={`/customer/services/${service.id}`}
                                                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                                            >
                                                Browse Service
                                                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination UI Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm gap-4">
                            <p className="text-xs sm:text-sm text-slate-500">
                                Showing page{" "}
                                <span className="font-bold text-slate-800">
                                    {currentPage}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-slate-800">
                                    {totalPages}
                                </span>
                            </p>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={buildPaginationUrl(currentPage - 1)}
                                    aria-disabled={currentPage <= 1}
                                    className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${currentPage <= 1
                                        ? "border-slate-200 text-slate-300 pointer-events-none"
                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </Link>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (pageNum) => (
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
                                        )
                                    )}
                                </div>

                                <Link
                                    href={buildPaginationUrl(currentPage + 1)}
                                    aria-disabled={currentPage >= totalPages}
                                    className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${currentPage >= totalPages
                                        ? "border-slate-200 text-slate-300 pointer-events-none"
                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Empty State */
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">
                            No Services Found
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                            We couldn&apos;t find any services matching &quot;
                            {searchTerm || categoryIdTerm}&quot;. Try searching with another
                            keyword.
                        </p>
                    </div>
                    {(searchTerm || categoryIdTerm) && (
                        <button
                            onClick={handleClear}
                            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-indigo-700 transition"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}