// src/app/(dashboardGroup)/admin/categories/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import { getCategoryById } from "@/actions/category.actions";
import { ICategory } from "@/types";
import CategoryForm from "../../../_components/CategoryForm_";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Category | Admin Dashboard",
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const res = await getCategoryById(id);

  if (!res?.success || !res?.data) {
    notFound();
  }

  
  const category = ((res.data as { data?: ICategory }).data || res.data) as ICategory;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <CategoryForm initialData={category} isEditing={true} />
    </div>
  );
}