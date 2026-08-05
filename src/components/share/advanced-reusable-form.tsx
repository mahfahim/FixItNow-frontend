"use client";

import React, { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save, AlertCircle, Upload } from "lucide-react";

export type FieldType =
    | "text"
    | "number"
    | "password"
    | "email"
    | "url"
    | "textarea"
    | "checkbox"
    | "select"
    | "radio"
    | "file";

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface FormFieldConfig<T> {
    name: keyof T & string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    fontMono?: boolean;
    autoSlugFrom?: keyof T & string;
    options?: SelectOption[];
    accept?: string;
    colSpan?: 1 | 2;
    validate?: (value: unknown, formData: T) => string | undefined;
    renderCustom?: (
        value: unknown,
        onChange: (val: unknown) => void,
        isLoading: boolean
    ) => React.ReactNode;
}

export interface ActionResponse {
    success?: boolean;
    message?: string;
    error?: string;
}

export interface AdvancedReusableFormProps<T extends Record<string, unknown>> {
    title: string;
    icon?: React.ReactNode;
    fields: FormFieldConfig<T>[];
    initialData?: Partial<T>;
    defaultValues: T;
    isEditing?: boolean;
    cancelUrl: string;
    successRedirectUrl?: string;
    onSubmit: (data: T) => Promise<ActionResponse>;
    onSuccessMessage?: string;
}

const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

export function AdvancedReusableForm<T extends Record<string, unknown>>({
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
}: AdvancedReusableFormProps<T>) {
    const router = useRouter();
    const { success, error: toastError } = useToast();

    const [isPending, setIsPending] = useState(false);
    const [isPendingTransition, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<T>(() => ({
        ...defaultValues,
        ...initialData,
    }));

    // React pattern to update state during render when props change (avoids useEffect & cascading renders)
    const [prevInitialData, setPrevInitialData] = useState(initialData);
    if (initialData !== prevInitialData) {
        setPrevInitialData(initialData);
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                ...defaultValues,
                ...initialData,
            });
        }
    }

    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        fields.forEach((field) => {
            const val = formData[field.name];

            if (
                field.required &&
                (val === undefined ||
                    val === null ||
                    val === "" ||
                    (typeof val === "string" && !val.trim()))
            ) {
                newErrors[field.name] = `${field.label} is required.`;
            } else if (field.type === "url" && val && !/^https?:\/\/.+/.test(String(val))) {
                newErrors[field.name] = "Please enter a valid URL (starting with http:// or https://).";
            } else if (field.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) {
                newErrors[field.name] = "Please enter a valid email address.";
            } else if (field.validate) {
                const customErr = field.validate(val, formData);
                if (customErr) newErrors[field.name] = customErr;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [fields, formData]);

    const handleInputChange = (name: keyof T & string, value: unknown) => {
        setErrors((prev) => {
            if (!prev[name] && !prev.general) return prev;
            const updated = { ...prev };
            delete updated[name];
            delete updated.general;
            return updated;
        });

        setFormData((prev) => {
            const newData = { ...prev, [name]: value };

            if (!isEditing) {
                fields.forEach((f) => {
                    if (f.autoSlugFrom === name && typeof value === "string") {
                        newData[f.name] = generateSlug(value) as T[keyof T & string];
                    }
                });
            }

            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsPending(true);

        try {
            const res = await onSubmit(formData);

            if (res?.success) {
                const actionVerb = isEditing ? "Updated" : "Created";
                success(
                    `${title} ${actionVerb}`,
                    onSuccessMessage || res.message || `Item has been ${actionVerb.toLowerCase()} successfully.`
                );

                startTransition(() => {
                    router.push(successRedirectUrl || cancelUrl);
                    router.refresh();
                });
            } else {
                const msg = res?.message || res?.error || "Failed to save data. Please try again.";
                setErrors((prev) => ({ ...prev, general: msg }));
                toastError("Operation Failed", msg);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
            setErrors((prev) => ({ ...prev, general: msg }));
            toastError("Error", msg);
        } finally {
            setIsPending(false);
        }
    };

    const isLoading = isPending || isPendingTransition;

    return (
        <Card className="w-full bg-white shadow-sm hover:shadow-md transition-all duration-300 border-slate-200/80 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-5 bg-slate-50/50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600">
                        {icon || <Save className="h-5 w-5" />}
                    </div>
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-7 px-6 sm:px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3 font-medium animate-in fade-in duration-300 shadow-sm">
                            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                            <span className="leading-relaxed">{errors.general}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {fields.map((field) => {
                            const fieldValue = formData[field.name];
                            const hasError = !!errors[field.name];
                            const isFullWidth = field.colSpan === 2 || field.type === "textarea";

                            return (
                                <div
                                    key={field.name}
                                    className={`group flex flex-col gap-2 ${isFullWidth ? "md:col-span-2" : "md:col-span-1"
                                        }`}
                                >
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
                                        {field.renderCustom ? (
                                            field.renderCustom(
                                                fieldValue,
                                                (val) => handleInputChange(field.name, val),
                                                isLoading
                                            )
                                        ) : ["text", "number", "password", "email", "url"].includes(field.type) ? (
                                            <Input
                                                id={field.name}
                                                type={field.type}
                                                disabled={isLoading}
                                                value={(fieldValue as string | number) ?? ""}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all duration-200 shadow-sm rounded-xl h-11 ${field.fontMono ? "font-mono text-sm bg-slate-50/70 text-slate-800" : ""
                                                    } ${hasError
                                                        ? "border-rose-400 focus-visible:ring-4 focus-visible:ring-rose-500/15 focus-visible:border-rose-500"
                                                        : "border-slate-200 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:border-blue-600"
                                                    }`}
                                            />
                                        ) : field.type === "textarea" ? (
                                            <Textarea
                                                id={field.name}
                                                disabled={isLoading}
                                                rows={field.rows || 4}
                                                value={(fieldValue as string) ?? ""}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`bg-white text-slate-900 placeholder:text-slate-400 font-medium resize-none transition-all duration-200 shadow-sm rounded-xl p-3 ${hasError
                                                    ? "border-rose-400 focus-visible:ring-4 focus-visible:ring-rose-500/15 focus-visible:border-rose-500"
                                                    : "border-slate-200 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:border-blue-600"
                                                    }`}
                                            />
                                        ) : field.type === "select" ? (
                                            <select
                                                id={field.name}
                                                disabled={isLoading}
                                                value={(fieldValue as string | number) ?? ""}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                className={`w-full bg-white text-slate-900 font-medium transition-all duration-200 shadow-sm rounded-xl h-11 px-3 border appearance-none ${hasError
                                                    ? "border-rose-400 focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                                                    : "border-slate-200 hover:border-slate-300 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600"
                                                    }`}
                                            >
                                                <option value="" disabled>
                                                    {field.placeholder || "Select an option..."}
                                                </option>
                                                {field.options?.map((opt) => (
                                                    <option key={String(opt.value)} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : field.type === "radio" ? (
                                            <div className="flex flex-wrap gap-4 pt-1">
                                                {field.options?.map((opt) => (
                                                    <label
                                                        key={String(opt.value)}
                                                        className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={field.name}
                                                            disabled={isLoading}
                                                            checked={fieldValue === opt.value}
                                                            onChange={() => handleInputChange(field.name, opt.value)}
                                                            className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                                        />
                                                        {opt.label}
                                                    </label>
                                                ))}
                                            </div>
                                        ) : field.type === "file" ? (
                                            <div className="flex items-center gap-3">
                                                <label
                                                    htmlFor={field.name}
                                                    className={`flex-1 flex items-center justify-center gap-2 h-11 px-4 border border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600 font-medium text-sm ${hasError ? "border-rose-400" : "border-slate-300"
                                                        } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
                                                >
                                                    <Upload className="h-4 w-4 text-slate-500" />
                                                    <span>
                                                        {fieldValue instanceof File
                                                            ? fieldValue.name
                                                            : typeof fieldValue === "string" && fieldValue
                                                                ? fieldValue.split("/").pop()
                                                                : field.placeholder || "Choose File..."}
                                                    </span>
                                                    <input
                                                        id={field.name}
                                                        type="file"
                                                        accept={field.accept}
                                                        disabled={isLoading}
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleInputChange(field.name, file);
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        ) : field.type === "checkbox" ? (
                                            <div
                                                className={`flex items-center space-x-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 transition-all duration-200 cursor-pointer shadow-sm ${isLoading ? "pointer-events-none opacity-60" : ""
                                                    }`}
                                                onClick={() => !isLoading && handleInputChange(field.name, !fieldValue)}
                                            >
                                                <Checkbox
                                                    id={field.name}
                                                    disabled={isLoading}
                                                    checked={!!fieldValue}
                                                    onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-300 rounded-md"
                                                />
                                                <Label
                                                    htmlFor={field.name}
                                                    className="text-sm font-semibold text-slate-700 cursor-pointer select-none flex-1"
                                                >
                                                    {field.label}
                                                    {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                                                </Label>
                                            </div>
                                        ) : null}
                                    </div>

                                    {hasError && (
                                        <p className="text-[13px] text-rose-500 font-semibold flex items-center gap-1.5 pt-0.5 animate-in fade-in duration-200">
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
                            disabled={isLoading}
                            onClick={() => router.push(cancelUrl)}
                            className="group gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer rounded-xl transition-all duration-200 h-11 px-5 font-semibold"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white gap-2 cursor-pointer rounded-xl shadow-md transition-all duration-200 h-11 px-6 font-semibold"
                        >
                            {isLoading ? (
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