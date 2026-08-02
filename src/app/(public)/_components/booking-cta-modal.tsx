"use client";

import React from "react";
import Link from "next/link";
import { Calendar, X } from "lucide-react";

import { IService } from "@/types";

interface BookingCtaModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: IService | null;
}

export function BookingCtaModal({
    isOpen,
    onClose,
    service,
}: BookingCtaModalProps) {
    if (!isOpen || !service) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-6">
                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Content Header */}
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                        Book Service Prompt
                    </h3>
                    <p className="text-xs text-slate-500">
                        You are selecting <span className="font-semibold text-slate-800">{service.title}</span>
                    </p>
                </div>

                {/* Summary Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Estimated Duration</span>
                        <span className="font-semibold text-slate-800">{service.duration} mins</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Service Price</span>
                        <span className="font-bold text-indigo-600 text-sm">
                            ৳{Number(service.price).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link
                        href={`/customer/bookings/new?serviceId=${service.id}`}
                        className="flex items-center justify-center w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-indigo-100"
                    >
                        Proceed to Schedule
                    </Link>

                    <p className="text-[11px] text-center text-slate-500">
                        Requires an active account. If you don&apos;t have one, you will be prompted to sign up.
                    </p>
                </div>
            </div>
        </div>
    );
}