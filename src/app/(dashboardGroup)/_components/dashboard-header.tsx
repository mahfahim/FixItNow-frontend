// src/app/(dashboardGroup)/_components/dashboard-header.tsx

"use client";

import { useState } from "react";
import { Menu, Search, User as UserIcon, User } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    const { info, success } = useToast();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        info("Searching", `Looking for "${searchQuery}"...`);
    };

    const handleLogout = () => {
        success("Logged Out", "You have been logged out successfully.");
    };

    // Extract user initials for avatar fallback
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="h-16 border-b border-slate-200/80 bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Mobile Hamburger Toggle */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="lg:hidden text-slate-600 hover:bg-slate-100"
                    aria-label="Open Sidebar"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Global Dashboard Search Bar */}
                <form onSubmit={handleSearch} className="relative hidden sm:block w-64 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                        type="search"
                        placeholder="Search bookings, services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 h-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 focus-visible:bg-white transition-all placeholder:text-slate-400"
                    />
                </form>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notification Bell */}
                <NotificationDropdown />

                <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 h-auto hover:bg-slate-100 rounded-lg flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer">
                        <Avatar className="h-8 w-8 border border-slate-200">
                            {userImage && <AvatarImage src={userImage} alt={userName} />}
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs">
                                {userInitials || <UserIcon className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-800 leading-tight">
                                {userName}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">Dashboard</p>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {/* Dynamic Non-clickable Profile Info */}
                        <div className="px-3 py-2.5 select-none">
                            <div className="flex items-center gap-2.5">
                                <User className="h-4 w-4 text-slate-500 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-semibold text-white-800 truncate">
                                        {userName}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium">Active User</p>
                                </div>
                            </div>
                        </div>

                        <DropdownMenuSeparator />

                        {/* Logout Action */}
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >

                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}