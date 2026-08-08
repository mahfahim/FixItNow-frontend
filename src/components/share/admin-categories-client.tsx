// src/components/share/admin-categories-client.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ICategory } from "@/types";
import { deleteCategory, getAllCategories } from "@/actions/category.actions";
import { NO_CACHE_QUERY_CONFIG } from "@/lib/query-options";
import { useToast } from "@/providers/toast-provider";
import { DataTable, Column } from "@/components/share/admin-data-table";
import { Button } from "@/components/ui/button";
import {
    Pencil,
    Trash2,
    Loader2,
    Tag,
    FolderOpen,
    AlertCircle,
    Filter,
    Plus,
} from "lucide-react";

interface AdminCategoriesClientProps {
    initialCategories?: ICategory[];
    title?: string;
    description?: string;
    createHref?: string;
    createBtnText?: string;
}

function CategoryIcon({ src, name }: { src?: string; name: string }) {
    const [imgError, setImgError] = useState(false);

    if (!src || imgError) {
        return <Tag className="h-4 w-4 text-blue-600" />;
    }

    return (
        <Image
            src={src}
            alt={name}
            width={16}
            height={16}
            unoptimized
            className="h-4 w-4 object-contain"
            onError={() => setImgError(true)}
        />
    );
}

export function AdminCategoriesClient({
    initialCategories = [],
    title = "Categories",
    description = "Manage service categories for the platform.",
    createHref = "/admin/categories/create",
    createBtnText = "Add Category",
}: AdminCategoriesClientProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { success, error: toastError } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter & Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 5;

    const {
        data: categories = initialCategories,
        isLoading,
        isFetching,
        isError,
    } = useQuery<ICategory[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await getAllCategories({ useCache: false });
            if (!res.success) {
                throw new Error(res.message || "Failed to fetch categories");
            }
            return (res.data as ICategory[]) || [];
        },
        initialData: initialCategories,
        ...NO_CACHE_QUERY_CONFIG,
    });

    const { mutate: executeDelete } = useMutation({
        mutationFn: async ({ id }: { id: string; name: string }) => {
            return await deleteCategory(id);
        },
        onMutate: ({ id }) => {
            setDeletingId(id);
        },
        onSuccess: (res, { name }) => {
            if (res?.success) {
                queryClient.invalidateQueries({ queryKey: ["categories"] });
                success("Category Deleted", `"${name}" has been removed successfully.`);
                router.refresh();
            } else {
                toastError("Delete Failed", res?.message || "Failed to delete category.");
            }
        },
        onError: (err: Error) => {
            console.error("Error deleting category:", err);
            toastError(
                "Error",
                err?.message || "An unexpected error occurred while deleting."
            );
        },
        onSettled: () => {
            setDeletingId(null);
        },
    });

    const handleDelete = (id: string, name: string) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${name}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        executeDelete({ id, name });
    };

    // Real-time filtering based on Search Query and Status Filter Dropdown
    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            const matchesSearch =
                category.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                category.slug.toLowerCase().includes(searchQuery.toLowerCase().trim());

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? category.isActive === true
                        : category.isActive === false;

            return matchesSearch && matchesStatus;
        });
    }, [categories, searchQuery, statusFilter]);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleStatusChange = (status: "all" | "active" | "inactive") => {
        setStatusFilter(status);
        setPage(1);
    };

    const columns: Column<ICategory>[] = [
        {
            header: "Category Info",
            accessorKey: "name",
            cell: (category) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                        <CategoryIcon src={category.icon as string} name={category.name} />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-800 text-sm">
                            {category.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                            /{category.slug}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "isActive",
            cell: (category) =>
                category.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Inactive
                    </span>
                ),
        },
        {
            header: "Actions",
            headerClassName: "text-right",
            cellClassName: "text-right",
            cell: (category) => (
                <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 border-slate-200/80 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 hover:border-blue-200 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-2xs"
                        >
                            <Pencil className="h-3.5 w-3.5 mr-1 text-slate-500" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={deletingId === category.id}
                        className="h-8 px-2.5 border-slate-200/80 bg-white text-slate-700 hover:text-rose-600 hover:bg-rose-50/60 hover:border-rose-200 rounded-xl text-xs font-medium transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                        {deletingId === category.id ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-rose-600" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-3.5 w-3.5 mr-1 text-slate-500" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            ),
        },
    ];

    const paginatedCategories = filteredCategories.slice((page - 1) * limit, page * limit);

    return (
        <div className="p-6 w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                </div>
                {createHref && (
                    <Link href={createHref}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            {createBtnText}
                        </Button>
                    </Link>
                )}
            </div>

            {/* Error Message */}
            {isError ? (
                <div className="p-6 rounded-2xl border border-rose-100 bg-rose-50/50 text-center">
                    <div className="inline-flex items-center gap-2 text-rose-600 text-xs font-medium">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Failed to load categories. Please try refreshing.
                    </div>
                </div>
            ) : (
                /* Data Table */
                <DataTable<ICategory>
                    data={paginatedCategories}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    emptyMessage="No categories found"
                    emptyDescription="There are no categories matching your search or filter."
                    emptyIcon={<FolderOpen className="h-5 w-5" />}
                    searchPlaceholder="Search category name or slug..."
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    filterElement={
                        <div className="flex items-center gap-2">
                            <Filter className="h-3.5 w-3.5 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    handleStatusChange(
                                        e.target.value as "all" | "active" | "inactive"
                                    )
                                }
                                className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>
                        </div>
                    }
                    pagination={{
                        page,
                        limit,
                        total: filteredCategories.length,
                        onPageChange: (newPage) => setPage(newPage),
                    }}
                />
            )}
        </div>
    );
}