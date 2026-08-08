// src/app/(dashboardGroup)/_components/dashboard-sidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth.actions";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Wrench,
    Users,
    LogOut,
    X,
    Shield,
    ShoppingBag,
    Star,
    User,
    Home,
    Loader2,
    FolderPlus,
    Clock,
    Briefcase,
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userRole?: "ADMIN" | "TECHNICIAN" | "CUSTOMER";
}

export function DashboardSidebar({
    isOpen,
    onClose,
    userRole = "CUSTOMER",
}: SidebarProps) {
    const pathname = usePathname();
    const { success, error } = useToast();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const rolePrefix = userRole.toLowerCase();
    const basePath = `/${rolePrefix}`;

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            success("Logged out successfully", "You have been redirected to login.");
            window.location.href = "/login";
        } catch (err: unknown) {
            console.error("Failed to logout:", err);
            error("Logout Failed", "Something went wrong while signing out.");
            setIsLoggingOut(false);
        }
    };

    const getNavItems = () => {
        if (userRole === "ADMIN") {
            return [
                { label: "Admin Home", href: basePath, icon: Shield },
                { label: "Manage Users", href: `${basePath}/users`, icon: Users },
                { label: "All Bookings", href: `${basePath}/bookings`, icon: Calendar },
                { label: "Category Creation", href: `${basePath}/categories`, icon: FolderPlus },
                { label: "Services Manage", href: `${basePath}/services`, icon: Briefcase },
            ];
        }

        if (userRole === "TECHNICIAN") {
            return [
                { label: "Technician Home", href: basePath, icon: Wrench },
                { label: "Profile", href: `${basePath}/profile`, icon: User },
                { label: "Bookings", href: `${basePath}/bookings`, icon: Calendar },
                { label: "My Services", href: `${basePath}/services`, icon: Briefcase },
                { label: "Availability", href: `${basePath}/availability`, icon: Clock },
            ];
        }

        // CUSTOMER NAV ITEMS
        return [
            { label: "Customer Home", href: basePath, icon: Home },
            { label: "Customer Profile", href: `${basePath}/profile`, icon: User },
            { label: "Browse Services", href: `${basePath}/services`, icon: Briefcase },
            { label: "View Technicians", href: `${basePath}/technicians`, icon: Users },
            { label: "Track Booking", href: `${basePath}/bookings`, icon: ShoppingBag },
            { label: "Customer Review", href: `${basePath}/reviews`, icon: Star },
        ];
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-100 flex flex-col justify-between overflow-y-auto shrink-0 transition-transform duration-300 ease-in-out lg:static lg:z-auto ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div>
                    {/* Logo Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-xs">
                                F
                            </div>
                            <span>
                                FixIt<span className="text-blue-500">Now</span>
                            </span>
                        </Link>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
                            aria-label="Close Sidebar"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Current Role Badge */}
                    <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-800/80 flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Role:
                        </span>
                        <Badge
                            variant="outline"
                            className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold uppercase text-[11px] tracking-wide"
                        >
                            {userRole}
                        </Badge>
                    </div>

                    {/* Nav Items */}
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            // Exact match or sub-route match (e.g. /admin/services/create will match /admin/services)
                            const isActive =
                                pathname === item.href ||
                                (item.href !== basePath && pathname.startsWith(`${item.href}/`));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer / Sign Out Button */}
                <div className="p-4 border-t border-slate-800 shrink-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-start gap-3 px-3.5 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                                <span>Signing Out...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </>
                        )}
                    </Button>
                </div>
            </aside>
        </>
    );
}