// src/components/share/reusable-card-list.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Wrench,
    Plus,
    Edit,
    Clock,
    MapPin,
    Layers,
    ImageIcon,
} from "lucide-react";
import { IService, IPaginationOptions } from "@/types";

interface ReusableCardListProps {
    items: IService[];
    meta?: IPaginationOptions;
    loading?: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    renderDeleteButton?: (service: IService) => React.ReactNode;
    editBaseUrl?: string;
    createUrl?: string;
    searchPlaceholder?: string;
}

export function ReusableCardList({
    items,
    meta,
    loading = false,
    searchTerm,
    onSearchChange,
    onPageChange,
    renderDeleteButton,
    editBaseUrl = "/technician/services/edit",
    createUrl = "/technician/services/create",
    searchPlaceholder = "Search services by title...",
}: ReusableCardListProps) {
    const currentPage = meta?.page || 1;
    const totalPage =
        meta?.totalPage || Math.ceil((meta?.total || 0) / (meta?.limit || 10)) || 1;

    return (
        <div className="space-y-6">
            {/* Search Input Bar UI */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                />
                {loading && (
                    <Loader2 className="w-4 h-4 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                )}
            </div>

            {/* Main Content / Card Grid UI */}
            {loading ? (
                <div className="py-20 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : items.length === 0 ? (
                /* Empty State UI */
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
                    <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-800">
                            No Services Found
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {searchTerm
                                ? "No services match your search terms."
                                : "Create your first service offering to start getting booking requests from customers."}
                        </p>
                    </div>
                    {!searchTerm && createUrl && (
                        <Link
                            href={createUrl}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add First Service
                        </Link>
                    )}
                </div>
            ) : (
                /* Service Cards Grid UI */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((service) => {
                        const hasImage = service.images && service.images.length > 0;
                        const imageUrl = hasImage ? service.images[0] : null;

                        return (
                            <div
                                key={service.id}
                                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-3">
                                    {/* Service Image Header */}
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={service.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                                                <ImageIcon className="w-8 h-8 stroke-1" />
                                                <span className="text-[10px] font-medium">
                                                    No Image Uploaded
                                                </span>
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-2.5 right-2.5 z-10">
                                            <span
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-xs backdrop-blur-md ${service.isAvailable
                                                    ? "bg-emerald-500/90 text-white border-emerald-400"
                                                    : "bg-amber-500/90 text-white border-amber-400"
                                                    }`}
                                            >
                                                {service.isAvailable ? "Available" : "Paused"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                                            <Layers className="w-3 h-3 text-indigo-600" />
                                            {service.category?.name || "General"}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                            {service.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Price & Duration */}
                                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                                Price
                                            </span>
                                            <p className="text-lg font-bold text-indigo-600">
                                                ${service.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                                Duration
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                {service.duration} mins
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service Area */}
                                    {service.serviceArea && service.serviceArea.length > 0 && (
                                        <div className="flex items-start gap-1 text-[11px] text-slate-500">
                                            <MapPin className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
                                            <span className="line-clamp-1">
                                                {service.serviceArea.join(", ")}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons UI */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <Link
                                        href={`${editBaseUrl}?id=${service.id}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        <Edit className="w-3.5 h-3.5 text-slate-500" /> Edit
                                    </Link>

                                    {renderDeleteButton && renderDeleteButton(service)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Controls UI */}
            {meta && totalPage > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
                    <p className="text-xs text-slate-500 font-medium">
                        Page{" "}
                        <span className="text-slate-900 font-semibold">{currentPage}</span>{" "}
                        of{" "}
                        <span className="text-slate-900 font-semibold">{totalPage}</span>
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || loading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPage || loading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}