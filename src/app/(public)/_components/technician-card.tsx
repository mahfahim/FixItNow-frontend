import Image from 'next/image';
import Link from 'next/link';

export interface Technician {
    id: string;
    bio: string;
    hourlyRate: string;
    averageRating: string;
    totalReviews: number;
    profileImage: string | null;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface TechnicianCardProps {
    technician: Technician;
}


const getValidImageUrl = (url: string | null | undefined) => {
    if (!url) return '/images/placeholder-avatar.jpg';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
        return url;
    }
    return '/images/placeholder-avatar.jpg';
};

export default function TechnicianCard({ technician }: TechnicianCardProps) {
    const numericRating = parseFloat(technician.averageRating || "0");
    const imageUrl = getValidImageUrl(technician.profileImage);

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Top Half: Image & Badge */}
            <div className="relative w-full h-56 bg-slate-100">
                <Image
                    src={imageUrl}
                    alt={`${technician.user?.name || 'Technician'} profile`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                />
                {numericRating >= 4.5 && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Top Rated
                    </div>
                )}
            </div>

            {/* Bottom Half: Details */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
                            {technician.user?.name}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 line-clamp-1">
                            {technician.bio}
                        </p>
                    </div>

                    {/* Rating Block */}
                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md shrink-0 ml-2">
                        <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-amber-700">{numericRating.toFixed(1)}</span>
                        <span className="text-xs text-amber-600/70 ml-1">({technician.totalReviews})</span>
                    </div>
                </div>

                {/* Pricing */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    <div>
                        <span className="text-xs text-slate-500 block">Starting from</span>
                        <span className="text-lg font-bold text-slate-900">${technician.hourlyRate}<span className="text-sm font-normal text-slate-500">/hr</span></span>
                    </div>

                    {/* Action Button */}
                    <Link
                        href={`/technicians/${technician.id}`}
                        className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}