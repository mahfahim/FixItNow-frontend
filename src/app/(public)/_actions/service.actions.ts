"use server";

import { IService, IServiceFilterOptions } from "@/types";

const API_URL = process.env.BACKEND_API_URL as string;

export interface IServiceMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IServiceFetchResponse {
  data: IService[];
  meta?: IServiceMeta;
}

export async function getAllServices(
  options?: IServiceFilterOptions
): Promise<IServiceFetchResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (options?.search) queryParams.append("search", options.search);
    if (options?.categoryId) queryParams.append("categoryId", options.categoryId);
    if (options?.technicianId) queryParams.append("technicianId", options.technicianId);
    if (options?.minPrice !== undefined) queryParams.append("minPrice", String(options.minPrice));
    if (options?.maxPrice !== undefined) queryParams.append("maxPrice", String(options.maxPrice));
    if (options?.page) queryParams.append("page", String(options.page));
    if (options?.limit) queryParams.append("limit", String(options.limit));
    if (options?.sortBy) queryParams.append("sortBy", options.sortBy);
    if (options?.sortOrder) queryParams.append("sortOrder", options.sortOrder);

    const queryString = queryParams.toString();
    const url = `${API_URL}/api/services${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      next: { 
        revalidate: 60, 
        tags: ["services"] 
      }, 
    });

    if (!res.ok) {
      console.error(`getAllServices failed with status: ${res.status}`);
      return { data: [] };
    }

    const result = await res.json();

    return {
      data: Array.isArray(result?.data) ? result.data : [],
      meta: result?.meta,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error loading services.";
    console.error("getAllServices error:", errorMessage);
    return { data: [] };
  }
}

export async function getServiceById(id: string): Promise<IService | null> {
  try {
    if (!id) return null;

    const res = await fetch(`${API_URL}/api/services/${id}`, {
      next: { 
        revalidate: 300,
        tags: ["services", `service-${id}`] 
      }, 
    });

    if (!res.ok) {
      return null;
    }

    const result = await res.json();

    return result?.data || null;
  } catch (error) {
    console.error("getServiceById error:", error);
    return null;
  }
}

export async function getFeaturedServices(limit: number = 6): Promise<IService[]> {
  const response = await getAllServices({ limit, page: 1 });
  return response.data;
}