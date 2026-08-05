import Link from "next/link";
import Image from "next/image";
import { getMyProfile } from "@/actions/getMe.action";
import { Edit, Star, Briefcase, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { IUser, ITechnician, ActionResponse } from "@/types";

export const dynamic = "force-dynamic";

export default async function TechnicianProfilePage() {
    const profileRes = (await getMyProfile()) as ActionResponse<IUser>;
    const user = profileRes?.data;
    const techProfile: ITechnician | null | undefined = user?.technicianProfile;

    const displayImage = techProfile?.profileImage || user?.profileImage;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Manage your personal information and professional details.
                    </p>
                </div>
                <Link
                    href="/technician/profile/edit"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
                >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Basic Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
                        {/* Profile Image / Avatar Display */}
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-indigo-100 text-indigo-600 border-2 border-indigo-200 flex items-center justify-center text-3xl font-bold mb-4 shrink-0">
                            {displayImage ? (
                                <Image
                                    src={displayImage}
                                    alt={user?.name || "Profile Image"}
                                    fill
                                    sizes="96px"
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : (
                                user?.name?.charAt(0).toUpperCase()
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-sm text-slate-500 mb-4">{user?.role}</p>

                        <div className="w-full space-y-3 mt-2 text-left">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="truncate">{user?.email}</span>
                            </div>
                            {techProfile?.phone && (
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>{techProfile.phone}</span>
                                </div>
                            )}
                            {(techProfile?.city || techProfile?.district) && (
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>
                                        {techProfile?.city}
                                        {techProfile?.district ? `, ${techProfile.district}` : ""}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Professional Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Overview</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                <p className="text-xl font-bold text-slate-900">{techProfile?.averageRating || "N/A"}</p>
                                <p className="text-xs text-slate-500">Rating</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                                <p className="text-xl font-bold text-slate-900">{techProfile?.totalCompletedJobs || 0}</p>
                                <p className="text-xs text-slate-500">Jobs Done</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <Briefcase className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                                <p className="text-xl font-bold text-slate-900">{techProfile?.yearsOfExperience || 0}</p>
                                <p className="text-xs text-slate-500">Years Exp.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xl font-bold text-slate-900 mt-1">${techProfile?.hourlyRate || 0}</p>
                                <p className="text-xs text-slate-500">Hourly Rate</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900">About Me</h4>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {techProfile?.bio || "No bio provided yet. Edit your profile to add a professional bio."}
                            </p>
                        </div>

                        {/* Detailed Address View */}
                        {(techProfile?.address || techProfile?.city || techProfile?.district) && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                    Detailed Address
                                </h4>
                                <p className="text-sm text-slate-600">
                                    {techProfile?.address || "No specific address line provided."}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {[techProfile?.city, techProfile?.district].filter(Boolean).join(", ")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}