// src/app/(dashboardGroup)/customer/profile/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    updateUserProfileSchema,
    UpdateUserProfileInput,
} from "@/act-schema/getMe.schema";
import { getMyProfile, updateMyProfile } from "@/actions/getMe.action";
import { GetMeCustomer } from "../../_components/getMe-customer_";
import { IUser, ActionResponse } from "@/types";
import { ArrowLeft, Save, Loader2, User, Mail, Lock, Image as ImageIcon } from "lucide-react";

export default function EditCustomerProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserProfileInput>({
        resolver: zodResolver(updateUserProfileSchema),
    });

    useEffect(() => {
        async function loadData() {
            try {
                const res = (await getMyProfile()) as ActionResponse<IUser>;
                const profileData = res?.data;

                if (res?.success && profileData) {
                    setUser(profileData);

                    const existingImg =
                        profileData.profileImage ||
                        (profileData as unknown as { image?: string })?.image ||
                        "";

                    reset({
                        name: profileData.name || "",
                        profileImage: existingImg,
                    });
                } else {
                    setServerError(res?.message || "Failed to load profile data.");
                }
            } catch (err) {
                setServerError("Error fetching profile details.");
            } finally {
                setLoadingProfile(false);
            }
        }
        loadData();
    }, [reset]);

    const onSubmit = async (data: UpdateUserProfileInput) => {
        setSubmitting(true);
        setServerError(null);
        setSuccessMsg(null);

        try {
            const payload = {
                name: data.name,
                profileImage: data.profileImage,
                image: data.profileImage,
            };

            const res = (await updateMyProfile(payload)) as ActionResponse<IUser>;

            if (res?.success) {
                setSuccessMsg("Profile updated successfully!");
                router.refresh();

                setTimeout(() => {
                    router.push("/customer/profile");
                }, 1000);
            } else {
                setServerError(res?.message || "Failed to update profile.");
            }
        } catch (err) {
            setServerError("An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingProfile) {
        return (
            <div className="flex items-center justify-center min-h-75">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/customer/profile"
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
                        <p className="text-xs text-slate-500">
                            Update your personal account information
                        </p>
                    </div>
                </div>
            </div>

            {/* Shared Customer Card Display */}
            {user && <GetMeCustomer user={user} />}

            {/* Edit Form */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                {serverError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                        {serverError}
                    </div>
                )}

                {successMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Editable Field: Name */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="Enter your name"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Editable Field: Profile Image URL */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                                Profile Image URL
                            </label>
                            <input
                                type="text"
                                {...register("profileImage")}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                            />
                            {errors.profileImage && (
                                <p className="text-xs text-red-500">{errors.profileImage.message}</p>
                            )}
                        </div>

                        {/* Read-Only Field: Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                Email Address (Cannot be changed)
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    disabled
                                    value={user?.email || ""}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed pr-10"
                                />
                                <Lock className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5" />
                            </div>
                        </div>

                        {/* Read-Only Field: Role */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                Role
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    disabled
                                    value={user?.role || "CUSTOMER"}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed pr-10"
                                />
                                <Lock className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5" />
                            </div>
                        </div>
                    </div>

                    {/* Form Controls */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link
                            href="/customer/profile"
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}