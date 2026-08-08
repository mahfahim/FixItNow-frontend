import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTechnicianById } from "@/actions/technician.actions";
import { ActionResponse, ITechnician } from "@/types";
import {
    ArrowLeft,
    Star,
    ShieldCheck,
    Briefcase,
    Wrench,
    Calendar,
    CheckCircle2,
    Mail,
    Clock,
} from "lucide-react";

interface SingleTechnicianPageProps {
    params: Promise<{
        techId: string;
    }>;
}


type DetailedTechnician = ITechnician & {
    name?: string;
    email?: string;
    avatar?: string;
    price?: number | string;
    specialization?: string | string[];
    skills?: string[];
    rating?: number | string;
    experienceYears?: number;
};

export default async function SingleTechnicianPage({ params }: SingleTechnicianPageProps) {
    const resolvedParams = await params;
    const techId = resolvedParams.techId;

    if (!techId) {
        notFound();
    }

    const res = (await getTechnicianById(techId)) as ActionResponse<DetailedTechnician>;

    if (!res?.success || !res?.data) {
        notFound();
    }

    const tech = res.data;
    const name = tech.user?.name || tech.name || "Technician Profile";
    const email = tech.user?.email || tech.email;


    const image =
        tech.profileImage ||
        tech.user?.profileImage ||
        tech.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    const hourlyRate = tech.hourlyRate ?? tech.price ?? 0;
    const ratingValue = tech.averageRating ?? tech.rating;
    const experienceValue = tech.yearsOfExperience ?? tech.experienceYears ?? 1;

    const rawSpecialization = tech.specialization || tech.skills;
    const specializations: string[] = Array.isArray(rawSpecialization)
        ? rawSpecialization
        : typeof rawSpecialization === "string"
            ? [rawSpecialization]
            : ["General Repairs"];

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 text-slate-900">
            {/* Back Link */}
            <Link
                href="/customer/technicians"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Technicians
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Bio & Skills */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover"
                                priority
                                unoptimized={image.startsWith("http")}
                            />
                        </div>

                        <div className="space-y-3 text-center sm:text-left flex-1">
                            <div>
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-2xl font-extrabold text-slate-900">
                                        {name}
                                    </h1>
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="text-sm text-slate-600 font-medium">
                                    Verified Specialist
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-700">
                                <span className="flex items-center gap-1 font-semibold text-amber-500">
                                    <Star className="w-4 h-4 fill-amber-500" />
                                    {ratingValue ? Number(ratingValue).toFixed(1) : "5.0"} Rating
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4 text-slate-500" />
                                    {experienceValue}+ Years Experience
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                        <h3 className="text-lg font-bold text-slate-900">About Technician</h3>
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                            {tech.bio ||
                                `${name} is a certified repair technician with extensive experience in providing top-quality repairs and maintenance services.`}
                        </p>
                    </div>

                    {/* Specializations & Skills */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-blue-600" />
                            Specialization & Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {specializations.map((spec: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Booking Action Box */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 sticky top-6 space-y-6 shadow-xl">
                        <div>
                            <span className="text-xs text-slate-400 block mb-1 font-medium">
                                Hourly Service Rate
                            </span>
                            <div className="text-3xl font-extrabold text-blue-400">
                                ${hourlyRate}
                                <span className="text-xs font-normal text-slate-400">/hr</span>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-slate-800 pt-4 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-400" />
                                Response Time: ~30 Mins
                            </div>
                            {email && (
                                <div className="flex items-center gap-2 truncate">
                                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span className="truncate">{email}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link
                                href={`/customer/bookings/new?technicianId=${techId}`}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/25"
                            >
                                <Calendar className="w-5 h-5" />
                                Book Technician Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}