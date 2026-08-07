// src/actions/services.actions.ts

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import type { ActionResponse } from "@/types";
import type {
  IService,
  IServiceFilterOptions,
  IPaginationOptions,
  ICreateServicePayload,
  IUpdateServicePayload,
} from "@/types";




const getAllServices = async (
  options: IServiceFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IService[]>> => {
  const endpoint = `/api/services${buildQueryString(options)}`;

  return executeAction<IService[]>(
    () =>
      apiClient.get<IService[]>(endpoint, {
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
};




const getServiceById = async (
  id: string
): Promise<ActionResponse<IService>> => {
  const endpoint = `/api/services/${id}`;

  return executeAction<IService>(
    () =>
      apiClient.get<IService>(endpoint, {
        next: {
          revalidate: 60,
          tags: [`service-${id}`],
        },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch service details",
    }
  );
};





const createService = async (
  payload: ICreateServicePayload
): Promise<ActionResponse<IService>> => {
  const endpoint = "/api/services";

  return executeAction<IService>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post<IService>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("services","max");
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
};




const updateService = async (
  id: string,
  payload: IUpdateServicePayload
): Promise<ActionResponse<IService>> => {
  const endpoint = `/api/services/${id}`;

  return executeAction<IService>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch<IService>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("services","max");
        revalidateTag(`service-${id}`,"max");
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
};




const deleteService = async (
  id: string
): Promise<ActionResponse<IService>> => {
  const endpoint = `/api/services/${id}`;

  return executeAction<IService>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.delete<IService>(endpoint, { headers });

      if (response.success) {
        revalidateTag("services","max");
        revalidateTag(`service-${id}`,"max");
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
};

export {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};