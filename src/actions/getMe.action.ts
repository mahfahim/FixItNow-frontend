// src/actions/getMe.action.ts

'use server';

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { IUpdateUserProfile } from "@/types";

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
 * Fetch current authenticated user's profile (Customer, Technician, or Admin)
 * Endpoint: GET /api/auth/me
 */
export async function getMyProfile() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers,
      next: {
        revalidate: 60,
        tags: ["user-profile"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getMyProfile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch user profile",
    };
  }
}

/**
 * Update current authenticated user's profile (Customer, Technician, or Admin)
 * Endpoint: PATCH /api/auth/me
 */
export async function updateMyProfile(payload: IUpdateUserProfile) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("user-profile", "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in updateMyProfile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update user profile",
    };
  }
}