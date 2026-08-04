// src/actions/booking.actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import {
  IBooking,
  ICreateBookingPayload,
  IUpdateBookingStatusPayload,
  IBookingFilterOptions,
  IPaginationOptions,
  BookingStatus,
} from "@/types";

export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Helper to get authorization header, accepting an optional override token
 */
async function getAuthHeader(explicitToken?: string): Promise<Record<string, string>> {
  if (explicitToken) {
    return { Authorization: `Bearer ${explicitToken}` };
  }
  return await getAuthHeaders();
}

/**
 * Helper to trigger cache revalidations for booking mutations
 */
function revalidateBookingCaches(bookingId?: string) {
  revalidateTag("customer-bookings", "default");
  revalidateTag("technician-bookings", "default");

  if (bookingId) {
    revalidateTag(`booking-${bookingId}`, "default");
    revalidatePath(`/technician/bookings/${bookingId}`, "page");
    revalidatePath(`/customer/bookings/${bookingId}`, "page");
  }

  revalidatePath("/technician", "page");
  revalidatePath("/technician/bookings", "page");
  revalidatePath("/customer/dashboard/bookings", "page");
  revalidatePath("/customer/bookings", "page");
}

/* ==========================================================================
   CUSTOMER & COMMON BOOKING ACTIONS
   ========================================================================== */

/**
 * Create a new booking request
 */
export async function createBooking(
  payload: ICreateBookingPayload,
  token?: string
): Promise<ActionResponse<IBooking>> {
  try {
    const authHeader = await getAuthHeader(token);

    const result = await apiClient.post<IBooking>("/api/bookings", payload, {
      headers: authHeader,
    });

    revalidateBookingCaches();

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error creating booking.";
    console.error("createBooking error:", message);
    return { success: false, error: message };
  }
}

/**
 * Get all bookings for the logged-in customer
 */
export async function getCustomerBookings(
  filters?: IBookingFilterOptions,
  token?: string
): Promise<ActionResponse<IBooking[]>> {
  try {
    const authHeader = await getAuthHeader(token);
    const queryParams = new URLSearchParams();

    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.paymentStatus) queryParams.append("paymentStatus", filters.paymentStatus);
    if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/api/bookings${queryString ? `?${queryString}` : ""}`;

    return await apiClient.get<IBooking[]>(endpoint, {
      headers: authHeader,
      next: {
        revalidate: 15,
        tags: ["customer-bookings"],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching customer bookings.";
    console.error("getCustomerBookings error:", message);
    return { success: false, error: message, data: [] };
  }
}

/**
 * Get booking details by ID
 */
export async function getBookingById(
  bookingId: string,
  token?: string
): Promise<ActionResponse<IBooking>> {
  try {
    const authHeader = await getAuthHeader(token);

    return await apiClient.get<IBooking>(`/api/bookings/${bookingId}`, {
      headers: authHeader,
      next: {
        revalidate: 15,
        tags: [`booking-${bookingId}`],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching booking details.";
    console.error("getBookingById error:", message);
    return { success: false, error: message };
  }
}

/**
 * Update status of a booking (Shared Core Action)
 */
export async function updateBookingStatus(
  bookingId: string,
  payload: IUpdateBookingStatusPayload,
  token?: string
): Promise<ActionResponse<IBooking>> {
  try {
    const authHeader = await getAuthHeader(token);

    const result = await apiClient.patch<IBooking>(`/api/bookings/${bookingId}/status`, payload, {
      headers: authHeader,
    });

    revalidateBookingCaches(bookingId);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error updating booking status.";
    console.error("updateBookingStatus error:", message);
    return { success: false, error: message };
  }
}

/**
 * Cancel booking by Customer
 */
export async function cancelCustomerBooking(
  bookingId: string,
  reason?: string,
  token?: string
): Promise<ActionResponse<IBooking>> {
  return updateBookingStatus(
    bookingId,
    {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason || "Cancelled by customer via app",
      note: "Cancelled by customer via app",
    },
    token
  );
}

/* ==========================================================================
   TECHNICIAN SPECIFIC BOOKING ACTIONS
   ========================================================================== */

/**
 * Fetch assigned bookings for the logged-in technician
 */
export async function getTechnicianBookings(
  filters: IBookingFilterOptions = {},
  pagination: IPaginationOptions = { page: 1, limit: 10 },
  token?: string
): Promise<ActionResponse<IBooking[]>> {
  try {
    const authHeader = await getAuthHeader(token);
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append("status", filters.status);
    if (filters.paymentStatus) queryParams.append("paymentStatus", filters.paymentStatus);
    if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    queryParams.append("page", String(pagination.page || 1));
    queryParams.append("limit", String(pagination.limit || 10));
    if (pagination.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    return await apiClient.get<IBooking[]>(`/api/bookings?${queryParams.toString()}`, {
      headers: authHeader,
      next: {
        revalidate: 15,
        tags: ["technician-bookings"],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch bookings";
    console.error("Error fetching technician bookings:", message);
    return { success: false, error: message, data: [] };
  }
}

/**
 * Get details of a single technician booking by ID
 */
export async function getTechnicianBookingById(
  bookingId: string,
  token?: string
): Promise<ActionResponse<IBooking>> {
  return getBookingById(bookingId, token);
}

/**
 * Core action to update technician booking status (wraps updateBookingStatus)
 */
export async function updateTechnicianBookingStatus(
  bookingId: string,
  payload: IUpdateBookingStatusPayload,
  token?: string
): Promise<ActionResponse<IBooking>> {
  return updateBookingStatus(bookingId, payload, token);
}

/**
 * Helper Actions for quick Technician Operations
 */

// 1. Accept Request
export async function acceptBookingRequest(
  bookingId: string,
  token?: string
): Promise<ActionResponse<IBooking>> {
  return updateBookingStatus(
    bookingId,
    {
      status: BookingStatus.ACCEPTED,
      note: "Booking request accepted by technician",
    },
    token
  );
}

// 2. Decline Request
export async function declineBookingRequest(
  bookingId: string,
  reason?: string,
  token?: string
): Promise<ActionResponse<IBooking>> {
  return updateBookingStatus(
    bookingId,
    {
      status: BookingStatus.DECLINED,
      cancellationReason: reason || "Not available at this time",
      note: "Booking request declined by technician",
    },
    token
  );
}

// 3. Mark Job as In Progress
export async function startBookingJob(
  bookingId: string,
  token?: string
): Promise<ActionResponse<IBooking>> {
  return updateBookingStatus(
    bookingId,
    {
      status: BookingStatus.IN_PROGRESS,
      note: "Technician has started the service job",
    },
    token
  );
}

// 4. Mark Job as Completed
export async function completeBookingJob(
  bookingId: string,
  note?: string,
  token?: string
): Promise<ActionResponse<IBooking>> {
  return updateBookingStatus(
    bookingId,
    {
      status: BookingStatus.COMPLETED,
      note: note || "Job successfully completed",
    },
    token
  );
}