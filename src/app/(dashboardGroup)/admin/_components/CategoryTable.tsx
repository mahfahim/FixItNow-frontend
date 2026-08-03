// src/app/(dashboardGroup)/admin/_components/CategoryTable.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, Tag } from "lucide-react";

interface CategoryTableProps {
    categories: ICategory[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
    const router = useRouter();
    const { success, error: toastError } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${name}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await deleteCategory(id);
            if (res?.success) {
                success("Category Deleted", `"${name}" has been removed successfully.`);
                router.refresh();
            } else {
                toastError("Delete Failed", res?.message || "Failed to delete category.");
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            toastError("Error", "An unexpected error occurred while deleting.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden w-full">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-semibold text-slate-700">Name & Slug</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <TableRow key={category.id} className="hover:bg-slate-50/80 transition-colors">
                                {/* Name & Slug */}
                                <TableCell>
                                    <div className="font-medium text-slate-900 flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-blue-600 shrink-0" />
                                        {category.name}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                                        {category.slug}
                                    </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    {category.isActive ? (
                                        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200">
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                                            Inactive
                                        </Badge>
                                    )}
                                </TableCell>

                                {/* Action Buttons */}
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/categories/${category.id}/edit`}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                            >
                                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(category.id, category.name)}
                                            disabled={deletingId === category.id}
                                            className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                                        >
                                            {deletingId === category.id ? (
                                                <>
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
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
                            <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                                No categories found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}