// src/app/(dashboardGroup)/admin/_components/CategoryTable.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ICategory } from "@/types";
import { deleteCategory } from "../_actions/category.actions";
import { useToast } from "@/providers/toast-provider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, Tag, FolderOpen, AlertCircle } from "lucide-react";

interface CategoryTableProps {
    initialCategories?: ICategory[];
}

// Category Icon with Next.js Image & Fallback
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
            unoptimized // Allow external URLs without domains setup in next.config
            className="h-4 w-4 object-contain"
            onError={() => setImgError(true)}
        />
    );
}

export default function CategoryTable({ initialCategories }: CategoryTableProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { success, error: toastError } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {
        data: categories = initialCategories || [],
        isLoading,
        isError,
    } = useQuery<ICategory[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch("/api/admin/categories");
            if (!res.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await res.json();
            return data?.data || [];
        },
        initialData: initialCategories,
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

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden w-full transition-all">
            <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200/80">
                    <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 py-3.5">
                            Category Info
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 py-3.5">
                            Status
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 py-3.5 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={3} className="py-12 text-center text-slate-500">
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                    <span className="text-sm font-medium text-slate-600">
                                        Loading categories...
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={3} className="py-10 text-center">
                                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    Failed to load categories. Please try refreshing.
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <TableRow
                                key={category.id}
                                className="hover:bg-slate-50/60 transition-colors border-slate-100"
                            >
                                <TableCell className="py-3.5">
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
                                </TableCell>

                                <TableCell className="py-3.5">
                                    {category.isActive ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                            Inactive
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="py-3.5 text-right">
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
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <FolderOpen className="h-5 w-5" />
                                    </div>
                                    <p className="text-slate-700 font-semibold text-sm">No categories found</p>
                                    <p className="text-slate-400 text-xs">There are no categories available right now.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}