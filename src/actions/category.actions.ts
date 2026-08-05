// src/actions/category.actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import { API_ROUTES, CACHE_TAGS } from "@/lib/constants";
import { getCacheConfig, BaseCacheOptions } from "@/lib/cache-utils";
import type { ActionResponse } from "@/types/api.types";
import type {
  ICategoryFilterOptions,
  IPaginationOptions,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/types";

export interface GetCategoriesOptions
  extends BaseCacheOptions,
    ICategoryFilterOptions,
    IPaginationOptions {}

/* ==========================================================================
   READ OPERATIONS (PUBLIC)
   ========================================================================== */

/**
 * Fetch all categories with optional search, filter, pagination, and cache options.
 * Endpoint: GET /api/categories
 */
export async function getAllCategories(
  options: GetCategoriesOptions = {}
): Promise<ActionResponse<unknown>> {
  const { useCache = true, cache, revalidateSeconds, tags, ...filterOptions } = options;
  const endpoint = `${API_ROUTES.CATEGORIES.BASE}${buildQueryString(filterOptions)}`;

  const fetchConfig = getCacheConfig({
    useCache,
    cache,
    revalidateSeconds,
    tags: [CACHE_TAGS.CATEGORIES, ...(tags || [])],
  });

  return executeAction(
    () => apiClient.get(endpoint, fetchConfig),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch categories",
    }
  );
}

/**
 * Fetch a single category by its ID with cache configuration options.
 * Endpoint: GET /api/categories/:id
 */
export async function getCategoryById(
  id: string,
  options: BaseCacheOptions = {}
): Promise<ActionResponse<unknown>> {
  const { useCache = true, cache, revalidateSeconds, tags } = options;
  const endpoint = API_ROUTES.CATEGORIES.BY_ID(id);

  const fetchConfig = getCacheConfig({
    useCache,
    cache,
    revalidateSeconds,
    tags: [CACHE_TAGS.CATEGORY(id), ...(tags || [])],
  });

  return executeAction(
    () => apiClient.get(endpoint, fetchConfig),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch category",
    }
  );
}

/* ==========================================================================
   MUTATION OPERATIONS (ADMIN / AUTHENTICATED)
   ========================================================================== */

/**
 * Create a new category.
 * Endpoint: POST /api/categories
 */
export async function createCategory(
  payload: ICreateCategoryPayload
): Promise<ActionResponse<unknown>> {
  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post(API_ROUTES.CATEGORIES.BASE, payload, {
        headers,
      });

      if (response.success) {
        revalidateTag(CACHE_TAGS.CATEGORIES, "max");
      }

      return response;
    },
    {
      method: "POST",
      endpoint: API_ROUTES.CATEGORIES.BASE,
      fallbackMessage: "Failed to create category",
    }
  );
}

/**
 * Update an existing category by ID.
 * Endpoint: PATCH /api/categories/:id
 */
export async function updateCategory(
  id: string,
  payload: IUpdateCategoryPayload
): Promise<ActionResponse<unknown>> {
  const endpoint = API_ROUTES.CATEGORIES.BY_ID(id);

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag(CACHE_TAGS.CATEGORIES, "max");
        revalidateTag(CACHE_TAGS.CATEGORY(id), "max");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update category",
    }
  );
}

/**
 * Delete a category by ID.
 * Endpoint: DELETE /api/categories/:id
 */
export async function deleteCategory(id: string): Promise<ActionResponse<unknown>> {
  const endpoint = API_ROUTES.CATEGORIES.BY_ID(id);

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.delete(endpoint, { headers });

      if (response.success) {
        revalidateTag(CACHE_TAGS.CATEGORIES, "max");
        revalidateTag(CACHE_TAGS.CATEGORY(id), "max");
      }

      return response;
    },
    {
      method: "DELETE",
      endpoint,
      fallbackMessage: "Failed to delete category",
    }
  );
}