// src/app/(dashboardGroup)/admin/_components/CategoryForm.tsx
"use client";

import { FolderPlus } from "lucide-react";
import { ICategory, ICreateCategoryPayload, IUpdateCategoryPayload } from "@/types";
import { createCategory, updateCategory } from "@/actions/category.actions";
import {
  AdvancedReusableForm,
  FormFieldConfig,
  ActionResponse
} from "@/components/share/advanced-reusable-form";

interface CategoryFormProps {
  initialData?: ICategory;
  isEditing?: boolean;
  basePath?: string;
}

export default function CategoryForm({
  initialData,
  isEditing = false,
  basePath = "/admin",
}: CategoryFormProps) {
  const defaultValues: ICreateCategoryPayload = {
    name: "",
    slug: "",
    icon: "",
    description: "",
    isActive: true,
  };

  const fields: FormFieldConfig<ICreateCategoryPayload>[] = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      placeholder: "e.g. Plumbing Services",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      placeholder: "e.g. plumbing-services",
      required: true,
      fontMono: true,
      autoSlugFrom: "name",
      validate: (val) =>
        typeof val === "string" && val && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)
          ? "Slug must contain only lowercase letters, numbers, and hyphens."
          : undefined,
    },
    {
      name: "icon",
      label: "Icon URL",
      type: "url",
      placeholder: "https://example.com/icon.png",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe this category...",
      rows: 3,
    },
    {
      name: "isActive",
      label: "Active (Visible to users)",
      type: "checkbox",
    },
  ];

  const handleSubmit = async (formData: ICreateCategoryPayload): Promise<ActionResponse> => {
    const categoryId = initialData?.id;
    if (isEditing && categoryId) {
      return await updateCategory(categoryId, formData as IUpdateCategoryPayload);
    }
    return await createCategory(formData);
  };

  const formattedInitialData: Partial<ICreateCategoryPayload> | undefined = initialData
    ? {
      name: initialData.name || "",
      slug: initialData.slug || "",
      icon: initialData.icon ?? "",
      description: initialData.description ?? "",
      isActive: initialData.isActive ?? true,
    }
    : undefined;

  return (
    <AdvancedReusableForm<ICreateCategoryPayload>
      title={isEditing ? "Edit Category" : "Create New Category"}
      icon={<FolderPlus className="h-5 w-5 text-blue-600" />}
      fields={fields}
      initialData={formattedInitialData}
      defaultValues={defaultValues}
      isEditing={isEditing}
      cancelUrl={`${basePath}/categories`}
      onSubmit={handleSubmit}
      onSuccessMessage={
        isEditing
          ? "Category updated successfully!"
          : "Category created successfully!"
      }
    />
  );
}