// src/actions/review.actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/constants";
import type { ActionResponse } from "@/types/api.types";
import type {
  IReview,
  IReviewFilterOptions,
  IPaginationOptions,
  ICreateReviewPayload,
} from "@/types";

/* ==========================================================================
   HELPERS
   ========================================================================== */

/**
 * Retrieves authorization headers, accepting an optional override token.
 */
async function getAuthHeader(explicitToken?: string): Promise<Record<string, string>> {
  if (explicitToken) {
    const formattedToken = explicitToken.startsWith("Bearer ")
      ? explicitToken
      : `Bearer ${explicitToken}`;
    return { Authorization: formattedToken };
  }
  return await getAuthHeaders();
}

/* ==========================================================================
   READ OPERATIONS (PUBLIC & COMMON)
   ========================================================================== */

/**
 * Fetch all reviews with optional filtering and pagination.
 * Endpoint: GET /api/review
 */
export async function getAllReviews(
  options: IReviewFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IReview[]>> {
  const endpoint = `/api/review${buildQueryString(options)}`;

  return executeAction(
    () =>
      apiClient.get<IReview[]>(endpoint, {
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: ["reviews"],
        },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch reviews",
    }
  );
}

/**
 * Fetch all reviews for a specific technician.
 * Endpoint: GET /api/review/technician/:technicianId
 */
export async function getTechnicianReviews(
  technicianId: string
): Promise<ActionResponse<IReview[]>> {
  const endpoint = `/api/review/technician/${technicianId}`;

  return executeAction(
    () =>
      apiClient.get<IReview[]>(endpoint, {
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: [`technician-reviews-${technicianId}`, "reviews"],
        },
      }),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch technician reviews",
    }
  );
}

/**
 * Fetch a review associated with a specific booking ID.
 * Endpoint: GET /api/review/booking/:bookingId
 */
export async function getReviewByBookingId(
  bookingId: string,
  token?: string
): Promise<ActionResponse<IReview | null>> {
  const endpoint = `/api/review/booking/${bookingId}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeader(token);
      return apiClient.get<IReview | null>(endpoint, {
        headers,
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: [`booking-review-${bookingId}`],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch review for this booking",
    }
  );
}

/**
 * Get all reviews submitted by the authenticated logged-in customer.
 * Endpoint: GET /api/review/my-reviews
 */
export async function getCustomerReviews(
  token?: string
): Promise<ActionResponse<IReview[]>> {
  const endpoint = "/api/review/my-reviews";

  return executeAction(
    async () => {
      const headers = await getAuthHeader(token);
      return apiClient.get<IReview[]>(endpoint, {
        headers,
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: ["customer-reviews"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch customer reviews",
    }
  );
}

/* ==========================================================================
   MUTATION OPERATIONS (AUTHENTICATED)
   ========================================================================== */

/**
 * Submit a new review for a completed booking.
 * Endpoint: POST /api/review
 */
export async function createReview(
  reviewData: ICreateReviewPayload,
  token?: string
): Promise<ActionResponse<IReview>> {
  const endpoint = "/api/review";

  return executeAction(
    async () => {
      const headers = await getAuthHeader(token);
      const response = await apiClient.post<IReview>(endpoint, reviewData, { headers });

      if (response.success) {
        revalidateTag("customer-reviews", "max");
        revalidateTag("customer-bookings", "max");
        revalidateTag("technicians", "max");
        revalidateTag("reviews", "max");
        revalidatePath("/customer/reviews", "page");
        revalidatePath("/customer/dashboard", "page");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to submit review",
    }
  );
}