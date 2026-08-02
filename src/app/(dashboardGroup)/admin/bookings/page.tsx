// src/app/(dashboardGroup)/admin/bookings/page.tsx

import { getAllBookingsAdmin } from "../_actions/admin.actions";
import AdminBookingsTable from "../_components/AdminBookingsTable";

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminBookingsPage({ searchParams }: Props) {
    
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;


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
                <AdminBookingsTable bookings={bookings} meta={meta} />
            </div>
        </div>
    );
} 