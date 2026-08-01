// src/app/(dashboardGroup)/_components/notification-dropdown.tsx
"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative transition-colors"
                aria-label="View notifications"
            >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Notifications
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                            New
                        </span>
                    </div>
                    <div className="p-4 text-center text-xs text-slate-500">
                        No new notifications right now.
                    </div>
                </div>
            )}
        </div>
    );
}