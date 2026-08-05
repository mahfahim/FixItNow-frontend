// src/lib/constants.ts

/**
 * Centralized constants for the Server Action / API layer.
 * No magic strings or numbers should exist outside this file.
 */

/* ==========================================================================
   NETWORK
   ========================================================================== */

export const API_TIMEOUT_MS = 20_000;

export const DEFAULT_HEADERS: Readonly<Record<string, string>> = {
  "Content-Type": "application/json",
};

/* ==========================================================================
   CACHE DURATIONS (seconds)
   ========================================================================== */

export const CACHE_REVALIDATE_SECONDS = {
  SHORT: 60,
} as const;

/* ==========================================================================
   CACHE TAGS
   ========================================================================== */

export const CACHE_TAGS = {
  CATEGORIES: "categories",
  CATEGORY: (id: string): string => `category-${id}`,

  TECHNICIANS: "technicians",
  TECHNICIAN: (id: string): string => `technician-${id}`,
  TECHNICIAN_AVAILABILITY: "technician-availability",
  TECHNICIAN_BOOKINGS: "technician-bookings",

  USER_PROFILE: "user-profile",
} as const;

/* ==========================================================================
   REVALIDATE PATHS
   ========================================================================== */

export const REVALIDATE_PATHS = {
  TECHNICIAN_BOOKINGS: "/technician/bookings",
  TECHNICIAN_PROFILE: "/technician/profile",
  TECHNICIAN_PROFILE_EDIT: "/technician/profile/edit",
  TECHNICIAN_AVAILABILITY: "/technician/availability",
  TECHNICIAN_AVAILABILITY_EDIT: "/technician/availability/edit",
} as const;

/* ==========================================================================
   API ROUTES
   ========================================================================== */

export const API_ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },
  CATEGORIES: {
    BASE: "/api/categories",
    BY_ID: (id: string): string => `/api/categories/${id}`,
  },
  TECHNICIANS: {
    BASE: "/api/technicians",
    BY_ID: (id: string): string => `/api/technicians/${id}`,
    AVAILABILITY: "/api/technicians/availability",
    BOOKINGS: "/api/technicians/bookings",
    BOOKING_BY_ID: (id: string): string => `/api/technicians/bookings/${id}`,
    PROFILE: "/api/technicians/profile",
  },
} as const;

/* ==========================================================================
   AUTH COOKIES
   ========================================================================== */

export const COOKIE_NAMES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const COOKIE_MAX_AGE_SECONDS = {
  ACCESS_TOKEN: 7 * 24 * 60 * 60, // 7 days
  REFRESH_TOKEN: 30 * 24 * 60 * 60, // 30 days
} as const;

/* ==========================================================================
   ENV
   ========================================================================== */

export function getBackendBaseUrl(): string {
  const url = process.env.BACKEND_API_URL;
  if (!url) {
    throw new Error(
      "Missing required environment variable: BACKEND_API_URL"
    );
  }
  return url;
}
