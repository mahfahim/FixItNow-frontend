// src/actions/category.actions.ts
'use server';

import {
  ICategoryFilterOptions,
  IPaginationOptions,
} from "@/types";

const BASE_URL = process.env.BACKEND_API_URL as string;

/**
 * Fetch all categories with optional search, filter, and pagination options
 * Endpoint: GET /api/categories
 */
export async function getAllCategories(
  options: ICategoryFilterOptions & IPaginationOptions = {}
) {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/categories${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

/**
 * Fetch a single category by its ID
 * Endpoint: GET /api/categories/:id
 */
export async function getCategoryById(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
        tags: [`category-${id}`],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getCategoryById:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch category",
    };
  }
}