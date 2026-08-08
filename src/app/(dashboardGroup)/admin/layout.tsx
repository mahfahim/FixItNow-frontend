// src/app/(dashboardGroup)/admin/layout.tsx

"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { DashboardHeader } from "../_components/dashboard-header";
import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { getMyProfile } from "@/actions/getMe.action";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface IUserProfile {
    name?: string;
    email?: string;
    role?: "ADMIN" | "TECHNICIAN" | "CUSTOMER";
    image?: string;
}

export default function AdminDashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<IUserProfile | null>(null);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await getMyProfile();
                const profileData = res?.data || res?.data;
                if (res?.success && profileData) {
                    setUser(profileData);
                }
            } catch (error) {
                console.error("Failed to load user profile in layout:", error);
            }
        };

        fetchUserProfile();
    }, []);

    return (

        <div className="h-screen w-full overflow-hidden bg-slate-50 flex flex-col lg:flex-row">
            {/* Fixed Sidebar */}
            <DashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userRole={user?.role || "ADMIN"}
            />

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Fixed Top Header with Dynamic User Info */}
                <div className="shrink-0">
                    <DashboardHeader
                        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
                        userName={user?.name || "Admin"}
                        userImage={user?.image}
                    />
                </div>

                {/* Main Scrollable Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

