// src/app/(dashboardGroup)/technician/_components/technician-service-list.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ReusableCardList } from "@/components/share/admin-reusable-card-list";
import { getAllServices } from "@/actions/services.actions";
import { IService, ActionResponse, IPaginationOptions } from "@/types";
import { ServiceDeleteButton } from "./service-delete-button_";

interface TechnicianServiceListProps {
    technicianId: string;
    initialServices?: IService[];
    initialMeta?: IPaginationOptions;
}

export function TechnicianServiceList({
    technicianId,
    initialServices = [],
    initialMeta,
}: TechnicianServiceListProps) {
    const [services, setServices] = useState<IService[]>(initialServices);
    const [meta, setMeta] = useState<IPaginationOptions | undefined>(initialMeta);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    // Fetch Services with Search and Pagination
    const fetchServices = useCallback(
        async (searchValue: string, pageNum: number) => {
            setLoading(true);
            try {
                const res = (await getAllServices({
                    technicianId,
                    search: searchValue,
                    page: pageNum,
                    limit: 6,
                })) as ActionResponse<IService[]>;

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
        [technicianId]
    );

    // Debounced Search Handler
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchServices(searchTerm, page);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm, page, fetchServices]);

    return (
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
            renderDeleteButton={(service) => (
                <ServiceDeleteButton
                    serviceId={service.id}
                    serviceTitle={service.title}
                />
            )}
        />
    );
}