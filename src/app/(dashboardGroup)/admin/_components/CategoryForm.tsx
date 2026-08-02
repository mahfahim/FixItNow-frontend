// src/app/(dashboardGroup)/admin/_components/CategoryForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICategory, ICreateCategoryPayload, IUpdateCategoryPayload } from "@/types";
import { createCategory, updateCategory } from "../_actions/category.actions";

interface CategoryFormProps {
    initialData?: ICategory;
    isEditing?: boolean;
    basePath?: string;
}

export default function CategoryForm({
    initialData,
    isEditing = false,
    basePath = "/admin"
}: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ICreateCategoryPayload>({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        icon: initialData?.icon || "",
        description: initialData?.description || "",
        isActive: initialData?.isActive ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => {
                const newData = { ...prev, [name]: value };

                
                if (name === "name" && !isEditing) {
                    newData.slug = value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "");
                }

                return newData;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let res;
            if (isEditing && initialData?.id) {
                res = await updateCategory(initialData.id, formData as IUpdateCategoryPayload);
            } else {
                res = await createCategory(formData);
            }

            if (res?.success) {
                
                alert(isEditing ? "Category updated successfully!" : "Category created successfully!");

                
                if (!isEditing) {
                    setFormData({
                        name: "",
                        slug: "",
                        icon: "",
                        description: "",
                        isActive: true
                    });
                }

                
                router.push(`${basePath}/categories`);
            } else {
                setError(res?.message || "Failed to save category. Please try again.");
            }
        } catch (err) {
            console.error("Error submitting category:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border max-w-2xl">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Plumbing Services"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <input
                        type="text"
                        name="slug"
                        required
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. plumbing-services"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                    <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/icon.png"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe this category..."
                    />
                </div>

                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active (Visible to users)
                    </label>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.push(`${basePath}/categories`)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
                </button>
            </div>
        </form>
    );
}