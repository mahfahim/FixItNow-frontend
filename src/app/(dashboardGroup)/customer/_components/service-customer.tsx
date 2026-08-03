// src/app/(dashboardGroup)/customer/_components/service-customer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, ArrowRight, Tag, Share2 } from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { IService } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ServiceCardProps {
    service: IService;
}

export function ServiceCustomerCard({ service }: ServiceCardProps) {
    const { success } = useToast();

    const serviceId =
        service.id || (service as unknown as { _id?: string })._id;

    const categoryName =
        service.category?.name ||
        (typeof service.category === "string" ? service.category : "General");

    const rawService = service as unknown as {
        imageUrl?: string;
        rating?: number;
    };

    const displayImage =
        (service.images && service.images.length > 0 ? service.images[0] : null) ||
        rawService.imageUrl ||
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=500";

    const rating =
        service.technician?.averageRating ??
        rawService.rating;

    const handleShare = () => {
        if (typeof window !== "undefined") {
            const link = `${window.location.origin}/customer/services/${serviceId}`;
            navigator.clipboard.writeText(link);
            success("Link Copied", "Service URL copied to clipboard!");
        }
    };

    return (
        <Card className="group bg-slate-900 border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between py-0">
            <div>
                {/* Service Image */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                    <Image
                        src={displayImage}
                        alt={service.title || "Service image"}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <Badge
                            variant="outline"
                            className="bg-slate-950/80 backdrop-blur-md text-blue-400 border-blue-500/30 font-semibold text-xs px-3 py-1 rounded-full gap-1.5"
                        >
                            <Tag className="w-3 h-3" />
                            {categoryName}
                        </Badge>
                    </div>

                    {/* Share Quick Action */}
                    <div className="absolute top-3 right-3 z-10">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            className="h-8 w-8 bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-900/90 rounded-full border border-slate-800"
                            title="Share Service Link"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                        {service.duration && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {service.duration} mins
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-amber-400 font-medium ml-auto">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {rating ? Number(rating).toFixed(1) : "N/A"}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {service.title}
                    </h3>

                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>
                </CardContent>
            </div>

            {/* Footer / Price & Details Link */}
            <CardFooter className="px-5 pb-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                    <span className="text-xs text-slate-400 block">Starting from</span>
                    <span className="text-xl font-extrabold text-blue-400">
                        ${service.price}
                    </span>
                </div>

                <Link href={`/customer/services/${serviceId}`}>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold px-3.5 py-2 h-auto gap-1.5 shadow-md shadow-blue-600/20">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}