//src/app/(dashboardGroup)/technician/_components/profile-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateMyProfile } from "@/actions/getMe.action";
import { ITechnician, IUser } from "@/types";
import { useToast } from "@/providers/toast-provider";
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
            const res = await updateMyProfile(formData);

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
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6"
        >
            {/* Profile Image Section */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    Profile Image URL
                </Label>
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
                    <Input
                        type="url"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.jpg"
                        className="rounded-xl text-sm border-slate-200"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bio */}
                <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4 text-slate-400" />
                        Professional Bio
                    </Label>
                    <Textarea
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell customers about your skills and experience..."
                        className="rounded-xl text-sm border-slate-200"
                    />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        Years of Experience
                    </Label>
                    <Input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        min="0"
                        className="rounded-xl text-sm border-slate-200"
                    />
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        Hourly Rate (৳)
                    </Label>
                    <Input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        className="rounded-xl text-sm border-slate-200"
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        Phone Number
                    </Label>
                    <Input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880..."
                        className="rounded-xl text-sm border-slate-200"
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
                        <Label className="text-xs font-medium text-slate-600">District</Label>
                        <Select
                            value={formData.district}
                            onValueChange={(val) => handleSelectChange("district", val)}
                        >
                            <SelectTrigger className="w-full rounded-xl text-sm border-slate-200 bg-white">
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
                        <Label className="text-xs font-medium text-slate-600">City / Area</Label>
                        <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 z-10" />
                            <Input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Mirpur, Dhanmondi"
                                className="pl-9 rounded-xl text-sm border-slate-200"
                            />
                        </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs font-medium text-slate-600">
                            Full Address Line
                        </Label>
                        <Input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="House No, Road No, Area details..."
                            className="rounded-xl text-sm border-slate-200"
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
                    className="rounded-xl text-sm text-slate-600 hover:bg-slate-100 border-slate-200"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Profile Changes
                </Button>
            </div>
        </form>
    );
}