// src/app/(dashboardGroup)/_components/dashboard-header.tsx

"use client";

import Image from "next/image";
import { Menu, Search, User as UserIcon } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";

interface DashboardHeaderProps {
    onMenuClick: () => void;
    userName?: string;
    userImage?: string;
}

export function DashboardHeader({
    onMenuClick,
    userName = "User",
    userImage,
}: DashboardHeaderProps) {
    return (
        <header className="h-16 border-b border-slate-200/80 bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
            <div className="flex items-center gap-4">
                {/* Mobile Hamburger Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
                    aria-label="Open Sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Global Dashboard Search Bar */}
                <div className="relative hidden sm:block w-64 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search bookings, services..."
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notification Bell */}
                <NotificationDropdown />

                <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                {/* User Profile Summary */}
                <div className="flex items-center gap-3 cursor-pointer">
                    {userImage ? (
                        <Image
                            src={userImage}
                            alt={userName}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm border border-blue-200">
                            <UserIcon className="h-4 w-4" />
                        </div>
                    )}
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                            {userName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">Dashboard</p>
                    </div>
                </div>
            </div>
        </header>
    );
}