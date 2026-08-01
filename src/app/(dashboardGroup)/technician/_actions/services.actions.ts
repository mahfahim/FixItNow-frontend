// src/app/(dashboardGroup)/technician/_actions/services.actions.ts
'use server';

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  ICreateServicePayload,
  IUpdateServicePayload,
} from "@/types";

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
 * Create a new service (Technician & Admin)
 * Endpoint: POST /api/services
 */
export async function createService(payload: ICreateServicePayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/services`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("services", "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in createService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create service",
    };
  }
}

/**
 * Update an existing service by ID (Technician & Admin)
 * Endpoint: PATCH /api/services/:id
 */
export async function updateService(
  id: string,
  payload: IUpdateServicePayload
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/services/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("services", "max");
      revalidateTag(`service-${id}`, "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in updateService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update service",
    };
  }
}

/**
 * Soft delete a service by ID (Technician & Admin)
 * Endpoint: DELETE /api/services/:id
 */
export async function deleteService(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/services/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("services", "max");
      revalidateTag(`service-${id}`, "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in deleteService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete service",
    };
  }
}