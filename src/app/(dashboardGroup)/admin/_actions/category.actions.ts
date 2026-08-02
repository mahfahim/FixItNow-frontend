// src/app/(dashboardGroup)/admin/_actions/category.actions.ts
'use server';

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
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




export async function createCategory(payload: ICreateCategoryPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/categories`, {
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




export async function updateCategory(
  id: string,
  payload: IUpdateCategoryPayload
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("categories", "max");
      revalidateTag(`category-${id}`, "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in updateCategory:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update category",
    };
  }
}




export async function deleteCategory(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("categories", "max");
      revalidateTag(`category-${id}`, "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in deleteCategory:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}