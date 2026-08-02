import { Suspense } from "react";
import { getCustomerBookings } from "../_actions/booking.actions";
import { BookingCustomerView } from "../_components/booking-customer";
import { CalendarCheck, AlertCircle, Loader2 } from "lucide-react";
import { BookingStatus } from "@/types";

//  1. Force dynamic rendering for cookie/auth actions
export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        status?: string;
        searchTerm?: string;
    }>;
}

export default async function CustomerBookingsPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;

    const res = await getCustomerBookings({
        status: resolvedParams.status as BookingStatus | undefined,
        searchTerm: resolvedParams.searchTerm,
    });

    const bookings = res?.data || [];
    const isSuccess = res?.success ?? true;
    const errorMessage = res?.error || res?.message || "Failed to load bookings. Please try again.";

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CalendarCheck className="h-6 w-6 text-blue-600" />
                        My Service Bookings
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Track your requested services, scheduled visits, and completed jobs.
                    </p>
                </div>
            </div>

            {/* Server Action Error Alert */}
            {!isSuccess && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* ✅ 2. Wrap client view in Suspense */}
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            }>
                <BookingCustomerView
                    bookings={bookings}
                    currentStatus={resolvedParams.status}
                />
            </Suspense>
        </div>
    );
}