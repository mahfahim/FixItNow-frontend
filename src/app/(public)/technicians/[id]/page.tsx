// src/app/(public)/technicians/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  Briefcase,
  Mail,
  ShieldCheck,
  Clock,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

import { getTechnicianById } from "@/actions/technician.actions";
import { IReview } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const res = await getTechnicianById(id);
  const technician = res.data;

  if (!res.success || !technician) {
    return { title: "Technician Not Found | FixItNow" };
  }

  return {
    title: `${technician.user?.name || "Technician Profile"} | FixItNow`,
    description: technician.bio || "Hire expert technicians on FixItNow.",
  };
}

export default async function TechnicianDetailPage({ params }: PageProps) {
  const { id } = await params;
  const res = await getTechnicianById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const technician = res.data;
  const reviews: IReview[] = technician.reviewsReceived || [];
  const totalReviews = technician.totalReviews ?? reviews.length;

  const calculatedAvg =
    reviews.length > 0
      ? reviews.reduce((acc: number, r: IReview) => acc + (r.rating || 0), 0) / reviews.length
      : 0;

  const avgRating = technician.averageRating
    ? Number(technician.averageRating).toFixed(1)
    : reviews.length > 0
      ? calculatedAvg.toFixed(1)
      : "New";

  const displayName = technician.user?.name || "Professional Technician";
  const profileImg = technician.profileImage;

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Main Profile Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* Avatar & User Info */}
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-600 font-extrabold text-3xl shadow-inner">
                {profileImg ? (
                  <Image
                    src={profileImg}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                    Verified Provider
                  </span>
                </div>

                {technician.user?.email && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {technician.user.email}
                  </p>
                )}

                <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                  {technician.city
                    ? `${technician.city}${technician.district ? `, ${technician.district}` : ""}`
                    : technician.district || "Service Area Available"}
                </p>
              </div>
            </div>

            {/* Rating & CTA */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-2xl text-center sm:text-right">
                <div className="flex items-center gap-1 text-amber-700 font-black text-xl justify-center sm:justify-end">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span>{avgRating}</span>
                </div>
                <p className="text-[11px] font-medium text-amber-800/80 mt-0.5">
                  {totalReviews} total {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              <Link
                href={`/services?technicianId=${technician.id}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-sm">
                  {technician.yearsOfExperience || 0} Years
                </span>
                <span className="text-slate-500 text-[11px]">Experience</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center gap-3">
              <Clock className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-sm">
                  ৳{Number(technician.hourlyRate || 0).toLocaleString()}/hr
                </span>
                <span className="text-slate-500 text-[11px]">Hourly Rate</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl col-span-2 sm:col-span-1 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-sm">
                  {totalReviews} Reviews
                </span>
                <span className="text-slate-500 text-[11px]">Feedback</span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {technician.bio && (
            <div className="pt-2 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900">About Provider</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {technician.bio}
              </p>
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              Customer Reviews
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {totalReviews}
              </span>
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs sm:text-sm space-y-1">
              <p className="font-semibold text-slate-700">No reviews yet</p>
              <p className="text-slate-400">This technician has not received any feedback yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: IReview & { customer?: { name?: string }; user?: { name?: string } }, idx: number) => (
                <div
                  key={review.id || idx}
                  className="p-5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">
                      {review.customer?.name || review.user?.name || "Verified Customer"}
                    </span>
                    <div className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{review.rating}/5</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {review.comment}
                  </p>

                  {review.createdAt && (
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}