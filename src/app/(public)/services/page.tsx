import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Tag } from "lucide-react";
import { getAllServices } from "../_actions/service.actions";
import { IService } from "@/types";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        categoryId?: string;
    }>;
}


const getValidImageUrl = (images?: string[]) => {
    if (!images || images.length === 0) return "/images/placeholder-service.jpg";
    const firstImage = images[0];
    if (
        firstImage.startsWith("http://") ||
        firstImage.startsWith("https://") ||
        firstImage.startsWith("/")
    ) {
        return firstImage;
    }
    return "/images/placeholder-service.jpg";
};

export default async function ServicesPage({ searchParams }: PageProps) {

    const resolvedParams = await searchParams;
    const searchTerm = resolvedParams.search || "";
    const categoryIdTerm = resolvedParams.categoryId || resolvedParams.category || "";


    const response = await getAllServices({
        search: searchTerm,
        categoryId: categoryIdTerm,
    });

    const services: IService[] = response?.data || [];

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {searchTerm
                                ? `Search Results for "${searchTerm}"`
                                : "Explore Our Services"}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Find verified expert technicians for all your home repair & maintenance needs.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                            {services.length} {services.length === 1 ? "Service" : "Services"} Available
                        </span>
                    </div>
                </div>

                {/* Services List / Grid */}
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service: IService) => {
                            const categoryName =
                                typeof service.category === "object"
                                    ? service.category?.name
                                    : null;

                            return (
                                <div
                                    key={service.id}
                                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Image Box */}
                                        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                                            <Image
                                                src={getValidImageUrl(service.images)}
                                                alt={service.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {categoryName && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                                                        <Tag className="w-3 h-3 text-indigo-600" />
                                                        {categoryName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Box */}
                                        <div className="p-5 space-y-2">
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                {service.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer & Price */}
                                    <div className="p-5 pt-0 mt-2">
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                                    Price
                                                </span>
                                                <span className="text-lg font-black text-slate-900">
                                                    ৳{Number(service.price).toLocaleString()}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/services/${service.id}`}
                                                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                                            >
                                                Book Now
                                                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-800">
                                No Services Found
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                                We couldn&apos;t find any services matching &quot;
                                {searchTerm || categoryIdTerm}&quot;. Try searching with another keyword.
                            </p>
                        </div>
                        <Link
                            href="/services"
                            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-indigo-700 transition"
                        >
                            View All Services
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}