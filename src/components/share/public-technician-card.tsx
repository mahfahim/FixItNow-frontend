"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Briefcase, ShieldCheck } from "lucide-react";

import { ITechnician } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TechnicianCardProps {
    technician: ITechnician;
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
    const profileImg = technician.profileImage || "/placeholder-avatar.png";
    const displayName = technician.user?.name || "Professional Technician";

    return (
        <Card className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all rounded-2xl">
            <CardContent className="p-6 space-y-4">
                {/* Header User Info */}
                <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                            src={profileImg}
                            alt={displayName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-slate-900 truncate">
                                {displayName}
                            </h3>
                            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {technician.city ? `${technician.city}, ${technician.district || ""}` : "Service Area Available"}
                        </p>
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{Number(technician.averageRating || 0).toFixed(1)}</span>
                            <span className="text-slate-400 font-normal">({technician.totalReviews} reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {technician.bio || "Experienced technician providing high quality maintenance and repair services."}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                        <Briefcase className="h-4 w-4 text-indigo-600" />
                        <div>
                            <span className="font-semibold block">{technician.yearsOfExperience} Years</span>
                            <span className="text-[10px] text-slate-500">Experience</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-slate-900 block text-sm">
                            ৳{Number(technician.hourlyRate).toLocaleString()}/hr
                        </span>
                        <span className="text-[10px] text-slate-500">Hourly Rate</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Link
                    href={`/technicians/${technician.id}`}
                    className="flex items-center justify-center w-full h-10 px-4 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    View Profile & Services
                </Link>
            </CardFooter>
        </Card>
    );
}