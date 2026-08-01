// src/app/(dashboardGroup)/customer/dashboard/services/[service-id]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServiceById } from "@/actions/services.actions";
import {
    ArrowLeft,
    Clock,
    Star,
    CheckCircle2,
    CalendarCheck,
    Tag,
    ShieldCheck,
} from "lucide-react";

interface SingleServicePageProps {
    params: Promise<{
        "service-id": string;
    }>;
}

export default async function SingleServicePage({ params }: SingleServicePageProps) {
    const resolvedParams = await params;
    const serviceId = resolvedParams["service-id"];

    const res = await getServiceById(serviceId);

    if (!res?.success || !res?.data) {
        notFound();
    }

    const service = res.data;
    const categoryName =
        typeof service.category === "object"
            ? service.category?.name
            : service.category || "General";

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Back Link */}
            <Link
                href="/customer/dashboard/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
            </Link>

            {/* Main Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Image & Description */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <Image
                            src={service.imageUrl || "/placeholder-service.jpg"}
                            alt={service.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute top-4 left-4">
                            <span className="px-3.5 py-1.5 text-xs font-semibold bg-white/90 backdrop-blur-md text-blue-600 rounded-full border border-blue-200 shadow-sm flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5" />
                                {categoryName}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Main Title */}
                        <h1 className="text-3xl font-extrabold text-slate-900">
                            {service.title}
                        </h1>

                        {/* Rating & Time */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 border-y border-slate-200 py-3">
                            <span className="flex items-center gap-1 text-amber-500 font-semibold">
                                <Star className="w-4 h-4 fill-amber-500" />
                                {service.rating ? service.rating.toFixed(1) : "5.0"} Rating
                            </span>
                            {service.duration && (
                                <span className="flex items-center gap-1 text-slate-600">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    Estimated Time: {service.duration}
                                </span>
                            )}
                        </div>

                        {/* About Section */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900">
                                About this Service
                            </h3>
                            <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                                {service.description}
                            </p>
                        </div>

                        {/* Included Features */}
                        <div className="space-y-3 pt-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                What is Included
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Professional & Verified Technician
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Service Guarantee Included
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Transparent Pricing
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    24/7 Support Available
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right: Booking Summary Card */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 sticky top-6 space-y-6 shadow-xl">
                        <div>
                            <span className="text-xs text-slate-400 block mb-1 font-medium">
                                Total Price
                            </span>
                            <div className="text-3xl font-extrabold text-blue-400">
                                ৳{service.price}
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link
                                href={`/customer/dashboard/bookings/new?serviceId=${serviceId}`}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/25"
                            >
                                <CalendarCheck className="w-5 h-5" />
                                Book Service Now
                            </Link>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <ShieldCheck className="w-4 h-4 text-blue-400" />
                                Safe & Secure Service Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}