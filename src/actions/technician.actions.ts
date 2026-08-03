// src/actions/technician.actions.ts

'use server';

import {
  ITechnicianFilterOptions,
  IPaginationOptions,
} from "@/types";

const BASE_URL = process.env.BACKEND_API_URL as string;



export async function getAllTechnicians(
    options: ITechnicianFilterOptions & IPaginationOptions = {}
) {
    try {
        const queryParams = new URLSearchParams();

        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, String(value));
            }
        });

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/technicians${queryString ? `?${queryString}` : ""}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
            next: {
                tags: ["technicians"],
            },
        });

        const data = await res.json();
        return data;
    } catch (error: unknown) {
        console.error("Error in getAllTechnicians:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch technicians",
        };
    }
}



export async function getTechnicianById(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/technicians/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
        tags: [`technician-${id}`],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getTechnicianById:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch technician details",
    };
  }
}