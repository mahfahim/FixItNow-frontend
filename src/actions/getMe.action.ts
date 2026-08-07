// src/actions/getMe.action.ts

'use server';

import { revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import type { ActionResponse } from "@/types";
import type { IUser, IUpdateUserProfile } from "@/types";

const getMyProfile = async (): Promise<ActionResponse<IUser>> => {
  const endpoint = "/api/auth/me";

  return executeAction<IUser>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IUser>(endpoint, {
        headers,
        cache: "no-store",
        next: {
          tags: ["user-profile", "max"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch user profile",
    }
  );
};



const updateMyProfile = async (
  payload: IUpdateUserProfile
): Promise<ActionResponse<IUser>> => {
  const endpoint = "/api/auth/me";

  return executeAction<IUser>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch<IUser>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("user-profile", "max");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update user profile",
    }
  );
};



export {
  getMyProfile,
  updateMyProfile 
};