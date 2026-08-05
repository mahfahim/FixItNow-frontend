import { Suspense } from "react";
import { getCustomerBookings } from "@/actions/booking.actions";
import { BookingCustomerView } from "../_components/booking-customer";
import { CalendarCheck, AlertCircle, Loader2 } from "lucide-react";
import { BookingStatus } from "@/types";

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
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <CalendarCheck className="h-5 w-5" />
                        </div>
                        My Service Bookings
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Track your requested services, scheduled visits, and completed jobs.
                    </p>
                </div>
            </div>

            {/* Error Alert */}
            {!isSuccess && (
                <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm shadow-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <p className="font-medium">{errorMessage}</p>
                </div>
            )}

            {/* Client View with Suspense */}
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center p-16 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-xs text-slate-500 font-medium">Loading your bookings...</p>
                    </div>
                }
            >
                <BookingCustomerView
                    bookings={bookings}
                    currentStatus={resolvedParams.status}
                />
            </Suspense>
        </div>
    );
}