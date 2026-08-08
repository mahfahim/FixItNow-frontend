// src/app/(dashboardGroup)/customer/_components/technician-filters.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw } from "lucide-react";
import { useToast } from "@/providers/toast-provider";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const RATING_OPTIONS = [
    { label: "All Ratings", value: "all" },
    { label: "4.5★ & above", value: "4.5" },
    { label: "4.0★ & above", value: "4.0" },
    { label: "3.5★ & above", value: "3.5" },
];

const SORT_OPTIONS = [
    { label: "Newest First", value: "createdAt-desc" },
    { label: "Oldest First", value: "createdAt-asc" },
    { label: "Rating: High to Low", value: "averageRating-desc" },
    { label: "Experience: High to Low", value: "yearsOfExperience-desc" },
    { label: "Hourly Rate: Low to High", value: "hourlyRate-asc" },
    { label: "Hourly Rate: High to Low", value: "hourlyRate-desc" },
];

export function TechnicianFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, info } = useToast();

    const [search, setSearch] = useState(searchParams.get("search") || searchParams.get("searchTerm") || "");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [minRating, setMinRating] = useState(searchParams.get("minRating") || "all");
    const [sortOption, setSortOption] = useState(() => {
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        return `${sortBy}-${sortOrder}`;
    });

    const handleFilterSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (search.trim()) params.set("search", search.trim());
        else params.delete("search");

        if (city.trim()) params.set("city", city.trim());
        else params.delete("city");

        if (minRating && minRating !== "all") params.set("minRating", minRating);
        else params.delete("minRating");

        if (sortOption) {
            const [sortBy, sortOrder] = sortOption.split("-");
            if (sortBy) params.set("sortBy", sortBy);
            if (sortOrder) params.set("sortOrder", sortOrder);
        }

        params.set("page", "1"); 
        router.push(`?${params.toString()}`);
        success("Filters Applied", "Technician search parameters updated.");
    };

    const handleReset = () => {
        setSearch("");
        setCity("");
        setMinRating("all");
        setSortOption("createdAt-desc");
        router.push("?");
        info("Filters Reset", "All active filters have been cleared.");
    };

    const selectedRatingLabel =
        RATING_OPTIONS.find((r) => r.value === minRating)?.label || "All Ratings";
    const selectedSortLabel =
        SORT_OPTIONS.find((s) => s.value === sortOption)?.label || "Newest First";

    const hasActiveFilters =
        Boolean(search) ||
        Boolean(city) ||
        (Boolean(minRating) && minRating !== "all") ||
        sortOption !== "createdAt-desc";

    return (
        <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-sm py-0">
            <CardHeader className="p-4 md:p-5 border-b border-slate-100 pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-800">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span>Filter & Search Technicians</span>
                </div>
                {hasActiveFilters && (
                    <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                        Active Filters
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="p-4 md:p-5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Search Input */}
                    <div>
                        <Input
                            type="text"
                            placeholder="Search name or bio..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleFilterSubmit()}
                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 h-10 rounded-xl text-sm"
                        />
                    </div>

                    {/* City Input */}
                    <div>
                        <Input
                            type="text"
                            placeholder="Filter by City..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleFilterSubmit()}
                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 h-10 rounded-xl text-sm"
                        />
                    </div>

                    {/* Minimum Rating Dropdown */}
                    <div>
                        <Select
                            value={minRating}
                            onValueChange={(val) => setMinRating(val || "all")}
                        >
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-slate-900 h-10 rounded-xl text-sm">
                                <SelectValue>{selectedRatingLabel}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                {RATING_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Options Dropdown */}
                    <div>
                        <Select
                            value={sortOption}
                            onValueChange={(val) => setSortOption(val || "createdAt-desc")}
                        >
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-slate-900 h-10 rounded-xl text-sm">
                                <SelectValue>{selectedSortLabel}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                {SORT_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleFilterSubmit}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl h-10 gap-2 shadow-sm"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleReset}
                            title="Reset Filters"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 h-10 w-10 rounded-xl shrink-0"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}