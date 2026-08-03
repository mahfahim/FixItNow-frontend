// src/app/(dashboardGroup)/admin/categories/create/page.tsx

import { Metadata } from "next";
import CategoryForm from "../../_components/CategoryForm";

export const metadata: Metadata = {
    title: "Create New Category | Admin Dashboard",
    description: "Add a new service category to the platform.",
};

export default function CreateCategoryPage() {
    return (
        <div className="p-6 w-full max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Create New Category</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Add a new service category to the platform.
                </p>
            </div>

            <CategoryForm />
        </div>
    );
}