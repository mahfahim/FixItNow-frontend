// src/lib/auth-cookies.ts

import { cookies } from "next/headers";
import { COOKIE_MAX_AGE_SECONDS, COOKIE_NAMES } from "./constants";

interface TokenPair {
  accessToken?: string;
  refreshToken?: string;
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function setAuthCookies({ accessToken, refreshToken }: TokenPair): Promise<void> {
  const cookieStore = await cookies();

  if (accessToken) {
    cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      ...baseCookieOptions(),
      maxAge: COOKIE_MAX_AGE_SECONDS.ACCESS_TOKEN,
    });
  }

  if (refreshToken) {
    cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      ...baseCookieOptions(),
      maxAge: COOKIE_MAX_AGE_SECONDS.REFRESH_TOKEN,
    });
  }
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
}
