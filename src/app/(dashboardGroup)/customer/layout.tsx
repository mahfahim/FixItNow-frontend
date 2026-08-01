//  src/app/(dashboardGroup)/customer/layout.tsx

"use client";

import { useState } from "react";
import { DashboardHeader } from "../_components/dashboard-header";
import { DashboardSidebar } from "../_components/dashboard-sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Current User Session State Placeholder
    const currentUser = {
        name: "Tanvir Ahmed",
        image: undefined,
        role: "CUSTOMER" as "ADMIN" | "TECHNICIAN" | "CUSTOMER",
    };

    return (
        /* Root Layout Container: Prevents full page scroll */
        <div className="h-screen w-full overflow-hidden bg-slate-50 flex flex-col lg:flex-row">
            {/* Fixed Sidebar */}
            <DashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userRole={currentUser.role}
            />

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Fixed Top Header */}
                <div className="shrink-0">
                    <DashboardHeader
                        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
                        userName={currentUser.name}
                        userImage={currentUser.image}
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