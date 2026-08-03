// src/app/(dashboardGroup)/customer/_components/service-filters.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

export interface ICategoryOption {
    id: string;
    name: string;
}

interface ServiceFiltersProps {
    initialCategories?: ICategoryOption[];
}

const fetchCategories = async (): Promise<ICategoryOption[]> => {
    const res = await fetch("/api/categories");
    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }
    const data = await res.json();
    return data?.data || data || [];
};

// ইউজার ফ্রেন্ডলি লেবেল ম্যাপ
const SORT_LABELS: Record<string, string> = {
    "createdAt-desc": "Newest First",
    "createdAt-asc": "Oldest First",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "title-asc": "Title: A to Z",
};

const PRICE_LABELS: Record<string, string> = {
    "all": "All Prices",
    "0-500": "Under ৳500",
    "500-1000": "৳500 - ৳1000",
    "1000-3000": "৳1000 - ৳3000",
    "3000-5000": "৳3000 - ৳5000",
    "5000-": "Above ৳5000",
};

export function ServiceFilters({
    initialCategories = [],
}: ServiceFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, info } = useToast();

    const {
        data: categories = initialCategories,
        isLoading: isCategoriesLoading,
    } = useQuery<ICategoryOption[]>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        initialData: initialCategories.length > 0 ? initialCategories : undefined,
        enabled: initialCategories.length === 0,
        staleTime: 1000 * 60 * 10,
    });

    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("searchTerm") || ""
    );
    const [category, setCategory] = useState(
        searchParams.get("category") || ""
    );
    const [minPrice, setMinPrice] = useState(
        searchParams.get("minPrice") || ""
    );
    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") || ""
    );
    const [sortOption, setSortOption] = useState(() => {
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        return `${sortBy}-${sortOrder}`;
    });

    const handleFilterSubmit = () => {
        const params = new URLSearchParams();

        if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
        if (category && category !== "all") params.set("category", category);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        if (sortOption) {
            const [sortBy, sortOrder] = sortOption.split("-");
            if (sortBy) params.set("sortBy", sortBy);
            if (sortOrder) params.set("sortOrder", sortOrder);
        }

        router.push(`?${params.toString()}`);
        success("Filters Applied", "Service search parameters updated.");
    };

    const handleReset = () => {
        setSearchTerm("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSortOption("createdAt-desc");
        router.push("?");
        info("Filters Reset", "All active filters have been cleared.");
    };

    const handlePriceRangeChange = (value: string | null) => {
        if (!value || value === "all") {
            setMinPrice("");
            setMaxPrice("");
            return;
        }
        const [min, max] = value.split("-");
        setMinPrice(min || "");
        setMaxPrice(max || "");
    };

    const currentPriceRangeValue =
        minPrice || maxPrice ? `${minPrice}-${maxPrice}` : "all";

    // ডিসপ্লে করার জন্য লেবেল নির্ধারণ
    const selectedCategoryName =
        categories.find((cat) => cat.id === category)?.name || "All Categories";
    const selectedPriceLabel = PRICE_LABELS[currentPriceRangeValue] || "All Prices";
    const selectedSortLabel = SORT_LABELS[sortOption] || "Newest First";

    const hasActiveFilters =
        Boolean(searchTerm) ||
        Boolean(category) ||
        Boolean(minPrice) ||
        Boolean(maxPrice) ||
        sortOption !== "createdAt-desc";

    return (
        <Card className="bg-slate-900 border-slate-800 text-white rounded-2xl shadow-lg py-0">
            <CardHeader className="p-4 md:p-5 border-b border-slate-800 pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2 font-semibold text-sm">
                    <Filter className="w-4 h-4 text-blue-500" />
                    <span>Filter & Search Services</span>
                </div>
                {hasActiveFilters && (
                    <Badge
                        variant="outline"
                        className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30"
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
                            placeholder="Search service title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleFilterSubmit()}
                            className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 h-10 rounded-xl text-sm"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <Select
                            value={category || "all"}
                            onValueChange={(val) => setCategory(!val || val === "all" ? "" : val)}
                            disabled={isCategoriesLoading}
                        >
                            <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-slate-200 h-10 rounded-xl text-sm">
                                <SelectValue>{selectedCategoryName}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="all">All Categories</SelectItem>
                                {isCategoriesLoading ? (
                                    <div className="flex items-center justify-center p-2 text-slate-400 gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        <span className="text-xs">Loading categories...</span>
                                    </div>
                                ) : (
                                    categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Filter Dropdown */}
                    <div>
                        <Select
                            value={currentPriceRangeValue}
                            onValueChange={handlePriceRangeChange}
                        >
                            <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-slate-200 h-10 rounded-xl text-sm">
                                <SelectValue>{selectedPriceLabel}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="0-500">Under ৳500</SelectItem>
                                <SelectItem value="500-1000">৳500 - ৳1000</SelectItem>
                                <SelectItem value="1000-3000">৳1000 - ৳3000</SelectItem>
                                <SelectItem value="3000-5000">৳3000 - ৳5000</SelectItem>
                                <SelectItem value="5000-">Above ৳5000</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Options Dropdown */}
                    <div>
                        <Select
                            value={sortOption}
                            onValueChange={(val) => setSortOption(val ?? "createdAt-desc")}
                        >
                            <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-slate-200 h-10 rounded-xl text-sm">
                                <SelectValue>{selectedSortLabel}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                <SelectItem value="title-asc">Title: A to Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleFilterSubmit}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl h-10 gap-2 shadow-md shadow-blue-600/20"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleReset}
                            title="Reset Filters"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 h-10 w-10 rounded-xl shrink-0"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}