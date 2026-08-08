"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IUser } from "@/types";
import {
    Edit3,
    User,
    Mail,
    Shield,
    Image as ImageIcon,
    Activity,
    CheckCircle2,
    Clock,
    Copy,
} from "lucide-react";
import { useToast } from "@/providers/toast-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface GetMeCustomerProps {
    user: IUser;
    className?: string;
}

export function GetMeCustomer({ user, className = "" }: GetMeCustomerProps) {
    const { success } = useToast();

    const avatarUrl = user?.profileImage || (user as unknown as { image?: string })?.image || "";

    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "N/A";

    const handleCopyEmail = () => {
        if (user?.email) {
            navigator.clipboard.writeText(user.email);
            success("Email Copied", "User email address copied to clipboard.");
        }
    };

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "CU";

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header Bar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Account Profile</h1>
                    <p className="text-xs text-slate-500">
                        Overview of your personal customer profile details
                    </p>
                </div>
                <Link
                    href="/customer/profile/edit"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Profile
                </Link>
            </div>

            {/* Overview Header Banner Card */}
            <Card className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-800 shadow-lg relative overflow-hidden rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10 relative">
                        {/* Avatar */}
                        <Avatar className="h-20 w-20 border-2 border-indigo-400/40 shadow-inner">
                            <AvatarImage src={avatarUrl} alt={user?.name || "Customer"} />
                            <AvatarFallback className="bg-indigo-600/30 text-indigo-200 text-xl font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        {/* Details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                                    {user?.name || "Customer User"}
                                </h2>
                                <Badge
                                    variant="outline"
                                    className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs gap-1 font-medium px-2.5 py-0.5 rounded-full"
                                >
                                    <CheckCircle2 className="h-3 w-3" />
                                    {user?.status || "ACTIVE"}
                                </Badge>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-2 text-sm text-slate-300 min-w-0">
                                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                <span className="truncate">{user?.email}</span>
                                {user?.email && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCopyEmail}
                                        className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-md shrink-0"
                                        title="Copy Email"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>

                            {/* Role & Date Info */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                                <span className="flex items-center gap-1">
                                    <Shield className="h-3.5 w-3.5 text-indigo-400" />
                                    Role: <strong className="text-slate-200">{user?.role}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                    Joined: <strong className="text-slate-200">{formattedDate}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Image Field */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                            Profile Image
                        </label>
                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={user.name || "Profile Image"}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            Full Name
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.name || "N/A"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            Email Address
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.email}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5 text-slate-400" />
                            Account Role
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.role}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-slate-400" />
                            Account Status
                        </label>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {user.status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetMeCustomer;