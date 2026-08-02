// src/app/(dashboardGroup)/admin/_components/CategoryTable.tsx

"use client";

import { ICategory } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCategory } from "../_actions/category.actions";
import { useState } from "react";

interface CategoryTableProps {
    categories: ICategory[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await deleteCategory(id);
            if (res?.success) {
                router.refresh();
            } else {
                alert(res?.message || "Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("An unexpected error occurred.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="overflow-x-auto w-full bg-white rounded-lg shadow-sm border flex flex-col">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Name & Slug</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <tr key={category.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{category.name}</div>
                                    <div className="text-xs text-gray-500">{category.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${category.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {category.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <Link
                                        href={`/admin/categories/${category.id}/edit`}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        disabled={deletingId === category.id}
                                        className="font-medium text-red-600 hover:underline disabled:opacity-50"
                                    >
                                        {deletingId === category.id ? "Deleting..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                No categories found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}