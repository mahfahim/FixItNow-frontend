// src/actions/services.actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/constants";
import type { ActionResponse } from "@/types/api.types";
import type {
  IServiceFilterOptions,
  IPaginationOptions,
  ICreateServicePayload,
  IUpdateServicePayload,
} from "@/types";

/* ==========================================================================
   READ OPERATIONS (PUBLIC)
   ========================================================================== */

/**
 * Fetch all services with optional search, filters, and pagination
 * Endpoint: GET /api/services
 */
export async function getAllServices(
  options: IServiceFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/services${buildQueryString(options)}`;

  return executeAction(
    () =>
      apiClient.get(endpoint, {
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
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

/**
 * Fetch a single service details by ID
 * Endpoint: GET /api/services/:id
 */
export async function getServiceById(
  id: string
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/services/${id}`;

  return executeAction(
    () =>
      apiClient.get(endpoint, {
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
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
   MUTATION OPERATIONS (TECHNICIAN / ADMIN)
   ========================================================================== */

/**
 * Create a new service
 * Endpoint: POST /api/services
 */
export async function createService(
  payload: ICreateServicePayload
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/services";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("services","default");
        revalidatePath("/services");
        revalidatePath("/technician/services");
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

/**
 * Update an existing service by ID
 * Endpoint: PATCH /api/services/:id
 */
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
        revalidateTag("services","default");
        revalidateTag(`service-${id}`,"default");
        revalidatePath("/services");
        revalidatePath(`/services/${id}`);
        revalidatePath("/technician/services");
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

/**
 * Delete a service by ID
 * Endpoint: DELETE /api/services/:id
 */
export async function deleteService(
  id: string
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/services/${id}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.delete(endpoint, { headers });

      if (response.success) {
        revalidateTag("services","default");
        revalidateTag(`service-${id}`,"default");
        revalidatePath("/services");
        revalidatePath("/technician/services");
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