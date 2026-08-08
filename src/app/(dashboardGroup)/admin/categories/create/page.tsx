// src/app/(dashboardGroup)/admin/categories/create/page.tsx

import CategoryForm from "../../_components/CategoryForm_";

export const metadata = {
    title: "Create Category | Admin Dashboard",
};

export default function CreateCategoryPage() {
    return (
        <div className="max-w-3xl mx-auto py-6 px-4">
            <CategoryForm />
        </div>
    );
}