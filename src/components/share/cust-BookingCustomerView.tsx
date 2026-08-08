// src/components/share/BookingCustomerView.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IBooking, BookingStatus } from "@/types";
import { BookingCard } from "./cust-BookingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarCheck, AlertCircle, Search, CheckCircle2 } from "lucide-react";

export interface BookingCustomerViewProps {
    bookings: IBooking[];
    isSuccess?: boolean;
    errorMessage?: string;
    currentStatus?: string;
    title?: string;
    description?: string;
    browseLink?: string;
}

export function BookingCustomerView({
    bookings,
    isSuccess = true,
    errorMessage = "Failed to load bookings. Please try again.",
    currentStatus,
    title = "My Service Bookings",
    description = "Track your requested services, scheduled visits, and completed jobs.",
    browseLink = "/customer/dashboard/technicians",
}: BookingCustomerViewProps) {
    const [activeTab, setActiveTab] = useState<string>(currentStatus || "ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const filterTabs = [
        { label: "All Bookings", value: "ALL" },
        { label: "Requested", value: BookingStatus.REQUESTED },
        { label: "Accepted", value: BookingStatus.ACCEPTED },
        { label: "In Progress", value: BookingStatus.IN_PROGRESS },
        { label: "Completed", value: BookingStatus.COMPLETED },
        { label: "Cancelled", value: BookingStatus.CANCELLED },
    ];

    const filteredBookings = bookings.filter((booking) => {
        const matchesTab = activeTab === "ALL" || booking.status === activeTab;
        const cleanQuery = searchQuery.trim().toLowerCase();
        const matchesSearch =
            cleanQuery === "" ||
            booking.service?.title?.toLowerCase().includes(cleanQuery) ||
            booking.technician?.user?.name?.toLowerCase().includes(cleanQuery) ||
            booking.address?.toLowerCase().includes(cleanQuery);

        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CalendarCheck className="h-6 w-6 text-blue-600" />
                        {title}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        {description}
                    </p>
                </div>
            </div>

            {/* Error Alert */}
            {!isSuccess && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70 p-1.5 rounded-2xl border border-slate-200/60">
                <div className="flex items-center gap-1.5 overflow-x-auto p-1 no-scrollbar">
                    {filterTabs.map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setActiveTab(tab.value)}
                                className={`text-xs font-semibold rounded-xl whitespace-nowrap px-3.5 py-2 transition-all ${isActive
                                        ? "bg-blue-600 text-white shadow-xs"
                                        : "bg-transparent text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full md:w-64 pr-1 pl-1 md:pl-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 md:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search service/tech..."
                        className="pl-9 text-xs rounded-xl bg-white border-slate-200/80 focus:ring-1 focus:ring-blue-600 h-9"
                    />
                </div>
            </div>

            {/* Bookings Grid */}
            {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings.map((booking, index) => (
                        <BookingCard
                            key={
                                booking.id ||
                                (booking as unknown as { _id?: string })._id ||
                                `booking-${index}`
                            }
                            booking={booking}
                        />
                    ))}
                </div>
            ) : (
                <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">No Bookings Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                        {activeTab === "ALL"
                            ? "You haven't placed any service requests yet."
                            : `No bookings found with status "${activeTab}".`}
                    </p>
                    <Link href={browseLink}>
                        <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs">
                            Browse Technicians
                        </Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}