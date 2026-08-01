// src/actions/services.actions.ts
'use server';

import { IServiceFilterOptions } from "@/types";

const BASE_URL = process.env.BACKEND_API_URL as string;

/**
 * Fetch all services with optional search, filters, and pagination
 * Endpoint: GET /api/services
 */
export async function getAllServices(options: IServiceFilterOptions = {}) {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/services${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
        tags: ["services"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getAllServices:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch services",
    };
  }
}

/**
 * Fetch a single service details by ID
 * Endpoint: GET /api/services/:id
 */
export async function getServiceById(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/services/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
        tags: [`service-${id}`],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getServiceById:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch service",
    };
  }
}