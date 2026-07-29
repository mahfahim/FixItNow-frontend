import Image from 'next/image';
import Link from 'next/link';

// Updated interface to match your backend exactly
interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    isActive: boolean;
}

interface ServiceGridProps {
    categories: Category[];
}

export default function ServiceGrid({ categories }: ServiceGridProps) {
    // Filter for only active categories if desired, or handle empty state
    const activeCategories = categories.filter(c => c.isActive);

    if (!activeCategories || activeCategories.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No service categories available at the moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeCategories.map((category) => (
                <Link
                    key={category.id}
                    href={`/services?category=${category.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    {/* Image Container */}
                    <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                        <Image
                            src={category.icon || '/images/placeholder-service.jpg'}
                            alt={`${category.name} service`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="p-5">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {category.name}
                        </h3>

                        {category.description && (
                            <p className="text-sm text-slate-500 line-clamp-2">
                                {category.description}
                            </p>
                        )}

                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Browse services
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}