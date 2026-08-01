// src/app/(dashboardGroup)/technician/_actions/address.actions.ts
'use server';

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { ICreateAddress } from "@/types";

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
 * Add a new address for the authenticated user/technician
 * Endpoint: POST /api/auth/address
 */
export async function addAddress(payload: ICreateAddress) {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/api/auth/address`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("addresses", "max");
      revalidateTag("user-profile", "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in addAddress:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add address",
    };
  }
}