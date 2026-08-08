// src/app/(dashboardGroup)/customer/_components/getMe-customer.tsx
"use client";

import React from "react";
import { IUser } from "@/types";
import { Mail, Shield, CheckCircle2, Clock, Copy } from "lucide-react";
import { useToast } from "@/providers/toast-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GetMeCustomerProps {
    user: IUser;
}

export function GetMeCustomer({ user }: GetMeCustomerProps) {
    const { success } = useToast();

    // Fallback image url resolve
    const userImageUrl = user?.profileImage || (user as unknown as { image?: string })?.image || "";

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
        <Card className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-800 shadow-lg relative overflow-hidden rounded-2xl">
            <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10 relative">
                    {/* User Avatar */}
                    <Avatar className="h-20 w-20 border-2 border-indigo-400/40 shadow-inner">
                        <AvatarImage src={userImageUrl} alt={user?.name || "Customer"} />
                        <AvatarFallback className="bg-indigo-600/30 text-indigo-200 text-xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    {/* User Details */}
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
    );
}