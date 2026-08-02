"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShieldCheck, Wrench, Briefcase, ArrowRight } from "lucide-react";
import { ITechnician } from "@/types";

interface TechnicianCardProps {
    technician: ITechnician;
}

export function TechnicianCustomerCard({ technician }: TechnicianCardProps) {
    // ID Extraction Check
    const techId =
        technician.id ||
        (technician as unknown as { _id?: string })._id ||
        technician.userId ||
        technician.user?.id;

    const name =
        technician.user?.name ||
        (technician as unknown as { name?: string }).name ||
        "Technician";

    const rawTech = technician as unknown as { avatar?: string };
    const rawUser = technician.user as unknown as {
        profileImage?: string;
        avatar?: string;
    };

    const image =
        technician.profileImage ||
        rawTech.avatar ||
        rawUser?.profileImage ||
        rawUser?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    const hourlyRate =
        technician.hourlyRate ??
        (technician as unknown as { price?: number }).price ??
        0;

    const experience =
        technician.yearsOfExperience ??
        (technician as unknown as { experienceYears?: number }).experienceYears ??
        1;

    const rating =
        technician.averageRating ??
        (technician as unknown as { rating?: number }).rating ??
        5.0;

    let specializations = "General Expert";
    if (technician.services && technician.services.length > 0) {
        specializations = technician.services
            .map((s) => s.title || s.category?.name)
            .filter(Boolean)
            .join(", ");
    } else {
        const rawSpec = technician as unknown as {
            specialization?: string | string[];
            skills?: string[];
        };
        if (Array.isArray(rawSpec.specialization) && rawSpec.specialization.length > 0) {
            specializations = rawSpec.specialization.join(", ");
        } else if (typeof rawSpec.specialization === "string" && rawSpec.specialization.trim() !== "") {
            specializations = rawSpec.specialization;
        } else if (Array.isArray(rawSpec.skills) && rawSpec.skills.length > 0) {
            specializations = rawSpec.skills.join(", ");
        }
    }

    const rawStatus = technician as unknown as { isAvailable?: boolean; status?: string };
    const isAvailable =
        rawStatus.isAvailable !== false &&
        rawStatus.status !== "unavailable" &&
        rawStatus.status !== "busy" &&
        !technician.isDeleted;

    return (
        <div className="group bg-white border border-slate-200 hover:border-blue-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="p-5 space-y-4">
                {/* Header: Image & Availability */}
                <div className="flex items-start justify-between gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="64px"
                            unoptimized={image.startsWith("http")}
                        />
                    </div>

                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                    >
                        {isAvailable ? "Available Now" : "Busy"}
                    </span>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-lg group-hover:text-blue-600 transition-colors">
                        <h3 className="line-clamp-1">{name}</h3>
                        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    </div>

                    <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="line-clamp-1">{specializations}</span>
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            {Number(rating).toFixed(1)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {experience}+ Yrs Exp
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer / Price & Details */}
            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
                <div>
                    <span className="text-xs text-slate-500 block font-medium">Hourly Rate</span>
                    <span className="text-lg font-extrabold text-slate-900">
                        ${hourlyRate}<span className="text-xs font-normal text-slate-600">/hr</span>
                    </span>
                </div>

                <Link
                    href={`/customer/technicians/${techId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10"
                >
                    View Profile
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}