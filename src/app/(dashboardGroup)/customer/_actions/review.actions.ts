// src/app/(dashboardGroup)/customer/_actions/review.actioins.ts
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { IReview, ICreateReviewPayload } from "@/types";

const API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://fixitnow-backend-tau.vercel.app";

export interface ActionResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * কুকি অথবা প্যারামিটার থেকে Authorization Header তৈরি করার হেল্পার ফাংশন
 */
async function getAuthHeader(token?: string): Promise<Record<string, string>> {
  let authToken = token;

  // প্যারামিটারে টোকেন না থাকলে কুকি থেকে নিবে
  if (!authToken) {
    const cookieStore = await cookies();
    authToken =
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("token")?.value;
  }

  if (!authToken) return {};

  const formattedToken = authToken.startsWith("Bearer ")
    ? authToken
    : `Bearer ${authToken}`;

  return { Authorization: formattedToken };
}

/**
 * Submit a new review for a completed booking
 * Endpoint: POST /api/review
 */
export async function createReview(
  reviewData: ICreateReviewPayload,
  token?: string
): Promise<ActionResponse<IReview>> {
  try {
    const authHeader = await getAuthHeader(token);

    if (!authHeader.Authorization) {
      return {
        success: false,
        error: "You are not logged in. Please log in to access this resource.",
      };
    }

    const res = await fetch(`${API_URL}/api/review/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
        ...authHeader,
      },
      body: JSON.stringify(reviewData),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result.message || "Failed to submit review");
    }

    // Revalidate relevant cached items across pages
    revalidateTag("customer-reviews","max");
    revalidateTag("customer-bookings","max");
    revalidateTag("technicians","max");
    revalidateTag("reviews","max");

    return {
      success: true,
      message: result.message || "Review created successfully",
      data: result.data,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error submitting review.";
    console.error("createReview error:", message);
    return { success: false, error: message };
  }
}

/**
 * Get all reviews submitted by the authenticated logged-in customer
 * Endpoint: GET /api/review/my-reviews
 */
export async function getCustomerReviews(
  token?: string
): Promise<ActionResponse<IReview[]>> {
  try {
    const authHeader = await getAuthHeader(token);

    const res = await fetch(`${API_URL}/api/review/my-reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FixItNow-Frontend/1.0",
        ...authHeader,
      },
      next: {
        revalidate: 60,
        tags: ["customer-reviews"],
      },
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch customer reviews");
    }

    return {
      success: true,
      message: result.message || "Customer reviews fetched successfully",
      data: result.data || [],
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error fetching customer reviews.";
    console.error("getCustomerReviews error:", message);
    return { success: false, error: message, data: [] };
  }
}