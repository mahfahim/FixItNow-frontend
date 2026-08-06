// src/actions/auth.actions.ts
"use server";

import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";
import type { ActionResponse } from "@/types/api.types";
import type { IRegisterUser, ILoginUser } from "@/types";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Registers a new user.
 * Endpoint: POST /api/auth/register
 */
export async function register(
  payload: IRegisterUser
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/auth/register";

  return executeAction(
    () => apiClient.post(endpoint, payload, { cache: "no-store" }),
    {
      method: "POST",
      endpoint,
      fallbackMessage: "User registration failed",
    }
  );
}

/**
 * Logs a user in and, on success, persists the returned access/refresh
 * tokens into HttpOnly cookies.
 * Endpoint: POST /api/auth/login
 */
export async function login(
  payload: ILoginUser
): Promise<ActionResponse<AuthTokens>> {
  const endpoint = "/api/auth/login";

  return executeAction(
    async () => {
      const response = await apiClient.post<AuthTokens>(
        endpoint,
        payload,
        { cache: "no-store" }
      );

      if (response.success && response.data) {
        await setAuthCookies(response.data);
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "User login failed",
    }
  );
}

/**
 * Logs the current user out by clearing auth cookies. No backend call is
 * made, matching the original behavior.
 */
export async function logout(): Promise<ActionResponse<undefined>> {
  return executeAction(
    async () => {
      await clearAuthCookies();
      return { success: true, message: "Logged out successfully" };
    },
    {
      method: "POST",
      endpoint: "logout (client-side cookie clear)",
      fallbackMessage: "Logout failed",
    }
  );
}