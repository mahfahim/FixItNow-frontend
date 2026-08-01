// src/app/(dashboardGroup)/customer/_components/service-customer.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, ArrowRight, Tag } from "lucide-react";

export interface IService {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    price: number;
    category?: string | { name: string };
    rating?: number;
    duration?: string;
    imageUrl?: string;
}

interface ServiceCardProps {
    service: IService;
}

export function ServiceCustomerCard({ service }: ServiceCardProps) {
    const serviceId = service._id || service.id;
    const categoryName =
        typeof service.category === "object"
            ? service.category?.name
            : service.category || "General";

    return (
        <div className="group bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between">
            <div>
                {/* Service Image */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <Image
                        src={service.imageUrl || "/placeholder-service.jpg"}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-blue-400 rounded-full border border-blue-500/30 flex items-center gap-1.5">
                            <Tag className="w-3 h-3" />
                            {categoryName}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                        {service.duration && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {service.duration}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {service.rating ? service.rating.toFixed(1) : "N/A"}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {service.title}
                    </h3>

                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>
                </div>
            </div>

            {/* Footer / Price & Details Link */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                <div>
                    <span className="text-xs text-slate-400 block">Starting from</span>
                    <span className="text-xl font-extrabold text-blue-400">
                        ৳{service.price}
                    </span>
                </div>

                <Link
                    href={`/customer/dashboard/services/${serviceId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20"
                >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}