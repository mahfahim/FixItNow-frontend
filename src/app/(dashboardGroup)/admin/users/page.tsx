// src/app/(dashboardGroup)/admin/users/page.tsx

import { getAllUsers } from "@/actions/admin.actions";
import { IUser, PaginatedActionResponse } from "@/types";
import { Search } from "lucide-react";
import { UsersTable } from "../_components/users-table";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const limit = 5;
    const searchTerm = typeof resolvedParams.search === "string" ? resolvedParams.search : "";

    const response = (await getAllUsers({
        page,
        limit,
        searchTerm,
    })) as PaginatedActionResponse<IUser>;

    const users: IUser[] = response?.data || [];
    const total = response?.meta?.total || users.length;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        View and manage all platform users (Customers, Technicians, Admins).
                    </p>
                </div>

                {/* Search visual placeholder */}
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        defaultValue={searchTerm}
                        className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>
            </div>

            <UsersTable users={users} total={total} page={page} limit={limit} />
        </div>
    );
}