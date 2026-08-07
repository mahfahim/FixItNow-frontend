// src/actions/auth.actions.ts

"use server";

import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";
import type { ActionResponse } from "@/types";
import type { IRegisterUser, ILoginUser, IUser } from "@/types";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const register = async (
  payload: IRegisterUser
): Promise<ActionResponse<IUser>> => {
  const endpoint = "/api/auth/register";

  return executeAction<IUser>(
    () => apiClient.post<IUser>(endpoint, payload, { cache: "no-store" }),
    {
      method: "POST",
      endpoint,
      fallbackMessage: "User registration failed",
    }
  );
};

const login = async (
  payload: ILoginUser
): Promise<ActionResponse<AuthTokens>> => {
  const endpoint = "/api/auth/login";

  return executeAction<AuthTokens>(
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
};

const logout = async (): Promise<ActionResponse<undefined>> => {
  return executeAction<undefined>(
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
};

export {
   register, 
   login,
   logout 
};