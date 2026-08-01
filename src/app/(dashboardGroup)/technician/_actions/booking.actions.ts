// src/app/(dashboardGroup)/technician/_actions/booking.actions.ts 

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { 
  BookingStatus, 
  IBookingFilterOptions, 
  IPaginationOptions, 
  IUpdateBookingStatusPayload 
} from "@/types";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

/**
 * Helper to retrieve Auth Token from cookies
 */
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

/**
 * Fetch assigned bookings for the logged-in technician
 */
export async function getTechnicianBookings(
  filters: IBookingFilterOptions = {},
  pagination: IPaginationOptions = { page: 1, limit: 10 }
) {
  try {
    const headers = await getAuthHeaders();
    
    // Construct query parameters
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

    const res = await fetch(`${API_BASE_URL}/bookings?${queryParams.toString()}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching technician bookings:", error);
    return { success: false, message: "Failed to fetch bookings" };
  }
}

/**
 * Get details of a single booking by ID
 */
export async function getTechnicianBookingById(bookingId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    return { success: false, message: "Failed to fetch booking details" };
  }
}

/**
 * Core action to update booking status
 */
export async function updateTechnicianBookingStatus(
  bookingId: string,
  payload: IUpdateBookingStatusPayload
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      // Revalidate cache for real-time updates across dashboard
      revalidatePath("/technician");
      revalidatePath("/technician/bookings");
      revalidatePath(`/technician/bookings/${bookingId}`);
    }

    return data;
  } catch (error) {
    console.error(`Error updating status for booking ${bookingId}:`, error);
    return { success: false, message: "Failed to update booking status" };
  }
}

/**
 * Helper Actions for quick Technician Operations
 */

// 1. Accept Request
export async function acceptBookingRequest(bookingId: string) {
  return updateTechnicianBookingStatus(bookingId, {
    status: BookingStatus.ACCEPTED,
    note: "Booking request accepted by technician",
  });
}

// 2. Decline Request
export async function declineBookingRequest(bookingId: string, reason?: string) {
  return updateTechnicianBookingStatus(bookingId, {
    status: BookingStatus.DECLINED,
    cancellationReason: reason || "Not available at this time",
    note: "Booking request declined by technician",
  });
}

// 3. Mark Job as In Progress
export async function startBookingJob(bookingId: string) {
  return updateTechnicianBookingStatus(bookingId, {
    status: BookingStatus.IN_PROGRESS,
    note: "Technician has started the service job",
  });
}

// 4. Mark Job as Completed
export async function completeBookingJob(bookingId: string, note?: string) {
  return updateTechnicianBookingStatus(bookingId, {
    status: BookingStatus.COMPLETED,
    note: note || "Job successfully completed",
  });
}