// src/actions/review.actions.ts

"use server";

import {
  IReview,
  IReviewFilterOptions,
  IPaginationOptions,
} from "@/types";

const API_URL =
  process.env.BACKEND_API_URL as string;

export interface ActionResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Fetch all reviews with optional filtering and pagination
 * Endpoint: GET /api/review
 */
export async function getAllReviews(
  options: IReviewFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IReview[]>> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `${API_URL}/api/review${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
      },
      next: {
        revalidate: 60,
        tags: ["reviews"],
      },
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch reviews");
    }

    return {
      success: true,
      message: result.message || "Reviews fetched successfully",
      data: result.data || [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching reviews.";
    console.error("getAllReviews error:", message);
    return { success: false, error: message, data: [] };
  }
}

/**
 * Fetch all reviews for a specific technician
 * Endpoint: GET /api/review/technician/:technicianId
 */
export async function getTechnicianReviews(
  technicianId: string
): Promise<ActionResponse<IReview[]>> {
  try {
    const res = await fetch(`${API_URL}/api/review/technician/${technicianId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
      },
      next: {
        revalidate: 60,
        tags: [`technician-reviews-${technicianId}`, "reviews"],
      },
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        result.message || "Failed to fetch technician reviews"
      );
    }

    return {
      success: true,
      message: result.message || "Technician reviews fetched successfully",
      data: result.data || [],
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error fetching technician reviews.";
    console.error("getTechnicianReviews error:", message);
    return { success: false, error: message, data: [] };
  }
}

/**
 * Fetch a review associated with a specific booking ID
 * Endpoint: GET /api/review/booking/:bookingId
 */
export async function getReviewByBookingId(
  bookingId: string,
  token?: string
): Promise<ActionResponse<IReview | null>> {
  try {
    const res = await fetch(`${API_URL}/api/review/booking/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: {
        revalidate: 30,
        tags: [`booking-review-${bookingId}`],
      },
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        result.message || "Failed to fetch review for this booking"
      );
    }

    return {
      success: true,
      message: result.message || "Booking review fetched successfully",
      data: result.data || null,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error fetching booking review.";
    console.error("getReviewByBookingId error:", message);
    return { success: false, error: message, data: null };
  }
}