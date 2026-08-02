// src/app/(dashboardGroup)/admin/_actions/admin.actions.ts
'use server';

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  IUserFilterOptions,
  IUpdateUserStatusPayload,
  IPaginationOptions,
} from "@/types";

export interface ICreateCategoryPayload {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}

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


export async function getAllUsers(
  options: IUserFilterOptions & IPaginationOptions = {}
) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
      
        const paramKey = key === "searchTerm" ? "search" : key;
        queryParams.append(paramKey, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/admin/users${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: 60,
        tags: ["admin-users"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getAllUsers:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}


export async function updateUserStatus(
  id: string,
  payload: IUpdateUserStatusPayload
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("admin-users", "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in updateUserStatus:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user status",
    };
  }
}


export async function getAllBookingsAdmin(options: IPaginationOptions = {}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/admin/bookings${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: 60,
        tags: ["admin-bookings"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getAllBookingsAdmin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch bookings",
    };
  }
}


export async function getAllCategories(options: IPaginationOptions = {}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/admin/categories${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: 60,
        tags: ["categories"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getAllCategories:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}


export async function createCategory(payload: ICreateCategoryPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("categories", "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in createCategory:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create category",
    };
  }
}