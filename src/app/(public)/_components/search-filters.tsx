"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, RotateCcw, Search } from "lucide-react";

import { ICategory } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
  categories: ICategory[];
}

export function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("categoryId") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  return (
    <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="h-4 w-4 text-indigo-600" />
          Filter Services
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-indigo-600 h-8 px-2"
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Clear All
        </Button>
      </div>

      {/* Search Keyboard */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-700">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search keywords..."
            defaultValue={currentSearch}
            onChange={(e) => updateQueryParams("search", e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-300"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-700">Category</Label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateQueryParams("categoryId", "")}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !currentCategory
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateQueryParams("categoryId", cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentCategory === cat.id
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <Label className="text-xs font-semibold text-slate-700">Price Range (৳)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={currentMinPrice}
            onChange={(e) => updateQueryParams("minPrice", e.target.value)}
            className="h-9 text-xs bg-slate-50 border-slate-300"
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={currentMaxPrice}
            onChange={(e) => updateQueryParams("maxPrice", e.target.value)}
            className="h-9 text-xs bg-slate-50 border-slate-300"
          />
        </div>
      </div>
    </div>
  );
}