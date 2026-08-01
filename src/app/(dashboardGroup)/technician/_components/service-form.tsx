// 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService } from "../_actions/services.actions";
import { ICategory, IService } from "@/types";
import { Loader2, Wrench, DollarSign, Clock, MapPin, Image as ImageIcon } from "lucide-react";

interface ServiceFormProps {
    categories: ICategory[];
    initialData?: IService | null;
    technicianId?: string;
}

export function ServiceForm({
    categories,
    initialData,
    technicianId,
}: ServiceFormProps) {
    const router = useRouter();
    const isEdit = Boolean(initialData);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        categoryId: initialData?.categoryId || (categories[0]?.id || ""),
        price: initialData?.price ? String(initialData.price) : "",
        duration: initialData?.duration ? String(initialData.duration) : "60",
        serviceArea: initialData?.serviceArea ? initialData.serviceArea.join(", ") : "",
        images: initialData?.images ? initialData.images.join(", ") : "",
        isAvailable: initialData?.isAvailable ?? true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!formData.title || !formData.categoryId || !formData.price) {
            setErrorMsg("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            const parsedServiceArea = formData.serviceArea
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            const parsedImages = formData.images
                .split(",")
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
                };

                const res = await updateService(initialData.id, payload);
                if (res?.success) {
                    router.push("/technician/services");
                    router.refresh();
                } else {
                    setErrorMsg(res?.message || "Failed to update service");
                }
            } else {
                const payload = {
                    technicianId,
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
                    router.push("/technician/services");
                    router.refresh();
                } else {
                    setErrorMsg(res?.message || "Failed to create service");
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-indigo-600" /> Service Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. AC Deep Cleaning & Gas Refill"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Category *</label>
                    <select
                        name="categoryId"
                        required
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-indigo-600" /> Price (৳) *
                    </label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="1"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="1500"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" /> Estimated Duration (Minutes) *
                    </label>
                    <input
                        type="number"
                        name="duration"
                        required
                        min="15"
                        step="15"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="60"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Service Areas */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Service Areas (Comma separated)
                    </label>
                    <input
                        type="text"
                        name="serviceArea"
                        value={formData.serviceArea}
                        onChange={handleChange}
                        placeholder="Dhanmondi, Gulshan, Uttara"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Images URLs */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-600" /> Image URLs (Comma separated)
                    </label>
                    <input
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Description *</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe what services are included in this package..."
                        className="w-full p-3.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Status Toggle (Edit mode only) */}
                {isEdit && (
                    <div className="flex items-center gap-3 md:col-span-2 pt-2">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="isAvailable" className="text-xs font-medium text-slate-700">
                            Service is available for customer booking
                        </label>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {isEdit ? "Update Service" : "Publish Service"}
                </button>
            </div>
        </form>
    );
}