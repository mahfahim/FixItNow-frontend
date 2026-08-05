// src/app/(dashboardGroup)/admin/bookings/page.tsx
import { Suspense } from "react";
import { getAllBookingsAdmin } from "@/actions/admin.actions";
import AdminBookingsTable from "../_components/AdminBookingsTable";
import { IBooking, IPaginatedMeta, PaginatedActionResponse } from "@/types";

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
    const meta: IPaginatedMeta = response?.meta || { page, limit, total: 0 };

    return (
        <div className="p-6 w-full space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">All Bookings</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage and monitor all platform service bookings.
                    </p>
                </div>
            </div>

            <Suspense
                fallback={
                    <div className="p-6 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                        Loading bookings table...
                    </div>
                }
            >
                <AdminBookingsTable bookings={bookings} meta={meta} />
            </Suspense>
        </div>
    );
}