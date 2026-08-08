"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createService, updateService } from "@/actions/services.actions";
import { ICategory, IService, ITechnician } from "@/types";
import {
    Loader2,
    Wrench,
    Banknote,
    Clock,
    MapPin,
    Image as ImageIcon,
    Tag,
    FileText,
    CheckCircle2,
    Power,
    UserCheck,
} from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceFormProps {
    categories: ICategory[];
    technicians?: ITechnician[];
    initialData?: IService | null;
    technicianId?: string;
    redirectPath?: string;
}

interface FormDataState {
    technicianId: string;
    title: string;
    description: string;
    categoryId: string;
    price: string;
    duration: string;
    serviceArea: string;
    images: string;
    isAvailable: boolean;
}

export function ServiceForm({
    categories,
    technicians = [],
    initialData,
    technicianId,
    redirectPath,
}: ServiceFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { success, error } = useToast();
    const isEdit = Boolean(initialData);

    const targetRedirectPath =
        redirectPath || (pathname.startsWith("/admin") ? "/admin/services" : "/technician/services");

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormDataState>({
        technicianId: initialData?.technicianId || technicianId || technicians[0]?.id || "",
        title: initialData?.title || "",
        description: initialData?.description || "",
        categoryId: initialData?.categoryId || categories[0]?.id || "",
        price: initialData?.price ? String(initialData.price) : "",
        duration: initialData?.duration ? String(initialData.duration) : "60",
        serviceArea: initialData?.serviceArea ? initialData.serviceArea.join(", ") : "",
        images: initialData?.images ? initialData.images.join("\n") : "",
        isAvailable: initialData?.isAvailable ?? true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.categoryId || !formData.price || !formData.technicianId) {
            error("Missing Fields", "Please fill in all required fields including Technician.");
            return;
        }

        try {
            setLoading(true);

            const parsedServiceArea = formData.serviceArea
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            const parsedImages = formData.images
                .split(/[\n,]+/)
                .map((s) => s.trim())
                .filter(Boolean);

            if (isEdit && initialData) {
                const payload = {
                    title: formData.title,
                    description: formData.description,
                    categoryId: formData.categoryId,
                    price: Number(formData.price),
                    duration: Number(formData.duration),
                    serviceArea: parsedServiceArea,
                    images: parsedImages,
                    isAvailable: formData.isAvailable,
                    technicianId: formData.technicianId,
                };

                const res = await updateService(initialData.id, payload);

                if (res?.success) {
                    success("Service Updated", res?.message || "Service updated successfully.");
                    router.push(targetRedirectPath);
                    router.refresh();
                } else {
                    error("Update Failed", res?.message || "Failed to update service.");
                    setLoading(false);
                }
            } else {
                const payload = {
                    technicianId: formData.technicianId,
                    title: formData.title,
                    description: formData.description,
                    categoryId: formData.categoryId,
                    price: Number(formData.price),
                    duration: Number(formData.duration),
                    serviceArea: parsedServiceArea,
                    images: parsedImages,
                };

                const res = await createService(payload);

                if (res?.success) {
                    success("Service Created", res?.message || "Service created successfully.");
                    router.push(targetRedirectPath);
                    router.refresh();
                } else {
                    error("Creation Failed", res?.message || "Failed to create service.");
                    setLoading(false);
                }
            }
        } catch (err) {
            console.error("Submit Error:", err);
            error("Error", "An unexpected error occurred. Please check network/image URLs.");
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: General Details */}
                    <div className="space-y-4">
                        <div className="border-b border-slate-100 pb-2">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                                1. General Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {technicians.length > 0 && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                        Select Technician <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.technicianId}
                                        onValueChange={(val) =>
                                            setFormData((prev) => ({ ...prev, technicianId: val ?? "" }))
                                        }
                                    >
                                        <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white text-black h-10 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600">
                                            <SelectValue placeholder="Select a Technician" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl bg-white border-slate-200">
                                            {technicians.map((tech) => (
                                                <SelectItem
                                                    key={tech.id}
                                                    value={tech.id}
                                                    className="text-xs sm:text-sm focus:bg-slate-100 text-black cursor-pointer"
                                                >
                                                    {tech.user?.name || `Technician (${tech.id.slice(0, 8)})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Title */}
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                                    Service Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. AC Deep Cleaning & Gas Refill"
                                    className="rounded-xl border-slate-200 text-black placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-600 h-10 text-xs sm:text-sm bg-white"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(val) =>
                                        setFormData((prev) => ({ ...prev, categoryId: val ?? "" }))
                                    }
                                >
                                    <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white text-black h-10 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl bg-white border-slate-200">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id} className="text-xs sm:text-sm focus:bg-slate-100 text-black">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                    <Banknote className="w-3.5 h-3.5 text-blue-600" />
                                    Price (৳) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    name="price"
                                    required
                                    min="1"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="1500"
                                    className="rounded-xl border-slate-200 text-black placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-600 h-10 text-xs sm:text-sm bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Execution & Locations */}
                    <div className="space-y-4">
                        <div className="border-b border-slate-100 pb-2">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                                2. Execution & Locations
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Duration */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                    Estimated Duration (Minutes) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    name="duration"
                                    required
                                    min="15"
                                    step="15"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="60"
                                    className="rounded-xl border-slate-200 text-black placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-600 h-10 text-xs sm:text-sm bg-white"
                                />
                            </div>

                            {/* Service Areas */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                    Service Areas (Comma separated)
                                </Label>
                                <Input
                                    type="text"
                                    name="serviceArea"
                                    value={formData.serviceArea}
                                    onChange={handleChange}
                                    placeholder="Dhanmondi, Gulshan, Uttara"
                                    className="rounded-xl border-slate-200 text-black placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-600 h-10 text-xs sm:text-sm bg-white"
                                />
                            </div>

                            {/* Image URLs */}
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                                    Image URLs (Comma or Newline separated)
                                </Label>
                                <Textarea
                                    name="images"
                                    rows={2}
                                    value={formData.images}
                                    onChange={handleChange}
                                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                                    className="rounded-xl border-slate-200 text-black placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-600 text-xs sm:text-sm bg-white resize-none font-mono text-[13px]"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe what services are included in this package..."
                                    className="rounded-xl border-slate-200 text-black placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-600 text-xs sm:text-sm bg-white resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Availability Status */}
                    {isEdit && (
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="isAvailable" className="text-xs font-semibold text-black flex items-center gap-2 cursor-pointer">
                                    <Power className="w-3.5 h-3.5 text-blue-600" />
                                    Service Availability
                                </Label>
                                <p className="text-[11px] text-black">
                                    Allow or pause new customer bookings for this service.
                                </p>
                            </div>
                            <Switch
                                id="isAvailable"
                                checked={formData.isAvailable}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({ ...prev, isAvailable: checked }))
                                }
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        {/* Light background button -> Black text */}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="rounded-xl text-xs sm:text-sm font-medium text-black hover:bg-slate-100 px-5 h-10 transition-colors"
                        >
                            Cancel
                        </Button>

                        {/* Blue background button -> White text */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 h-10 shadow-sm transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            )}
                            {isEdit ? "Update Service" : "Publish Service"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}