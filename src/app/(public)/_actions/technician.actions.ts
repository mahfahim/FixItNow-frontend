"use server";

import { ITechnician, ITechnicianFilterOptions } from "@/types";

const API_URL = process.env.BACKEND_API_URL as string;


const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop";


interface RawTechnicianInput extends Partial<ITechnician> {
  avatar?: string;
  image?: string;
}


function sanitizeTechnicianImage(technician: RawTechnicianInput): ITechnician {
  const rawImage = technician.profileImage || technician.avatar || technician.image;
  let safeImage = DEFAULT_AVATAR;

  if (
    typeof rawImage === "string" &&
    rawImage.trim() !== "" &&
    !rawImage.includes("example.com") &&
    (rawImage.startsWith("http://") || rawImage.startsWith("https://") || rawImage.startsWith("/"))
  ) {
    safeImage = rawImage;
  }

  return {
    ...technician,
    profileImage: safeImage,
  } as ITechnician;
}

export interface ITechnicianMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ITechnicianFetchResponse {
  data: ITechnician[];
  meta?: ITechnicianMeta;
}

export async function getAllTechnicians(
  options?: ITechnicianFilterOptions
): Promise<ITechnicianFetchResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (options?.search) queryParams.append("search", options.search);
    if (options?.city) queryParams.append("city", options.city);
    if (options?.district) queryParams.append("district", options.district);
    if (options?.minRating !== undefined) {
      queryParams.append("minRating", String(options.minRating));
    }

    const queryString = queryParams.toString();
    const url = `${API_URL}/api/technicians${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      next: { 
        revalidate: 60, 
        tags: ["technicians"] 
      },
    });

    if (!res.ok) {
      console.error(`getAllTechnicians failed with status: ${res.status}`);
      return { data: [] };
    }

    const result = await res.json();
    const rawData: RawTechnicianInput[] = Array.isArray(result?.data) ? result.data : [];

    return {
      data: rawData.map(sanitizeTechnicianImage),
      meta: result?.meta,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error loading technicians.";
    console.error("getAllTechnicians error:", errorMessage);
    return { data: [] };
  }
}

export async function getTechnicianById(
  id: string
): Promise<ITechnician | null> {
  try {
    if (!id) return null;

    const res = await fetch(`${API_URL}/api/technicians/${id}`, {
      next: { 
        revalidate: 300, 
        tags: ["technicians", `technician-${id}`] 
      },
    });

    if (!res.ok) {
      return null;
    }

    const result = await res.json();

    return result?.data ? sanitizeTechnicianImage(result.data as RawTechnicianInput) : null;
  } catch (error) {
    console.error("getTechnicianById error:", error);
    return null;
  }
}

export async function getTopRatedTechnicians(
  limit: number = 6
): Promise<ITechnician[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/technicians?limit=${limit}&sortBy=averageRating&sortOrder=desc`,
      {
        next: { 
          revalidate: 3600, 
          tags: ["technicians", "top-rated-technicians"] 
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const result = await res.json();
    const rawData: RawTechnicianInput[] = Array.isArray(result?.data) ? result.data : [];

    return rawData.map(sanitizeTechnicianImage);
  } catch (error) {
    console.error("getTopRatedTechnicians error:", error);
    return [];
  }
}