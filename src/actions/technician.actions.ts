// src/actions/technician.actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import type { ActionResponse } from "@/types/api.types";
import type {
  ITechnicianFilterOptions,
  IPaginationOptions,
  BookingStatus,
  IUpdateTechnicianProfilePayload,
  IAvailabilitySlotPayload,
} from "@/types";

/* ==========================================================================
   PUBLIC READ OPERATIONS
   ========================================================================== */

/**
 * Fetch all technicians with optional search, filters, and pagination.
 * Endpoint: GET /api/technicians
 */
export async function getAllTechnicians(
  options: ITechnicianFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/technicians${buildQueryString(options)}`;

  return executeAction(
    () =>
      apiClient.get(endpoint, {
        cache: "no-store",
        next: { tags: ["technicians"] },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch technicians",
    }
  );
}

/**
 * Fetch technician details by ID.
 * Endpoint: GET /api/technicians/:id
 */
export async function getTechnicianById(id: string): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/technicians/${id}`;

  return executeAction(
    () =>
      apiClient.get(endpoint, {
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
}

/* ==========================================================================
   AUTHENTICATED TECHNICIAN OPERATIONS
   ========================================================================== */

/**
 * Fetch availability slots for the logged-in technician.
 * Endpoint: GET /api/technicians/availability
 */
export async function getAvailability(): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/technicians/availability";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
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
}

/**
 * Get all bookings assigned to the logged-in technician.
 * Endpoint: GET /api/technicians/bookings
 */
export async function getTechnicianBookings(): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/technicians/bookings";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
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
}

interface UpdateBookingStatusPayload {
  status: BookingStatus;
  note?: string;
  cancellationReason?: string;
}

/**
 * Update the status of a specific booking (e.g., ACCEPTED, COMPLETED, CANCELLED).
 * Endpoint: PATCH /api/technicians/bookings/:id
 */
export async function updateBookingStatus(
  bookingId: string,
  payload: UpdateBookingStatusPayload
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/technicians/bookings/${bookingId}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("technician-bookings", "default");
        revalidatePath("/technician/bookings", "page");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update booking status",
    }
  );
}

/**
 * Update the logged-in technician's profile info.
 * Endpoint: PATCH /api/technicians/profile
 */
export async function updateProfile(
  payload: IUpdateTechnicianProfilePayload
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/technicians/profile";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, {
        headers,
      });

      if (response.success) {
        revalidateTag("user-profile", "default");
        revalidateTag("technicians", "default");
        revalidatePath("/technician/profile", "page");
        revalidatePath("/technician/profile/edit", "page");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update technician profile",
    }
  );
}

/**
 * Set or update availability slots for the logged-in technician.
 * Endpoint: PATCH /api/technicians/availability
 */
export async function setAvailability(
  payload: IAvailabilitySlotPayload[]
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/technicians/availability";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(
        endpoint,
        payload,
        { headers }
      );

      if (response.success) {
        revalidateTag("technician-availability", "default");
        revalidatePath("/technician/availability", "page");
        revalidatePath("/technician/availability/edit", "page");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to set availability slots",
    }
  );
}