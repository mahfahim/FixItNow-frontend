// src/components/share/reusable-form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save, AlertCircle } from "lucide-react";

export type FieldType = "text" | "textarea" | "checkbox" | "url" | "number";

export interface FormFieldConfig<T> {
    name: keyof T & string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    fontMono?: boolean;
    autoSlugFrom?: keyof T & string;
    validate?: (value: unknown, formData: T) => string | undefined;
}

export interface ReusableFormProps<T extends Record<string, unknown>> {
    title: string;
    icon?: React.ReactNode;
    fields: FormFieldConfig<T>[];
    initialData?: Partial<T>;
    defaultValues: T;
    isEditing?: boolean;
    cancelUrl: string;
    successRedirectUrl?: string;
    onSubmit: (data: T) => Promise<{ success?: boolean; message?: string; error?: string }>;
    onSuccessMessage?: string;
}

export function ReusableForm<T extends Record<string, unknown>>({
    title,
    icon,
    fields,
    initialData,
    defaultValues,
    isEditing = false,
    cancelUrl,
    successRedirectUrl,
    onSubmit,
    onSuccessMessage,
}: ReusableFormProps<T>) {
    const router = useRouter();
    const { success, error: toastError } = useToast();

    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<T>({
        ...defaultValues,
        ...initialData,
    });

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        fields.forEach((field) => {
            const val = formData[field.name];

            if (field.required && (!val || (typeof val === "string" && !val.trim()))) {
                newErrors[field.name] = `${field.label} is required.`;
            }

            if (field.type === "url" && val && !/^https?:\/\/.+/.test(String(val))) {
                newErrors[field.name] = "Please enter a valid URL (starting with http:// or https://).";
            }

            if (field.validate) {
                const customErr = field.validate(val, formData);
                if (customErr) newErrors[field.name] = customErr;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (name: keyof T & string, value: unknown) => {
        setErrors((prev) => ({ ...prev, [name]: "", general: "" }));

        setFormData((prev) => {
            const newData = { ...prev, [name]: value };

            if (!isEditing) {
                fields.forEach((f) => {
                    if (f.autoSlugFrom === name && typeof value === "string") {
                        newData[f.name] = generateSlug(value) as T[keyof T & string];
                        setErrors((p) => ({ ...p, [f.name]: "" }));
                    }
                });
            }

            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsPending(true);

        try {
            const res = await onSubmit(formData);

            if (res?.success) {
                success(
                    `${title} ${isEditing ? "Updated" : "Created"}`,
                    onSuccessMessage || `Item has been ${isEditing ? "updated" : "created"} successfully.`
                );

                router.refresh();
                router.push(successRedirectUrl || cancelUrl);
            } else {
                const msg = res?.message || res?.error || "Failed to save data. Please try again.";
                setErrors((prev) => ({ ...prev, general: msg }));
                toastError("Operation Failed", msg);
            }
        } catch (err: unknown) {
            console.error("Form Submit Error:", err);
            const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
            setErrors((prev) => ({ ...prev, general: msg }));
            toastError("Error", msg);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Card className="w-full bg-white shadow-xs border-slate-200 rounded-2xl">
            <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {errors.general && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2 font-medium">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    {fields.map((field) => {
                        const fieldValue = formData[field.name];
                        const hasError = !!errors[field.name];

                        return (
                            <div key={field.name} className="space-y-1.5">
                                {field.type !== "checkbox" && (
                                    <Label htmlFor={field.name} className="text-slate-700 font-medium">
                                        {field.label}{" "}
                                        {field.required && <span className="text-rose-500">*</span>}
                                    </Label>
                                )}

                                {(field.type === "text" || field.type === "url" || field.type === "number") && (
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        value={(fieldValue as string | number) ?? ""}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={`bg-white transition-colors ${field.fontMono ? "font-mono text-xs bg-slate-50" : ""
                                            } ${hasError
                                                ? "border-rose-500 focus-visible:ring-rose-500"
                                                : "border-slate-200 focus-visible:ring-blue-500"
                                            }`}
                                    />
                                )}

                                {field.type === "textarea" && (
                                    <Textarea
                                        id={field.name}
                                        rows={field.rows || 3}
                                        value={(fieldValue as string) ?? ""}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={`bg-white resize-none transition-colors ${hasError
                                                ? "border-rose-500 focus-visible:ring-rose-500"
                                                : "border-slate-200 focus-visible:ring-blue-500"
                                            }`}
                                    />
                                )}

                                {field.type === "checkbox" && (
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id={field.name}
                                            checked={!!fieldValue}
                                            onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                                        />
                                        <Label
                                            htmlFor={field.name}
                                            className="text-sm font-medium text-slate-800 cursor-pointer select-none"
                                        >
                                            {field.label}
                                        </Label>
                                    </div>
                                )}

                                {hasError && (
                                    <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => router.push(cancelUrl)}
                            className="gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer rounded-xl"
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
                                    {isEditing ? "Update" : "Save"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}