// src/app/(dashboardGroup)/customer/bookings/page.tsx
// src/app/(dashboardGroup)/customer/bookings/page.tsx
import { getCustomerBookings } from "@/actions/booking.actions";
import { BookingCustomerView } from "@/components/share/cust-BookingCustomerView";
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

    return (
        <BookingCustomerView
            bookings={res?.data || []}
            isSuccess={res?.success ?? true}
            errorMessage={res?.error || res?.message}
            currentStatus={resolvedParams.status}
        />
    );
}