// src/app/(dashboardGroup)/admin/categories/create/page.tsx

import CategoryForm from "../../_components/CategoryForm";

export default function CreateCategoryPage() {
    return (
        <div className="p-6 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Create New Category</h1>
                <p className="text-sm text-gray-500 mt-1">Add a new service category to the platform.</p>
            </div>

            <CategoryForm />
        </div>
    );
}