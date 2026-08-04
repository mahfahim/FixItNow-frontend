// src/lib/getAuthHeaders.ts
'use server';

import { cookies } from "next/headers";

/**
 * Global helper function to retrieve authorization headers with Bearer token
 */
export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}