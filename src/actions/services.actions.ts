"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import type { ActionResponse } from "@/types/api.types";
import type {
  IServiceFilterOptions,
  IPaginationOptions,
  ICreateServicePayload,
  IUpdateServicePayload,
} from "@/types";

/* ==========================================================================
   READ OPERATIONS
   ========================================================================== */

export async function getAllServices(
  options: IServiceFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/services${buildQueryString(options)}`;

  return executeAction(
    () =>
      apiClient.get(endpoint, {
        next: {
          revalidate: 60,
          tags: ["services"],
        },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch services",
    }
  );
}

export async function getServiceById(
  id: string
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/services/${id}`;

  return executeAction(
    () =>
      apiClient.get(endpoint, {
        next: {
          revalidate: 60,
          tags: [`service-${id}`],
        },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch service",
    }
  );
}

/* ==========================================================================
   MUTATION OPERATIONS
   ========================================================================== */

export async function createService(
  payload: ICreateServicePayload
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/services";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("services", "default");
        revalidatePath("/services");
        revalidatePath("/technician/services");
        revalidatePath("/admin/services");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to create service",
    }
  );
}

export async function updateService(
  id: string,
  payload: IUpdateServicePayload
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/services/${id}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("services", "default");
        revalidateTag(`service-${id}`, "default");
        revalidatePath("/services");
        revalidatePath(`/services/${id}`);
        revalidatePath("/technician/services");
        revalidatePath("/admin/services");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update service",
    }
  );
}

export async function deleteService(
  id: string
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/services/${id}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.delete(endpoint, { headers });

      if (response.success) {
        revalidateTag("services", "default");
        revalidateTag(`service-${id}`, "default");
        revalidatePath("/services");
        revalidatePath("/technician/services");
        revalidatePath("/admin/services");
      }

      return response;
    },
    {
      method: "DELETE",
      endpoint,
      fallbackMessage: "Failed to delete service",
    }
  );
}