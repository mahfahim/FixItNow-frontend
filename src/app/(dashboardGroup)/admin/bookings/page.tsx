// src/app/(dashboardGroup)/admin/bookings/page.tsx
import { Suspense } from "react";
import { getAllBookingsAdmin } from "@/actions/admin.actions";
import { AdminBookingsClient } from "@/components/share/admin-bookings-client";
import { IBooking, IPaginationOptions, PaginatedActionResponse } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminBookingsPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const limit = Number(resolvedParams.limit) || 5;
    const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
    const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined;
    const paymentStatus = typeof resolvedParams.paymentStatus === "string" ? resolvedParams.paymentStatus : undefined;

    const response = (await getAllBookingsAdmin({
        page,
        limit,
        search,
        status: status !== "ALL" ? status : undefined,
        paymentStatus: paymentStatus !== "ALL" ? paymentStatus : undefined,
    })) as PaginatedActionResponse<IBooking>;

    const bookings: IBooking[] = response?.data || [];
    const meta: IPaginationOptions = response?.meta || { page, limit, total: 0 };

    return (
        <Suspense
            fallback={
                <div className="p-6 text-center text-slate-500 bg-white rounded-xl border border-slate-200 m-6">
                    Loading bookings...
                </div>
            }
        >
            <AdminBookingsClient initialBookings={bookings} initialMeta={meta} />
        </Suspense>
    );
}