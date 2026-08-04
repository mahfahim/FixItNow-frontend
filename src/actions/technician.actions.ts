// src/actions/technician.actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import {
  API_ROUTES,
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  REVALIDATE_PATHS,
} from "@/lib/constants";
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
  const endpoint = `${API_ROUTES.TECHNICIANS.BASE}${buildQueryString(options)}`;

  return executeAction(
    () =>
      apiClient.get(endpoint, {
        cache: "no-store",
        next: { tags: [CACHE_TAGS.TECHNICIANS] },
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
  const endpoint = API_ROUTES.TECHNICIANS.BY_ID(id);

  return executeAction(
    () =>
      apiClient.get(endpoint, {
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: [CACHE_TAGS.TECHNICIAN(id)],
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
  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(API_ROUTES.TECHNICIANS.AVAILABILITY, {
        headers,
        next: { tags: [CACHE_TAGS.TECHNICIAN_AVAILABILITY] },
      });
    },
    {
      method: "GET",
      endpoint: API_ROUTES.TECHNICIANS.AVAILABILITY,
      fallbackMessage: "Failed to fetch availability slots",
    }
  );
}

/**
 * Get all bookings assigned to the logged-in technician.
 * Endpoint: GET /api/technicians/bookings
 */
export async function getTechnicianBookings(): Promise<ActionResponse<unknown>> {
  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(API_ROUTES.TECHNICIANS.BOOKINGS, {
        headers,
        next: { tags: [CACHE_TAGS.TECHNICIAN_BOOKINGS] },
      });
    },
    {
      method: "GET",
      endpoint: API_ROUTES.TECHNICIANS.BOOKINGS,
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
  const endpoint = API_ROUTES.TECHNICIANS.BOOKING_BY_ID(bookingId);

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag(CACHE_TAGS.TECHNICIAN_BOOKINGS, "default");
        revalidatePath(REVALIDATE_PATHS.TECHNICIAN_BOOKINGS, "page");
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
  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(API_ROUTES.TECHNICIANS.PROFILE, payload, {
        headers,
      });

      if (response.success) {
        revalidateTag(CACHE_TAGS.USER_PROFILE, "default");
        revalidateTag(CACHE_TAGS.TECHNICIANS, "default");
        revalidatePath(REVALIDATE_PATHS.TECHNICIAN_PROFILE, "page");
        revalidatePath(REVALIDATE_PATHS.TECHNICIAN_PROFILE_EDIT, "page");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint: API_ROUTES.TECHNICIANS.PROFILE,
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
  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(
        API_ROUTES.TECHNICIANS.AVAILABILITY,
        payload,
        { headers }
      );

      if (response.success) {
        revalidateTag(CACHE_TAGS.TECHNICIAN_AVAILABILITY, "default");
        revalidatePath(REVALIDATE_PATHS.TECHNICIAN_AVAILABILITY, "page");
        revalidatePath(REVALIDATE_PATHS.TECHNICIAN_AVAILABILITY_EDIT, "page");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint: API_ROUTES.TECHNICIANS.AVAILABILITY,
      fallbackMessage: "Failed to set availability slots",
    }
  );
}