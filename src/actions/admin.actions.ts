// src/actions/admin.actions.ts
'use server';

import { revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from "@/lib/constants";
import type { ActionResponse } from "@/types/api.types";
import type {
  IUserFilterOptions,
  IUpdateUserStatusPayload,
  IPaginationOptions,
  ICreateCategoryPayload,
} from "@/types";

/* ==========================================================================
   USER MANAGEMENT (ADMIN)
   ========================================================================== */

/**
 * Fetch all users with filter and pagination options.
 * Endpoint: GET /api/admin/users
 */
export async function getAllUsers(
  options: IUserFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<unknown>> {
  const queryOptions: Record<string, unknown> = { ...options };
  if (queryOptions.searchTerm) {
    queryOptions.search = queryOptions.searchTerm;
    delete queryOptions.searchTerm;
  }

  const endpoint = `/api/admin/users${buildQueryString(queryOptions)}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
        headers,
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: ["admin-users"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch users",
    }
  );
}

/**
 * Update user status (active/blocked/etc).
 * Endpoint: PATCH /api/admin/users/:id
 */
export async function updateUserStatus(
  id: string,
  payload: IUpdateUserStatusPayload
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/admin/users/${id}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("admin-users", "max");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update user status",
    }
  );
}

/* ==========================================================================
   BOOKING MANAGEMENT (ADMIN)
   ========================================================================== */

/**
 * Fetch all bookings across the platform for admin.
 * Endpoint: GET /api/admin/bookings
 */
export async function getAllBookingsAdmin(
  options: IPaginationOptions = {}
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/admin/bookings${buildQueryString(options)}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
        headers,
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: ["admin-bookings"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch bookings",
    }
  );
}

/* ==========================================================================
   CATEGORY MANAGEMENT (ADMIN)
   ========================================================================== */

/**
 * Fetch all categories for admin overview.
 * Endpoint: GET /api/admin/categories
 */
export async function getAllCategories(
  options: IPaginationOptions = {}
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/admin/categories${buildQueryString(options)}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
        headers,
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: [CACHE_TAGS.CATEGORIES],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch categories",
    }
  );
}

/**
 * Create a new service category from admin panel.
 * Endpoint: POST /api/admin/categories
 */
export async function createCategory(
  payload: ICreateCategoryPayload
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/admin/categories";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag(CACHE_TAGS.CATEGORIES, "max");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to create category",
    }
  );
}