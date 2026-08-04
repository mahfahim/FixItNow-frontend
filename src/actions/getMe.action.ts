// src/actions/getMe.action.ts
'use server';

import { revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { CACHE_TAGS } from "@/lib/constants";
import type { ActionResponse } from "@/types/api.types";
import type { IUpdateUserProfile } from "@/types";

/* ==========================================================================
   USER PROFILE ACTIONS
   ========================================================================== */

/**
 * Fetch current authenticated user's profile.
 * Endpoint: GET /api/auth/me
 */
export async function getMyProfile(): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/auth/me";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
        headers,
        cache: "no-store",
        next: {
          tags: [CACHE_TAGS.USER_PROFILE],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch user profile",
    }
  );
}

/**
 * Update current authenticated user's profile.
 * Endpoint: PATCH /api/auth/me
 */
export async function updateMyProfile(
  payload: IUpdateUserProfile
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/auth/me";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag(CACHE_TAGS.USER_PROFILE, "max");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update user profile",
    }
  );
}