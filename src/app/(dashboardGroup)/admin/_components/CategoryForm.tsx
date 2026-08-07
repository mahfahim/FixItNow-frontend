// src/app/(dashboardGroup)/admin/_components/CategoryForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICategory, ICreateCategoryPayload, IUpdateCategoryPayload } from "@/types";
import { createCategory, updateCategory } from "@/actions/category.actions";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FolderPlus, ArrowLeft, Save, AlertCircle } from "lucide-react";

interface CategoryFormProps {
  initialData?: ICategory;
  isEditing?: boolean;
  basePath?: string;
}

interface FormErrors {
  name?: string;
  slug?: string;
  icon?: string;
  description?: string;
  general?: string;
}

export default function CategoryForm({
  initialData,
  isEditing = false,
  basePath = "/admin",
}: CategoryFormProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<ICreateCategoryPayload>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    icon: initialData?.icon ?? "",
    description: initialData?.description ?? "",
    isActive: initialData?.isActive ?? true,
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const name = formData.name ?? "";
    const slug = formData.slug ?? "";

    if (!name.trim()) {
      newErrors.name = "Category name is required.";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug is required.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens.";
    }

    if (formData.icon && !/^https?:\/\/.+/.test(formData.icon)) {
      newErrors.icon = "Please enter a valid URL (starting with http:// or https://).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "name" && !isEditing) {
        newData.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        setErrors((prev) => ({ ...prev, slug: undefined }));
      }

      return newData;
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPending(true);

    try {
      const categoryId = initialData?.id;
      const res =
        isEditing && categoryId
          ? await updateCategory(categoryId, formData as IUpdateCategoryPayload)
          : await createCategory(formData);

      if (res?.success) {
        success(
          `Category ${isEditing ? "Updated" : "Created"}`,
          `The category has been ${isEditing ? "updated" : "created"} successfully.`
        );

        if (!isEditing) {
          setFormData({
            name: "",
            slug: "",
            icon: "",
            description: "",
            isActive: true,
          });
        }

        router.refresh();
        router.push(`${basePath}/categories`);

      } else {
        const msg = res?.message || "Failed to save category. Please try again.";
        setErrors((prev) => ({ ...prev, general: msg }));
        toastError("Operation Failed", msg);
      }
    } catch (err: unknown) {
      console.error("Error submitting category:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setErrors((prev) => ({ ...prev, general: msg }));
      toastError("Error", msg);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full bg-white text-black shadow-xs border-slate-200 rounded-2xl">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-blue-600" />
          {isEditing ? "Edit Category" : "Create New Category"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* General Error Banner */}
          {errors.general && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-black font-medium">
              Category Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name ?? ""}
              onChange={handleInputChange}
              placeholder="e.g. Plumbing Services"
              className={`bg-white text-black transition-colors ${errors.name
                ? "border-rose-500 focus-visible:ring-rose-500"
                : "border-slate-200 focus-visible:ring-blue-500"
                }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-black font-medium">
              Slug <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="slug"
              type="text"
              name="slug"
              value={formData.slug ?? ""}
              onChange={handleInputChange}
              placeholder="e.g. plumbing-services"
              className={`bg-slate-50 text-black font-mono text-xs transition-colors ${errors.slug
                ? "border-rose-500 focus-visible:ring-rose-500"
                : "border-slate-200 focus-visible:ring-blue-500"
                }`}
            />
            {errors.slug && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.slug}
              </p>
            )}
          </div>

          {/* Icon URL */}
          <div className="space-y-1.5">
            <Label htmlFor="icon" className="text-black font-medium">
              Icon URL
            </Label>
            <Input
              id="icon"
              type="text"
              name="icon"
              value={formData.icon ?? ""}
              onChange={handleInputChange}
              placeholder="https://example.com/icon.png"
              className={`bg-white text-black transition-colors ${errors.icon
                ? "border-rose-500 focus-visible:ring-rose-500"
                : "border-slate-200 focus-visible:ring-blue-500"
                }`}
            />
            {errors.icon && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.icon}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-black font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description ?? ""}
              onChange={handleInputChange}
              placeholder="Describe this category..."
              className={`bg-white text-black resize-none transition-colors ${errors.description
                ? "border-rose-500 focus-visible:ring-rose-500"
                : "border-slate-200 focus-visible:ring-blue-500"
                }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive ?? true}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor="isActive"
              className="text-sm font-medium text-black cursor-pointer select-none"
            >
              Active (Visible to users)
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.push(`${basePath}/categories`)}
              className="gap-2 border-slate-200 bg-white text-black hover:bg-slate-100 hover:text-black cursor-pointer rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer rounded-xl shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Update Category" : "Create Category"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}