// src/components/share/data-table.tsx
"use client";

import React from "react";
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
} from "lucide-react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T, index: number) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
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
}

export function DataTable<T>({
    data = [],
    columns,
    keyExtractor,
    isLoading = false,
    isFetching = false,
    pagination,
    emptyMessage = "No records found",
    emptyDescription = "There are no records to display.",
    emptyIcon,
}: DataTableProps<T>) {
    const totalPages = pagination
        ? Math.ceil((pagination.total || 0) / (pagination.limit || 10))
        : 0;

    return (
        <div className="w-full space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden relative transition-all">
                {/* Fetching Indicator Overlay */}
                {isFetching && !isLoading && (
                    <div className="absolute top-2.5 right-3 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/80 text-xs font-medium text-slate-600 shadow-xs z-10">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                        Updating...
                    </div>
                )}

                <Table>
                    <TableHeader className="bg-slate-50/80 border-b border-slate-200/80">
                        <TableRow className="hover:bg-transparent border-none">
                            {columns.map((col, idx) => (
                                <TableHead
                                    key={idx}
                                    className={`py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${col.headerClassName || ""}`}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                        <span className="font-medium text-slate-600">
                                            Loading data...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow
                                    key={keyExtractor(item)}
                                    className="hover:bg-slate-50/60 transition-colors border-slate-100"
                                >
                                    {columns.map((col, colIdx) => (
                                        <TableCell
                                            key={colIdx}
                                            className={`py-3.5 px-4 align-middle ${col.cellClassName || ""}`}
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
                                <TableCell colSpan={columns.length} className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                            {emptyIcon || <CalendarX className="h-5 w-5" />}
                                        </div>
                                        <p className="text-slate-700 font-semibold text-sm">
                                            {emptyMessage}
                                        </p>
                                        <p className="text-slate-400 text-xs">
                                            {emptyDescription}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                {pagination && totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-xs text-slate-500">
                            Showing page{" "}
                            <span className="font-semibold text-slate-800">
                                {pagination.page}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-800">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => pagination.onPageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1 || isFetching}
                                className="h-8 px-3 text-xs rounded-xl bg-white text-slate-700 hover:bg-blue-50/60 hover:text-blue-600 hover:border-blue-200 border-slate-200/80 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                            >
                                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => pagination.onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= totalPages || isFetching}
                                className="h-8 px-3 text-xs rounded-xl bg-white text-slate-700 hover:bg-blue-50/60 hover:text-blue-600 hover:border-blue-200 border-slate-200/80 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                            >
                                Next
                                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}