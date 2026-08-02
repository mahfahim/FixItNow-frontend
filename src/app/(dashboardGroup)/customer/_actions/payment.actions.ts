// src/app/(dashboardGroup)/customer/_actions/payment.actions.ts
'use server';

import { cookies } from "next/headers";
import { IPaymentFilterOptions } from "@/types";

// Pagination interface helper in case it isn't globally exported
export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const BASE_URL = process.env.BACKEND_API_URL as string;

/**
 * Helper function to retrieve authorization headers using cookies
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
 * Fetch customer payment history with filtering and pagination
 * Endpoint: GET /api/payment/history
 */
export async function getPaymentHistory(
  options: IPaymentFilterOptions & IPaginationOptions = {}
) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/payment/history${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: 60,
        tags: ["payments", "payment-history"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getPaymentHistory:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch payment history",
    };
  }
}

/**
 * Fetch specific payment details by Payment ID
 * Endpoint: GET /api/payment/:id
 */
export async function getPaymentById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/payment/${id}`, {
      method: "GET",
      headers,
      next: {
        revalidate: 60,
        tags: ["payments", `payment-${id}`],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getPaymentById:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch payment details",
    };
  }
}