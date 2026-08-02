"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateMyProfile } from "@/actions/getMe.action";
import { ITechnician, IUser } from "@/types";
import {
    Loader2,
    Phone,
    Briefcase,
    DollarSign,
    AlignLeft,
    Image as ImageIcon,
    MapPin,
    Building2,
} from "lucide-react";

const DISTRICT_OPTIONS = [
    "Dhaka",
    "Chattogram",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Rangpur",
    "Mymensingh",
    "Gazipur",
    "Narayanganj",
    "Cumilla",
];

interface ProfileFormProps {
    initialUser?: IUser | null;
    initialTechData?: ITechnician | null;
}

export function ProfileForm({ initialUser, initialTechData }: ProfileFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Initial state set from props. 
    // Parent কম্পোনেন্টের key পরিবর্তনের কারণে ডেটা এলেই এটি সঠিকভাবে পপুলেট হবে।
    const [formData, setFormData] = useState({
        bio: initialTechData?.bio || "",
        yearsOfExperience: initialTechData?.yearsOfExperience || 0,
        hourlyRate: Number(initialTechData?.hourlyRate) || 0,
        phone: initialTechData?.phone || "",
        profileImage: initialTechData?.profileImage || initialUser?.profileImage || "",
        district: initialTechData?.district || "",
        city: initialTechData?.city || "",
        address: initialTechData?.address || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        try {
            const res = await updateMyProfile(formData);

            if (!res?.success) {
                setErrorMsg(res?.message || "Failed to update profile.");
                return;
            }

            router.push("/technician/profile");
            router.refresh();
        } catch (err) {
            console.error("Error updating profile:", err);
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

            {/* Profile Image Section */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    Profile Image URL
                </label>
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                        {formData.profileImage ? (
                            <Image
                                src={formData.profileImage}
                                alt="Profile Preview"
                                fill
                                sizes="64px"
                                unoptimized
                                className="object-cover"
                            />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                        )}
                    </div>
                    <input
                        type="url"
                        name="profileImage"
                        value={formData.profileImage || ""}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bio */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4 text-slate-400" />
                        Professional Bio
                    </label>
                    <textarea
                        name="bio"
                        rows={3}
                        value={formData.bio || ""}
                        onChange={handleChange}
                        placeholder="Tell customers about your skills and experience..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        Years of Experience
                    </label>
                    <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience || 0}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        Hourly Rate (৳)
                    </label>
                    <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate || 0}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        placeholder="+880..."
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                    />
                </div>
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Address Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* District Dropdown */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">District</label>
                        <select
                            name="district"
                            value={formData.district || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 bg-white"
                        >
                            <option value="">Select District</option>
                            {DISTRICT_OPTIONS.map((dist) => (
                                <option key={dist} value={dist}>
                                    {dist}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City / Area Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">City / Area</label>
                        <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleChange}
                                placeholder="e.g. Mirpur, Dhanmondi"
                                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-medium text-slate-600">Full Address Line</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            placeholder="House No, Road No, Area details..."
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
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
                    Save Profile Changes
                </button>
            </div>
        </form>
    );
}