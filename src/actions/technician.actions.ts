// src/actions/technician.actions.ts

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import type { ActionResponse } from "@/types";
import type {
  ITechnician,
  ITechnicianFilterOptions,
  IPaginationOptions,
  IUpdateBookingStatusPayload,
  IUpdateTechnicianProfilePayload,
  IAvailabilitySlotPayload,
  IAvailabilitySlot,
  IBooking,
} from "@/types";



const getAllTechnicians = async (
  options: ITechnicianFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<ITechnician[]>> => {
  const endpoint = `/api/technicians${buildQueryString(options)}`;

  return executeAction<ITechnician[]>(
    () =>
      apiClient.get<ITechnician[]>(endpoint, {
        next: {
          revalidate: 60,
          tags: ["technicians"],
        },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch technicians",
    }
  );
};



const getTechnicianById = async (
  id: string
): Promise<ActionResponse<ITechnician>> => {
  const endpoint = `/api/technicians/${id}`;

  return executeAction<ITechnician>(
    () =>
      apiClient.get<ITechnician>(endpoint, {
        next: {
          revalidate: 60,
          tags: [`technician-${id}`],
        },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch technician details",
    }
  );
};



const getAvailability = async (): Promise<ActionResponse<IAvailabilitySlot[]>> => {
  const endpoint = "/api/technicians/availability";

  return executeAction<IAvailabilitySlot[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IAvailabilitySlot[]>(endpoint, {
        headers,
        next: { tags: ["technician-availability"] },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch availability slots",
    }
  );
};



const getTechnicianBookings = async (): Promise<ActionResponse<IBooking[]>> => {
  const endpoint = "/api/technicians/bookings";

  return executeAction<IBooking[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IBooking[]>(endpoint, {
        headers,
        next: { tags: ["technician-bookings"] },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch technician bookings",
    }
  );
};




const updateBookingStatus = async (
  bookingId: string,
  payload: IUpdateBookingStatusPayload
): Promise<ActionResponse<IBooking>> => {
  const endpoint = `/api/technicians/bookings/${bookingId}`;

  return executeAction<IBooking>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch<IBooking>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("technician-bookings","max");
        revalidatePath("/technician/bookings");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update booking status",
    }
  );
};





const updateProfile = async (
  payload: IUpdateTechnicianProfilePayload
): Promise<ActionResponse<ITechnician>> => {
  const endpoint = "/api/technicians/profile";

  return executeAction<ITechnician>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch<ITechnician>(endpoint, payload, {
        headers,
      });

      if (response.success) {
        revalidateTag("user-profile","max");
        revalidateTag("technicians","max");
        revalidatePath("/technician/profile");
        revalidatePath("/technician/profile/edit");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update technician profile",
    }
  );
};




const setAvailability = async (
  payload: IAvailabilitySlotPayload[]
): Promise<ActionResponse<unknown>> => {
  const endpoint = "/api/technicians/availability";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("technician-availability","max");
        revalidatePath("/technician/availability");
        revalidatePath("/technician/availability/edit");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to set availability slots",
    }
  );
};


export {
  getAllTechnicians,
  getTechnicianById,
  getAvailability,
  getTechnicianBookings,
  updateBookingStatus,
  updateProfile,
  setAvailability,
};