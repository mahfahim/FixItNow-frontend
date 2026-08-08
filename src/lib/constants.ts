// src/lib/constants.ts


export const API_TIMEOUT_MS = 20_000;

export const DEFAULT_HEADERS: Readonly<Record<string, string>> = {
  "Content-Type": "application/json",
};


export const CACHE_REVALIDATE_SECONDS = {
  SHORT: 60,
} as const;



export const COOKIE_NAMES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const COOKIE_MAX_AGE_SECONDS = {
  ACCESS_TOKEN: 7 * 24 * 60 * 60, // 7 days
  REFRESH_TOKEN: 30 * 24 * 60 * 60, // 30 days
} as const;



export function getBackendBaseUrl(): string {
  const url = process.env.BACKEND_API_URL;
  if (!url) {
    throw new Error(
      "Missing required environment variable: BACKEND_API_URL"
    );
  }
  return url;
}
