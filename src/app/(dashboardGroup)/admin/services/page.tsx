// src/app/(dashboardGroup)/admin/services/page.tsx
import { getAllServices } from "@/actions/services.actions";
import { ActionResponse, IService } from "@/types";
import { AdminServicesClient } from "@/components/share/admin-services-client";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
    const res = (await getAllServices({
        includeUnavailable: true,
        page: 1,
        limit: 9,
    })) as ActionResponse<IService[]>;

    return (
        <AdminServicesClient
            initialServices={res?.data || []}
            initialMeta={res?.meta}
        />
    );
}