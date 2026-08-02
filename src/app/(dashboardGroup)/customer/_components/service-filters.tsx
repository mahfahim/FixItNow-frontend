"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw } from "lucide-react";

export interface ICategoryOption {
    id: string;
    name: string;
}

interface ServiceFiltersProps {
    categories?: ICategoryOption[];
}

export function ServiceFilters({ categories = [] }: ServiceFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URLSearchParams থেকে কারেন্ট স্টেট ফিল ফিল করা
    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [sortOption, setSortOption] = useState(() => {
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        return `${sortBy}-${sortOrder}`;
    });

    // URL ডায়নামিকালি পরিবর্তন করার ফাংশন
    const handleFilterSubmit = () => {
        const params = new URLSearchParams();

        if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
        if (category) params.set("category", category);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        if (sortOption) {
            const [sortBy, sortOrder] = sortOption.split("-");
            if (sortBy) params.set("sortBy", sortBy);
            if (sortOrder) params.set("sortOrder", sortOrder);
        }

        router.push(`?${params.toString()}`);
    };

    // ফিল্টার রিসেট ফাংশন
    const handleReset = () => {
        setSearchTerm("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSortOption("createdAt-desc");
        router.push("?");
    };

    // Preset Price Range Select Handler
    const handlePriceRangeChange = (value: string) => {
        if (!value) {
            setMinPrice("");
            setMaxPrice("");
            return;
        }
        const [min, max] = value.split("-");
        setMinPrice(min || "");
        setMaxPrice(max || "");
    };

    // কারেন্ট প্রাইস সিলেক্ট ভ্যালু গণনা
    const currentPriceRangeValue = minPrice || maxPrice ? `${minPrice}-${maxPrice}` : "";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4 shadow-lg">
            {/* Filter Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                    <Filter className="w-4 h-4 text-blue-500" />
                    <span>Filter & Search Services</span>
                </div>
                {(searchTerm || category || minPrice || maxPrice || sortOption !== "createdAt-desc") && (
                    <span className="text-xs text-blue-400 font-medium">Active Filters</span>
                )}
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* 1. Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search service title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleFilterSubmit()}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                {/* 2. Category Dropdown */}
                <div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 3. Price Filter Dropdown */}
                <div>
                    <select
                        value={currentPriceRangeValue}
                        onChange={(e) => handlePriceRangeChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                        <option value="">All Prices</option>
                        <option value="0-500">Under ৳500</option>
                        <option value="500-1000">৳500 - ৳1000</option>
                        <option value="1000-3000">৳1000 - ৳3000</option>
                        <option value="3000-5000">৳3000 - ৳5000</option>
                        <option value="5000-">Above ৳5000</option>
                    </select>
                </div>

                {/* 4. Sort Options Dropdown */}
                <div>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="title-asc">Title: A to Z</option>
                    </select>
                </div>

                {/* 5. Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleFilterSubmit}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/20 active:scale-95"
                    >
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                    <button
                        onClick={handleReset}
                        title="Reset Filters"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl p-2.5 transition border border-slate-700 active:scale-95"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}