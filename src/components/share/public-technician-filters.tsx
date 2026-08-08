
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, Star, RotateCcw, Filter } from "lucide-react";
import { useState, useTransition, useEffect } from "react";

export function TechnicianFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [district, setDistrict] = useState(searchParams.get("district") || "");
    const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");

    const updateFilters = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Always reset to page 1 on filter/search change
        params.set("page", "1");

        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const handleReset = () => {
        setSearch("");
        setCity("");
        setDistrict("");
        setMinRating("");
        startTransition(() => {
            router.push(pathname);
        });
    };

    const hasActiveFilters = Boolean(
        searchParams.get("search") ||
        searchParams.get("city") ||
        searchParams.get("district") ||
        searchParams.get("minRating")
    );

    return (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 mb-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Filter className="w-4 h-4 text-indigo-600" />
                    Filter & Search Technicians
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium transition"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search name, skills..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            updateFilters({ search: e.target.value });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                </div>

                {/* City Filter */}
                <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="City (e.g. Dhaka)"
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            updateFilters({ city: e.target.value });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                </div>

                {/* District Filter */}
                <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="District (e.g. Gulshan)"
                        value={district}
                        onChange={(e) => {
                            setDistrict(e.target.value);
                            updateFilters({ district: e.target.value });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                </div>

                {/* Min Rating Filter */}
                <div className="relative">
                    <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                        value={minRating}
                        onChange={(e) => {
                            setMinRating(e.target.value);
                            updateFilters({ minRating: e.target.value });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition appearance-none cursor-pointer"
                    >
                        <option value="">All Ratings</option>
                        <option value="4.5">4.5 & Above ★</option>
                        <option value="4.0">4.0 & Above ★</option>
                        <option value="3.5">3.5 & Above ★</option>
                        <option value="3.0">3.0 & Above ★</option>
                    </select>
                </div>
            </div>
        </div>
    );
}