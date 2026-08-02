"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import {
  IBooking,
  ICreateBookingPayload,
  IUpdateBookingStatusPayload,
  IBookingFilterOptions,
  BookingStatus,
} from "@/types";

const API_URL = (
  process.env.BACKEND_API_URL || "https://fixitnow-backend-tau.vercel.app"
).replace(/\/$/, "");

export interface ActionResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Helper function to automatically get Authorization header from cookie or parameter
 */
async function getAuthHeader(explicitToken?: string): Promise<Record<string, string>> {
  let token = explicitToken;
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("accessToken")?.value;
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Create a new booking request
 */
export async function createBooking(
  payload: ICreateBookingPayload,
  token?: string
): Promise<ActionResponse<IBooking>> {
  try {
    const authHeader = await getAuthHeader(token);

    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
        ...authHeader,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result.message || "Failed to create booking");
    }

    // 💡 Cache Revalidation (Both Tag with "max" profile and Path with "page")
    revalidateTag("customer-bookings", "max");
    revalidatePath("/technician/bookings", "page");
    revalidatePath("/technician", "page");
    revalidatePath("/customer/dashboard/bookings", "page");
    revalidatePath("/customer/bookings", "page");

    return {
      success: true,
      message: result.message || "Booking request created successfully",
      data: result.data,
    };
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
    const url = new URL(`${API_URL}/api/bookings`);

    if (filters?.status) {
      url.searchParams.append("status", filters.status);
    }
    if (filters?.paymentStatus) {
      url.searchParams.append("paymentStatus", filters.paymentStatus);
    }
    if (filters?.searchTerm) {
      url.searchParams.append("searchTerm", filters.searchTerm);
    }
    if (filters?.startDate) {
      url.searchParams.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      url.searchParams.append("endDate", filters.endDate);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
        ...authHeader,
      },
      next: {
        revalidate: 15,
        tags: ["customer-bookings"],
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch bookings (${res.status})`);
    }

    const result = await res.json();
    return { success: true, data: result.data || [] };
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

    const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
        ...authHeader,
      },
      next: {
        revalidate: 15,
        tags: [`booking-${bookingId}`],
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch booking details");
    }

    const result = await res.json();
    return { success: true, data: result.data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching booking details.";
    console.error("getBookingById error:", message);
    return { success: false, error: message };
  }
}

/**
 * Update status of a booking
 */
export async function updateBookingStatus(
  bookingId: string,
  payload: IUpdateBookingStatusPayload,
  token?: string
): Promise<ActionResponse<IBooking>> {
  try {
    const authHeader = await getAuthHeader(token);

    const res = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
        ...authHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update booking status");
    }

    const result = await res.json();

    // 💡 Cache Revalidation for both Customer & Technician
    revalidateTag("customer-bookings", "max");
    revalidateTag(`booking-${bookingId}`, "max");
    revalidatePath("/technician/bookings", "page");
    revalidatePath(`/technician/bookings/${bookingId}`, "page");
    revalidatePath("/customer/dashboard/bookings", "page");
    revalidatePath(`/customer/bookings/${bookingId}`, "page");

    return {
      success: true,
      message: result.message || "Booking status updated successfully",
      data: result.data,
    };
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