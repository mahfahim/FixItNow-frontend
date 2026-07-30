"use server";

import { ICategory, ICategoryFilterOptions } from "@/types";

const API_URL = process.env.BACKEND_API_URL as string;

export async function getCategories(
  options?: ICategoryFilterOptions
): Promise<ICategory[]> {
  try {
    const queryParams = new URLSearchParams();

    if (options?.searchTerm) {
      queryParams.append("searchTerm", options.searchTerm);
    }
    if (options?.isActive !== undefined) {
      queryParams.append("isActive", String(options.isActive));
    }

    const queryString = queryParams.toString();
    const url = `${API_URL}/api/categories${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      next: { 
        revalidate: 3600,
        tags: ["categories"] 
      }, 
    });

    if (!res.ok) {
      console.error(`getCategories failed with status: ${res.status}`);
      return [];
    }

    const result = await res.json();
    
    return Array.isArray(result?.data) ? result.data : [];

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error loading categories.";
    console.error("getCategories error:", errorMessage);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<ICategory | null> {
  try {
    if (!id) return null;

    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      next: { 
        revalidate: 1800, 
        tags: ["categories", `category-${id}`] 
      },
    });

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    
    return result?.data || null;
  } catch (error) {
    console.error("getCategoryById error:", error);
    return null;
  }
}