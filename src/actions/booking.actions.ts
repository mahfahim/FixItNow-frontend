// src/actions/booking.actions.ts

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import { BookingStatus } from "@/types";
import type {
  ActionResponse,
  IBooking,
  ICreateBookingPayload,
  IUpdateBookingStatusPayload,
  GetBookingsOptions,
} from "@/types";


const createBooking = async (
  payload: ICreateBookingPayload
): Promise<ActionResponse<IBooking>> => {
  const endpoint = "/api/bookings";

  return executeAction<IBooking>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post<IBooking>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("customer-bookings","max");
        revalidateTag("technician-bookings","max");
        revalidatePath("/customer/bookings");
        revalidatePath("/customer/dashboard");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to create booking",
    }
  );
};


const getUserBookings = async (
  options: GetBookingsOptions = {}
): Promise<ActionResponse<IBooking[]>> => {
  const endpoint = `/api/bookings${buildQueryString(options)}`;

  return executeAction<IBooking[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IBooking[]>(endpoint, {
        headers,
        next: {
          revalidate: 15,
          tags: ["customer-bookings", "technician-bookings"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch bookings",
    }
  );
};





const getBookingById = async (
  bookingId: string
): Promise<ActionResponse<IBooking>> => {
  const endpoint = `/api/bookings/${bookingId}`;

  return executeAction<IBooking>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IBooking>(endpoint, {
        headers,
        next: {
          revalidate: 15,
          tags: [`booking-${bookingId}`],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch booking details",
    }
  );
};




const updateBookingStatus = async (
  bookingId: string,
  payload: IUpdateBookingStatusPayload
): Promise<ActionResponse<IBooking>> => {
  const endpoint = `/api/bookings/${bookingId}/status`;

  return executeAction<IBooking>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch<IBooking>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("customer-bookings","max");
        revalidateTag("technician-bookings","max");
        revalidateTag(`booking-${bookingId}`,"max");
        revalidatePath("/customer/bookings");
        revalidatePath(`/customer/bookings/${bookingId}`);
        revalidatePath("/technician/bookings");
        revalidatePath(`/technician/bookings/${bookingId}`);
        revalidatePath("/admin/bookings");
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


const getCustomerBookings = async (
  options: GetBookingsOptions = {}
): Promise<ActionResponse<IBooking[]>> => getUserBookings(options);

const getTechnicianBookings = async (
  options: GetBookingsOptions = {}
): Promise<ActionResponse<IBooking[]>> => getUserBookings(options);

const getTechnicianBookingById = async (
  bookingId: string
): Promise<ActionResponse<IBooking>> => getBookingById(bookingId);

const updateTechnicianBookingStatus = async (
  bookingId: string,
  payload: IUpdateBookingStatusPayload
): Promise<ActionResponse<IBooking>> => updateBookingStatus(bookingId, payload);

const cancelCustomerBooking = async (
  bookingId: string,
  reason?: string
): Promise<ActionResponse<IBooking>> => {
  return updateBookingStatus(bookingId, {
    status: BookingStatus.CANCELLED,
    cancellationReason: reason || "Cancelled by customer via app",
    note: "Cancelled by customer via app",
  });
};

const acceptBookingRequest = async (
  bookingId: string
): Promise<ActionResponse<IBooking>> => {
  return updateBookingStatus(bookingId, {
    status: BookingStatus.ACCEPTED,
    note: "Booking request accepted by technician",
  });
};

const declineBookingRequest = async (
  bookingId: string,
  reason?: string
): Promise<ActionResponse<IBooking>> => {
  return updateBookingStatus(bookingId, {
    status: BookingStatus.DECLINED,
    cancellationReason: reason || "Not available at this time",
    note: "Booking request declined by technician",
  });
};

const startBookingJob = async (
  bookingId: string
): Promise<ActionResponse<IBooking>> => {
  return updateBookingStatus(bookingId, {
    status: BookingStatus.IN_PROGRESS,
    note: "Technician has started the service job",
  });
};

const completeBookingJob = async (
  bookingId: string,
  note?: string
): Promise<ActionResponse<IBooking>> => {
  return updateBookingStatus(bookingId, {
    status: BookingStatus.COMPLETED,
    note: note || "Job successfully completed",
  });
};

const getMyBookings = getCustomerBookings;

export {
  createBooking,
  getUserBookings,
  getCustomerBookings,
  getMyBookings,
  getTechnicianBookings,
  getBookingById,
  getTechnicianBookingById,
  updateBookingStatus,
  updateTechnicianBookingStatus,
  cancelCustomerBooking,
  acceptBookingRequest,
  declineBookingRequest,
  startBookingJob,
  completeBookingJob,
};