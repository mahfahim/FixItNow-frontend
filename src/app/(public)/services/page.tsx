import Image from "next/image";
import Link from "next/link";
import { getServices } from "../_actions/landing.actions";

interface Service {
    id: string;
    title: string;
    description: string;
    price: string;
    images: string[];
    isAvailable: boolean;
    category?: {
        name: string;
    };
}

interface PageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
    }>;
}

// Image URL validation helper
const getValidImageUrl = (images?: string[]) => {
    if (!images || images.length === 0) return "/images/placeholder-service.jpg";
    const firstImage = images[0];
    if (firstImage.startsWith("http://") || firstImage.startsWith("https://") || firstImage.startsWith("/")) {
        return firstImage;
    }
    return "/images/placeholder-service.jpg";
};

export default async function ServicesPage({ searchParams }: PageProps) {
    // Next.js 15/16 await searchParams
    const resolvedParams = await searchParams;
    const searchTerm = resolvedParams.search || "";
    const categoryTerm = resolvedParams.category || "";

    // Fetch matching services from server
    const response = await getServices({ search: searchTerm, category: categoryTerm });
    const services: Service[] = response?.data || [];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        {searchTerm ? `Search Results for "${searchTerm}"` : "All Services"}
                    </h1>
                    {categoryTerm && (
                        <p className="text-slate-600 mt-1">
                            Showing results for category: <span className="font-semibold">{categoryTerm}</span>
                        </p>
                    )}
                </div>

                {/* Services List / Grid */}
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative w-full h-48 bg-slate-100">
                                        <Image
                                            src={getValidImageUrl(service.images)}
                                            alt={service.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-5">
                                        {service.category?.name && (
                                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                {service.category.name}
                                            </span>
                                        )}
                                        <h3 className="text-lg font-bold text-slate-900 mt-2 line-clamp-1">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-slate-400 block">Price</span>
                                        <span className="text-lg font-bold text-slate-900">${service.price}</span>
                                    </div>
                                    <Link
                                        href={`/services/${service.id}`}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">No Services Found</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            We could not find any services matching &quot;{searchTerm || categoryTerm}&quot;. Try searching with another keyword.
                        </p>
                        <Link
                            href="/services"
                            className="px-5 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition"
                        >
                            View All Services
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}