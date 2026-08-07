// src/app/(dashboardGroup)/admin/users/page.tsx
import { getAllUsers } from "@/actions/admin.actions";
import { IUser, PaginatedActionResponse } from "@/types";
import { AdminUsersClient } from "@/components/share/admin-users-client";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const limit = 5;
    const searchTerm = typeof resolvedParams.searchTerm === "string" ? resolvedParams.searchTerm : "";

    const response = (await getAllUsers({
        page,
        limit,
        searchTerm,
    })) as PaginatedActionResponse<IUser>;

    const users: IUser[] = response?.data || [];
    const total = response?.meta?.total || users.length;

    return (
        <AdminUsersClient
            users={users}
            total={total}
            page={page}
            limit={limit}
            searchTerm={searchTerm}
        />
    );
}