// src/components/share/admin-users-client.tsx

"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DataTable, Column } from "@/components/share/admin-data-table";
import { IUser, UserStatus } from "@/types";
import { ShieldCheck, ShieldAlert, Users } from "lucide-react";

interface AdminUsersClientProps {
    users?: IUser[];
    total?: number;
    page?: number;
    limit?: number;
    searchTerm?: string;
    title?: string;
    description?: string;
}

export function AdminUsersClient({
    users = [],
    total = 0,
    page = 1,
    limit = 5,
    searchTerm = "",
    title = "Manage Users",
    description = "View and manage all platform users (Customers, Technicians, Admins).",
}: AdminUsersClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearchChange = (val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
            params.set("searchTerm", val);
        } else {
            params.delete("searchTerm");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const columns: Column<IUser>[] = [
        {
            header: "User Details",
            cell: (user) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                        {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Role",
            cell: (user) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    {user.role}
                </span>
            ),
        },
        {
            header: "Status",
            cell: (user) => (
                <div className="flex items-center gap-1.5">
                    {user.status === UserStatus.ACTIVE ? (
                        <>
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            <span className="text-green-700 text-xs font-medium">Active</span>
                        </>
                    ) : (
                        <>
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                            <span className="text-red-700 text-xs font-medium">Blocked</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            header: "Joined Date",
            cell: (user) => (
                <span className="text-slate-500 text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
            ),
        },
        {
            header: "Actions",
            headerClassName: "text-right",
            cellClassName: "text-right",
            cell: (user) => (
                <Link
                    href={`/admin/users/${user.id}`}
                    className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                    Manage
                </Link>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>

            {/* Data Table */}
            <DataTable<IUser>
                data={users}
                columns={columns}
                keyExtractor={(user) => user.id}
                searchPlaceholder="Search users..."
                searchQuery={searchTerm}
                onSearchChange={handleSearchChange}
                enableClientSearch={false}
                emptyMessage="No users found"
                emptyDescription="No users found matching your criteria."
                emptyIcon={<Users className="h-5 w-5" />}
                pagination={{
                    page,
                    limit,
                    total,
                    onPageChange: handlePageChange,
                }}
            />
        </div>
    );
}