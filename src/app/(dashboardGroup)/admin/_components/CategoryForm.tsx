// src/app/(dashboardGroup)/admin/_components/CategoryForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICategory, ICreateCategoryPayload, IUpdateCategoryPayload } from "@/types";
import { createCategory, updateCategory } from "../_actions/category.actions";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FolderPlus, ArrowLeft, Save } from "lucide-react";

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
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ICreateCategoryPayload>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    icon: initialData?.icon || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

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
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
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

        router.push(`${basePath}/categories`);
      } else {
        const msg = res?.message || "Failed to save category. Please try again.";
        setError(msg);
        toastError("Operation Failed", msg);
      }
    } catch (err) {
      console.error("Error submitting category:", err);
      const msg = "An unexpected error occurred. Please try again.";
      setError(msg);
      toastError("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl bg-white shadow-xs border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-blue-600" />
          {isEditing ? "Edit Category" : "Create New Category"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-medium">
              Category Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Plumbing Services"
              className="bg-white border-slate-200 focus-visible:ring-blue-500"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-slate-700 font-medium">
              Slug <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="slug"
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="e.g. plumbing-services"
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Icon URL */}
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-slate-700 font-medium">
              Icon URL
            </Label>
            <Input
              id="icon"
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="https://example.com/icon.png"
              className="bg-white border-slate-200 focus-visible:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this category..."
              className="bg-white border-slate-200 focus-visible:ring-blue-500 resize-none"
            />
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor="isActive"
              className="text-sm font-medium text-slate-800 cursor-pointer select-none"
            >
              Active (Visible to users)
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`${basePath}/categories`)}
              className="gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer"
            >
              {loading ? (
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