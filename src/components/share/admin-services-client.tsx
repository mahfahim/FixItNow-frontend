// src/components/share/admin-services-client.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllServices } from "@/actions/services.actions";
import { IService, ActionResponse, IPaginationOptions } from "@/types";
import { ReusableCardList } from "@/components/share/admin-reusable-card-list";
import { ServiceDeleteButton } from "@/components/share/admin-service-delete-button";

interface AdminServicesClientProps {
    initialServices?: IService[];
    initialMeta?: IPaginationOptions;
    title?: string;
    description?: string;
    createHref?: string;
    createBtnText?: string;
    editBaseUrl?: string;
}

export function AdminServicesClient({
    initialServices = [],
    initialMeta,
    title = "Services Management",
    description = "Manage, filter, and monitor all services across the platform.",
    createHref = "/admin/services/create",
    createBtnText = "Create Service",
    editBaseUrl = "/admin/services/edit",
}: AdminServicesClientProps) {
    const [services, setServices] = useState<IService[]>(initialServices);
    const [meta, setMeta] = useState<IPaginationOptions | undefined>(initialMeta);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    // Fetch all services with filters & pagination
    const fetchServices = useCallback(
        async (searchValue: string, pageNum: number, status: string) => {
            setLoading(true);
            try {
                const filterOptions: Record<string, unknown> = {
                    search: searchValue,
                    page: pageNum,
                    limit: 9,
                    includeUnavailable: true,
                };

                if (status === "available") {
                    filterOptions.isAvailable = true;
                } else if (status === "paused") {
                    filterOptions.isAvailable = false;
                }

                const res = (await getAllServices(filterOptions)) as ActionResponse<IService[]>;

                if (res?.success) {
                    setServices(res.data || []);
                    setMeta(res.meta);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Debounce search and reload on filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchServices(searchTerm, page, statusFilter);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm, page, statusFilter, fetchServices]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {description}
                    </p>
                </div>

                {createHref && (
                    <Link href={createHref}>
                        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium h-10 px-4 gap-2 shadow-sm transition-all">
                            <Plus className="w-4 h-4" />
                            {createBtnText}
                        </Button>
                    </Link>
                )}
            </div>

            {/* Filter and Content List Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-end gap-3">
                    <label htmlFor="status-filter" className="text-xs font-medium text-slate-600">
                        Status:
                    </label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                        <option value="all">All Statuses</option>
                        <option value="available">Available Only</option>
                        <option value="paused">Paused Only</option>
                    </select>
                </div>

                <ReusableCardList
                    items={services}
                    meta={meta}
                    loading={loading}
                    searchTerm={searchTerm}
                    onSearchChange={(val) => {
                        setSearchTerm(val);
                        setPage(1);
                    }}
                    onPageChange={(newPage) => setPage(newPage)}
                    editBaseUrl={editBaseUrl}
                    createUrl={createHref}
                    renderDeleteButton={(service) => (
                        <ServiceDeleteButton
                            serviceId={service.id}
                            serviceTitle={service.title}
                        />
                    )}
                />
            </div>
        </div>
    );
}