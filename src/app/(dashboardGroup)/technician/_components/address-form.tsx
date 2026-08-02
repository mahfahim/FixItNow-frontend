"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAddress } from "../_actions/address.actions";
import { ICreateAddress } from "@/types";
import { Loader2, MapPin, Tag, Hash } from "lucide-react";

export function AddressForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState<ICreateAddress>({
        label: "HOME",
        addressLine: "",
        city: "",
        district: "",
        postalCode: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        try {
            // Call POST Server Action
            const res = await addAddress(formData);

            if (!res?.success) {
                setErrorMsg(res?.message || "Failed to add address.");
                return;
            }

            router.push("/technician/profile");
            router.refresh();
        } catch (err) {
            console.error("Error adding address:", err);
            setErrorMsg("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address Label */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-400" />
                        Address Label
                    </label>
                    <select
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900"
                    >
                        <option value="HOME">Home</option>
                        <option value="WORK">Work</option>
                        <option value="OFFICE">Office</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        Postal Code
                    </label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="e.g. 1207"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>

                {/* City */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Dhaka"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>

                {/* District */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        District
                    </label>
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Dhaka"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>

                {/* Address Line */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Address Line
                    </label>
                    <input
                        type="text"
                        name="addressLine"
                        value={formData.addressLine}
                        onChange={handleChange}
                        required
                        placeholder="House 12, Road 5, Block B..."
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Address
                </button>
            </div>
        </form>
    );
}