// src/app/(dashboardGroup)/technician/_actions/services.actions.ts

'use server';

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  ICreateServicePayload,
  IUpdateServicePayload,
} from "@/types";

const BASE_URL = process.env.BACKEND_API_URL as string;

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

export async function createService(payload: ICreateServicePayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/services`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || `Server responded with status: ${res.status}`,
      };
    }

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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || `Server responded with status: ${res.status}`,
      };
    }

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

export async function deleteService(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/services/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || `Server responded with status: ${res.status}`,
      };
    }

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