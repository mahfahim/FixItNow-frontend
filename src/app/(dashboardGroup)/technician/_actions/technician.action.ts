'use server';

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  BookingStatus,
  IUpdateTechnicianProfilePayload,
  IAvailabilitySlotPayload,
} from "@/types";

const BASE_URL = process.env.BACKEND_API_URL as string;

/**
 * Helper function to retrieve authorization headers using Next.js cookies
 */
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Fetch availability slots for the logged-in technician
 * Endpoint: GET /api/technicians/availability
 */
export async function getAvailability() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/technicians/availability`, {
      method: "GET",
      headers,
      next: {
        tags: ["technician-availability"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getAvailability:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch availability slots",
    };
  }
}

/**
 * Get all bookings assigned to the logged-in technician
 * Endpoint: GET /api/technicians/bookings
 */
export async function getTechnicianBookings() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/technicians/bookings`, {
      method: "GET",
      headers,
      next: {
        tags: ["technician-bookings"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getTechnicianBookings:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch technician bookings",
    };
  }
}

/**
 * Update the status of a specific booking (e.g., ACCEPTED, COMPLETED, CANCELLED)
 * Endpoint: PATCH /api/technicians/bookings/:id
 */
export async function updateBookingStatus(
  bookingId: string,
  payload: {
    status: BookingStatus;
    note?: string;
    cancellationReason?: string;
  }
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/technicians/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidatePath("/technician/bookings", "page");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in updateBookingStatus:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update booking status",
    };
  }
}

/**
 * Update the logged-in technician's profile info
 * Endpoint: PATCH /api/technicians/profile
 */
export async function updateProfile(payload: IUpdateTechnicianProfilePayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/technicians/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("user-profile","max");
      revalidatePath("/technician/profile", "page");
      revalidatePath("/technician/profile/edit", "page");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in updateProfile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update technician profile",
    };
  }
}

/**
 * Set or update availability slots for the logged-in technician
 * Endpoint: PATCH /api/technicians/availability
 */
export async function setAvailability(payload: IAvailabilitySlotPayload[]) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/technicians/availability`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidatePath("/technician/availability", "page");
      revalidatePath("/technician/availability/edit", "page");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in setAvailability:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to set availability slots",
    };
  }
}