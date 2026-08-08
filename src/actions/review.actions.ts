// src/actions/review.actions.ts

'use server';

import { revalidateTag, revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import type { ActionResponse } from "@/types";
import type {
  IReview,
  IReviewFilterOptions,
  IPaginationOptions,
  ICreateReviewPayload,
} from "@/types";





const getReviews = async (
  options: IReviewFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IReview[]>> => {
  const endpoint = `/api/review${buildQueryString(options)}`;

  return executeAction<IReview[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IReview[]>(endpoint, {
        headers,
        next: {
          revalidate: 60,
          tags: ["reviews"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch reviews",
    }
  );
};





const getMyReviews = async (
  options: IReviewFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IReview[]>> => {
  const endpoint = `/api/review/my-reviews${buildQueryString(options)}`;

  return executeAction<IReview[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IReview[]>(endpoint, {
        headers,
        next: {
          revalidate: 0,
          tags: ["reviews", "my-reviews"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch your reviews",
    }
  );
};





const getTechnicianReviews = async (
  technicianId: string,
  options: IReviewFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IReview[]>> => {
  const endpoint = `/api/review/technician/${technicianId}${buildQueryString(options)}`;

  return executeAction<IReview[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IReview[]>(endpoint, {
        headers,
        next: {
          revalidate: 60,
          tags: ["reviews", `technician-reviews-${technicianId}`],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch technician reviews",
    }
  );
};





const getReviewByBookingId = async (
  bookingId: string
): Promise<ActionResponse<IReview>> => {
  const endpoint = `/api/review/booking/${bookingId}`;

  return executeAction<IReview>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IReview>(endpoint, {
        headers,
        next: {
          revalidate: 60,
          tags: ["reviews", `booking-review-${bookingId}`],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch review for this booking",
    }
  );
};





const createReview = async (
  payload: ICreateReviewPayload
): Promise<ActionResponse<IReview>> => {
  const endpoint = "/api/review";

  return executeAction<IReview>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post<IReview>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("reviews","max");
        revalidateTag("my-reviews","max");
        revalidateTag("customer-bookings","max");

        revalidatePath("/customer/reviews");
        revalidatePath("/customer/bookings");
      } 

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to create review",
    }
  );
};




export {
  createReview,
  getReviews,
  getMyReviews,
  getTechnicianReviews,
  getReviewByBookingId,
};