"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateProfile } from "@/actions/technician.actions";
import { ITechnician, IUser } from "@/types";
import { useToast } from "@/providers/toast-provider";
import {
    Loader2,
    Phone,
    Briefcase,
    Banknote,
    AlignLeft,
    Image as ImageIcon,
    MapPin,
    Building2,
    User,
    CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

interface ProfileFormData {
    bio: string;
    yearsOfExperience: number;
    hourlyRate: number;
    phone: string;
    profileImage: string;
    district: string;
    city: string;
    address: string;
}

export function ProfileForm({ initialUser, initialTechData }: ProfileFormProps) {
    const router = useRouter();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<ProfileFormData>({
        bio: initialTechData?.bio || "",
        yearsOfExperience: Number(initialTechData?.yearsOfExperience) || 0,
        hourlyRate: Number(initialTechData?.hourlyRate) || 0,
        phone: initialTechData?.phone || "",
        profileImage: initialTechData?.profileImage || initialUser?.profileImage || "",
        district: initialTechData?.district || "",
        city: initialTechData?.city || "",
        address: initialTechData?.address || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSelectChange = (
        name: keyof ProfileFormData,
        value: string | null
    ) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value || "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updateProfile(formData);

            if (!res?.success) {
                error("Update Failed", res?.message || "Failed to update profile.");
                return;
            }

            success(
                "Profile Updated",
                res?.message || "Your profile has been updated successfully."
            );
            router.push("/technician/profile");
            router.refresh();
        } catch (err) {
            console.error("Error updating profile:", err);
            error("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-8"
        >
            {/* 1. Avatar & Profile Image Section */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    1. Profile Avatar
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-blue-100 shadow-xs shrink-0 flex items-center justify-center">
                        {formData.profileImage ? (
                            <Image
                                src={formData.profileImage}
                                alt="Profile Preview"
                                fill
                                sizes="80px"
                                unoptimized
                                className="object-cover"
                            />
                        ) : (
                            <User className="w-8 h-8 text-slate-400" />
                        )}
                    </div>
                    <div className="space-y-1.5 flex-1 w-full">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                            Image URL
                        </Label>
                        <Input
                            type="url"
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                            className="rounded-xl text-sm border-slate-200 bg-white h-10 focus-visible:ring-blue-500"
                        />
                        <p className="text-[11px] text-slate-400">
                            Paste a direct image URL (JPEG/PNG) to update your profile photo.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Professional Details Section */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    2. Professional Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Bio */}
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <AlignLeft className="w-3.5 h-3.5 text-blue-600" />
                            Professional Bio
                        </Label>
                        <Textarea
                            name="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell customers about your skills, expertise, and experience..."
                            className="rounded-xl text-sm border-slate-200 focus-visible:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            Years of Experience
                        </Label>
                        <Input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            min="0"
                            className="rounded-xl text-sm border-slate-200 h-10 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Hourly Rate */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Banknote className="w-3.5 h-3.5 text-blue-600" />
                            Hourly Rate ($)
                        </Label>
                        <Input
                            type="number"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            min="0"
                            className="rounded-xl text-sm border-slate-200 h-10 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-blue-600" />
                            Phone Number
                        </Label>
                        <Input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+88017..."
                            className="rounded-xl text-sm border-slate-200 h-10 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Address Details */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    3. Location & Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* District Dropdown */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            District
                        </Label>
                        <Select
                            value={formData.district}
                            onValueChange={(val) => handleSelectChange("district", val)}
                        >
                            <SelectTrigger className="w-full rounded-xl text-sm border-slate-200 bg-white h-10 focus:ring-blue-500">
                                <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {DISTRICT_OPTIONS.map((dist) => (
                                    <SelectItem key={dist} value={dist}>
                                        {dist}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City / Area Input */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            City / Area
                        </Label>
                        <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="e.g. Mirpur, Dhanmondi"
                            className="rounded-xl text-sm border-slate-200 h-10 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Full Address Line */}
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-semibold text-slate-700">
                            Full Address Line
                        </Label>
                        <Input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="House No, Road No, Area details..."
                            className="rounded-xl text-sm border-slate-200 h-10 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200 px-5 h-10 transition-colors"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium px-6 h-10 gap-2 shadow-sm transition-all"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4" />
                    )}
                    Save Profile Changes
                </Button>
            </div>
        </form>
    );
}