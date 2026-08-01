// src/app/(dashboardGroup)/technician/_components/technician-layout-client.tsx

"use client";

import { useState } from "react";
import { DashboardHeader } from "../../_components/dashboard-header";
import { DashboardSidebar } from "../../_components/dashboard-sidebar";

interface TechnicianLayoutClientProps {
    children: React.ReactNode;
    userName: string;
    userImage?: string;
}

export function TechnicianLayoutClient({
    children,
    userName,
    userImage,
}: TechnicianLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Technician Sidebar */}
            <DashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userRole="TECHNICIAN"
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader
                    onMenuClick={() => setIsSidebarOpen(true)}
                    userName={userName}
                    userImage={userImage}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}