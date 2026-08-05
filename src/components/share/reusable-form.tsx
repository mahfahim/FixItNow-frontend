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

    // Render-time state synchronization (prevents effect-driven cascading re-renders)
    const [prevInitialData, setPrevInitialData] = useState(initialData);
    const [formData, setFormData] = useState<T>(() => ({
        ...defaultValues,
        ...initialData,
    }));

    if (JSON.stringify(initialData) !== JSON.stringify(prevInitialData)) {
        setPrevInitialData(initialData);
        setFormData({
            ...defaultValues,
            ...initialData,
        });
    }

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
        <Card className="w-full bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-300">
            <CardHeader className="border-b border-slate-100 pb-5 bg-slate-50/50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600 transition-transform duration-300 group-hover:scale-105">
                        {icon || <Save className="h-5 w-5" />}
                    </div>
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-7 px-6 sm:px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3 font-medium animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                            <span className="leading-relaxed">{errors.general}</span>
                        </div>
                    )}

                    <div className="space-y-5">
                        {fields.map((field) => {
                            const fieldValue = formData[field.name];
                            const hasError = !!errors[field.name];

                            return (
                                <div key={field.name} className="group flex flex-col gap-2">
                                    {field.type !== "checkbox" && (
                                        <Label
                                            htmlFor={field.name}
                                            className={`text-sm font-semibold transition-colors duration-200 ${hasError ? "text-rose-600" : "text-slate-700 group-focus-within:text-blue-600"
                                                }`}
                                        >
                                            {field.label}
                                            {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                                        </Label>
                                    )}

                                    <div className="relative">
                                        {(field.type === "text" || field.type === "url" || field.type === "number") && (
                                            <Input
                                                id={field.name}
                                                type={field.type}
                                                value={(fieldValue as string | number) ?? ""}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all duration-200 shadow-sm rounded-xl h-11 ${field.fontMono ? "font-mono text-sm bg-slate-50/70 text-slate-800" : ""
                                                    } ${hasError
                                                        ? "border-rose-400 focus-visible:ring-4 focus-visible:ring-rose-500/15 focus-visible:border-rose-500"
                                                        : "border-slate-200 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:border-blue-600"
                                                    }`}
                                            />
                                        )}

                                        {field.type === "textarea" && (
                                            <Textarea
                                                id={field.name}
                                                rows={field.rows || 4}
                                                value={(fieldValue as string) ?? ""}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`bg-white text-slate-900 placeholder:text-slate-400 font-medium resize-none transition-all duration-200 shadow-sm rounded-xl p-3 ${hasError
                                                    ? "border-rose-400 focus-visible:ring-4 focus-visible:ring-rose-500/15 focus-visible:border-rose-500"
                                                    : "border-slate-200 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:border-blue-600"
                                                    }`}
                                            />
                                        )}

                                        {field.type === "checkbox" && (
                                            <div
                                                className="flex items-center space-x-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all duration-200 cursor-pointer group/checkbox shadow-sm"
                                                onClick={() => handleInputChange(field.name, !fieldValue)}
                                            >
                                                <Checkbox
                                                    id={field.name}
                                                    checked={!!fieldValue}
                                                    onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-300 transition-all duration-200 rounded-md"
                                                />
                                                <Label
                                                    htmlFor={field.name}
                                                    className="text-sm font-semibold text-slate-700 cursor-pointer select-none flex-1 group-hover/checkbox:text-slate-900 transition-colors"
                                                >
                                                    {field.label}
                                                    {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                                                </Label>
                                            </div>
                                        )}
                                    </div>

                                    {hasError && (
                                        <p className="text-[13px] text-rose-500 font-semibold flex items-center gap-1.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                            {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-6 mt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => router.push(cancelUrl)}
                            className="group gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer rounded-xl transition-all duration-200 active:scale-[0.98] h-11 px-5 font-semibold"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white gap-2 cursor-pointer rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 h-11 px-6 font-semibold"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isEditing ? "Save Changes" : "Create Item"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}