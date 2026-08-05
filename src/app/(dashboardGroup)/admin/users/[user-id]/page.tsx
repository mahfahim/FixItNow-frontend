// src/app/(dashboardGroup)/admin/users/[user-id]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { getAllUsers } from "../../../../../actions/admin.actions";
import { UserStatusCard } from "../../_components/user-status-card";
import { IUser, PaginatedActionResponse } from "@/types";

export default async function AdminUserDetailsPage({
    params,
}: {
    params: Promise<{ "user-id": string }>;
}) {
    const resolvedParams = await params;
    const userId = resolvedParams["user-id"];

    const response = (await getAllUsers({
        searchTerm: userId,
        limit: 1,
    })) as PaginatedActionResponse<IUser>;

    const users = response?.data || [];
    const matchedUser: IUser | undefined =
        users.find((u) => u.id === userId) || users[0];

    const userImage = matchedUser?.profileImage;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link
                href="/admin/users"
                className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-2"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Users
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Manage User Account</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Update user permissions, status, and view basic account details.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic User Information Display */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">

                        {/*  Added 'relative' class to parent for Next Image 'fill' to work */}
                        <div className="relative h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-white shadow-sm">
                            {userImage ? (
                                <Image
                                    src={userImage}
                                    alt={matchedUser?.name || "User Profile"}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            ) : (
                                <UserIcon className="h-8 w-8 text-indigo-600 z-10" />
                            )}
                        </div>

                        <div className="text-center space-y-1 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {matchedUser?.name || "Unknown User"}
                            </h2>
                            <p className="text-sm text-slate-500 truncate">
                                {matchedUser?.email || `ID: ${userId}`}
                            </p>
                            <span className="inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                                {matchedUser?.role || "USER"}
                            </span>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">ID</span>
                                <span className="font-mono text-xs text-slate-900 truncate w-24 text-right">
                                    {userId}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Joined</span>
                                <span className="text-slate-900">
                                    {matchedUser?.createdAt
                                        ? new Date(matchedUser.createdAt).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Management Controls */}
                <div className="md:col-span-2 space-y-6">
                    {/* Status Toggle Client Component */}
                    <UserStatusCard
                        userId={userId}
                        userName={matchedUser?.name || "Unknown User"}
                        userEmail={matchedUser?.email}
                        currentStatus={matchedUser?.status}
                        userImage={userImage}
                    />

                    {/* Placeholders for future admin controls */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-w-xl opacity-50">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            Advanced Settings
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Other administrative actions will appear here.
                        </p>
                        <button
                            disabled
                            className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}