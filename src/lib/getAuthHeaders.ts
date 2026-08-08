// src/lib/getAuthHeaders.ts
'use server';

import { cookies } from "next/headers";
import { COOKIE_NAMES, DEFAULT_HEADERS } from "./constants";

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

  return {
    ...DEFAULT_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
