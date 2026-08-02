import { Suspense } from "react";
import { getAllBookingsAdmin } from "../_actions/admin.actions";
import AdminBookingsTable from "../_components/AdminBookingsTable";

export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminBookingsPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const limit = Number(resolvedParams.limit) || 10;

    const response = await getAllBookingsAdmin({ page, limit });

    const bookings = response?.data || [];
    const meta = response?.meta || { page: 1, limit: 10, total: 0 };

    return (
        <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">All Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and monitor all platform service bookings.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading bookings table...</div>}>
                    <AdminBookingsTable bookings={bookings} meta={meta} />
                </Suspense>
            </div>
        </div>
    );
}