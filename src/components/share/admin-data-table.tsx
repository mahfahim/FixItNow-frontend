// src/components/share/data-table.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    CalendarX,
    Search,
    X,
} from "lucide-react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T, index: number) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    width?: string | number;
    searchable?: boolean;
}

export interface IPaginationProps {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    isLoading?: boolean;
    isFetching?: boolean;
    pagination?: IPaginationProps;
    emptyMessage?: string;
    emptyDescription?: string;
    emptyIcon?: React.ReactNode;
    // Filtering & Searching Props
    searchPlaceholder?: string;
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    filterElement?: React.ReactNode;
    enableClientSearch?: boolean;
}

export function DataTable<T>({
    data = [],
    columns,
    keyExtractor,
    isLoading = false,
    isFetching = false,
    pagination,
    emptyMessage = "No records found",
    emptyDescription = "There are no records to display at this moment.",
    emptyIcon,
    searchPlaceholder = "Search...",
    searchQuery: externalSearchQuery = "",
    onSearchChange,
    filterElement,
    enableClientSearch = true,
}: DataTableProps<T>) {
    // Local state for search input text
    const [searchValue, setSearchValue] = useState(externalSearchQuery);
    const [prevExternalSearchQuery, setPrevExternalSearchQuery] = useState(externalSearchQuery);

    // Sync internal state during render if external search query changes (e.g. URL update or filter clear)
    if (prevExternalSearchQuery !== externalSearchQuery) {
        setPrevExternalSearchQuery(externalSearchQuery);
        setSearchValue(externalSearchQuery);
    }

    // Handle form submit on Enter key or Search button click
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSearchChange) {
            onSearchChange(searchValue.trim());
        }
    };

    // Handle Clear Search
    const handleClearSearch = () => {
        setSearchValue("");
        if (onSearchChange) {
            onSearchChange("");
        }
    };

    // Auto Client-side filtering if enabled
    const displayData = useMemo(() => {
        if (!enableClientSearch || !externalSearchQuery.trim()) {
            return data;
        }

        const query = externalSearchQuery.toLowerCase().trim();
        const searchableColumns = columns.filter((col) => col.searchable !== false);

        return data.filter((item) => {
            return searchableColumns.some((col) => {
                if (col.accessorKey) {
                    const val = item[col.accessorKey];
                    if (val !== null && val !== undefined) {
                        return String(val).toLowerCase().includes(query);
                    }
                }
                return false;
            });
        });
    }, [data, externalSearchQuery, enableClientSearch, columns]);

    const totalPages = pagination
        ? Math.ceil((pagination.total || 0) / (pagination.limit || 10))
        : 0;

    const showToolbar = Boolean(searchPlaceholder || filterElement || onSearchChange);

    return (
        <div className="w-full space-y-4">
            {/* Shareable Filter & Search Toolbar */}
            {showToolbar && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                    {/* Search Form with Enter Trigger */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                        <button
                            type="submit"
                            title="Search"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            <Search className="h-4 w-4" />
                        </button>

                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 placeholder:text-slate-400"
                        />

                        {searchValue && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </form>

                    {filterElement && (
                        <div className="flex items-center gap-2">
                            {filterElement}
                        </div>
                    )}
                </div>
            )}

            <div className="relative w-full rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden transition-all duration-300">
                {/* Fetching Indicator Overlay */}
                {isFetching && !isLoading && (
                    <div className="absolute top-3 right-4 z-20 flex animate-in fade-in slide-in-from-top-2 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                        <span className="animate-pulse">Updating...</span>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-b border-slate-200/60 hover:bg-transparent">
                                {columns.map((col, idx) => (
                                    <TableHead
                                        key={idx}
                                        style={{ width: col.width }}
                                        className={`h-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${col.headerClassName || ""}`}
                                    >
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-slate-100 bg-white">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, rowIndex) => (
                                    <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                                        {columns.map((_, colIndex) => (
                                            <TableCell key={`skeleton-col-${colIndex}`} className="px-5 py-4">
                                                <div
                                                    className="h-4 w-full animate-pulse rounded-md bg-slate-100"
                                                    style={{
                                                        animationDelay: `${(rowIndex * 100) + (colIndex * 50)}ms`,
                                                        opacity: 1 - (rowIndex * 0.15)
                                                    }}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : displayData.length > 0 ? (
                                displayData.map((item, index) => (
                                    <TableRow
                                        key={keyExtractor(item)}
                                        className="group transition-all duration-200 hover:bg-blue-50/30 hover:shadow-[inset_2px_0_0_0_#2563eb]"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <TableCell
                                                key={colIdx}
                                                className={`px-5 py-4 align-middle text-sm text-slate-600 transition-colors group-hover:text-slate-900 ${col.cellClassName || ""}`}
                                            >
                                                {col.cell
                                                    ? col.cell(item, index)
                                                    : col.accessorKey
                                                        ? String(item[col.accessorKey] ?? "")
                                                        : null}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-100 text-center align-middle">
                                        <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 shadow-sm mb-2">
                                                <div className="animate-[bounce_3s_infinite] text-slate-400">
                                                    {emptyIcon || <CalendarX className="h-7 w-7" />}
                                                </div>
                                            </div>
                                            <h3 className="text-base font-semibold text-slate-800">
                                                {emptyMessage}
                                            </h3>
                                            <p className="max-w-62.5 text-sm text-slate-500 leading-relaxed">
                                                {emptyDescription}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {pagination && totalPages > 1 && !isLoading && (
                    <div className="flex items-center justify-between border-t border-slate-200/60 bg-slate-50/50 px-5 py-3.5">
                        <p className="text-sm text-slate-500">
                            Page <span className="font-semibold text-slate-700">{pagination.page}</span> of <span className="font-semibold text-slate-700">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2.5">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => pagination.onPageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1 || isFetching}
                                className="h-8 w-8 p-0 rounded-lg bg-white border-slate-200 text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => pagination.onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= totalPages || isFetching}
                                className="h-8 w-8 p-0 rounded-lg bg-white border-slate-200 text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}