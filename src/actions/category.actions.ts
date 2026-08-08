// src/actions/category.actions.ts

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import { getCacheConfig, BaseCacheOptions } from "@/lib/cache-utils";
import type { ActionResponse } from "@/types";
import type {
  ICategory,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
  GetCategoriesOptions,
} from "@/types";




const getAllCategories = async (
  options: GetCategoriesOptions = {}
): Promise<ActionResponse<ICategory[]>> => {
  const { useCache = true, cache, revalidateSeconds, tags, searchTerm, ...filterOptions } = options;

  const apiFilters = {
      ...filterOptions,
      search: searchTerm,
  };

  const endpoint = `/api/categories${buildQueryString(apiFilters)}`;

  const shouldCache = searchTerm ? false : useCache;

  const fetchConfig = getCacheConfig({
      useCache: shouldCache,
      cache: shouldCache ? cache : "no-store",
      revalidateSeconds,
      tags: ["categories", ...(tags || [])],
  });

  return executeAction<ICategory[]>(
    () => apiClient.get<ICategory[]>(endpoint, fetchConfig),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch categories",
    }
  );
};




const getCategoryById = async (
  id: string,
  options: BaseCacheOptions = {}
): Promise<ActionResponse<ICategory>> => {
  const { useCache = true, cache, revalidateSeconds, tags } = options;
  const endpoint = `/api/categories/${id}`;

  const fetchConfig = getCacheConfig({
    useCache,
    cache,
    revalidateSeconds,
    tags: [`category-${id}`, ...(tags || [])],
  });

  return executeAction<ICategory>(
    () => apiClient.get<ICategory>(endpoint, fetchConfig),
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch category details",
    }
  );
};





const createCategory = async (
  payload: ICreateCategoryPayload
): Promise<ActionResponse<ICategory>> => {
  const endpoint = "/api/categories";

  return executeAction<ICategory>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post<ICategory>(endpoint, payload, {
        headers,
      });

      if (response.success) {
        revalidateTag("categories","max");
        revalidatePath("/admin/categories");
        revalidatePath("/services");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to create category",
    }
  );
};





const updateCategory = async (
  id: string,
  payload: IUpdateCategoryPayload
): Promise<ActionResponse<ICategory>> => {
  const endpoint = `/api/categories/${id}`;

  return executeAction<ICategory>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch<ICategory>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("categories","max");
        revalidateTag(`category-${id}`,"max");
        revalidatePath("/admin/categories");
        revalidatePath("/services");
      }

      return response;
    },
    {
      method: "PATCH",
      endpoint,
      fallbackMessage: "Failed to update category",
    }
  );
};




const deleteCategory = async (id: string): Promise<ActionResponse<ICategory>> => {
  const endpoint = `/api/categories/${id}`;

  return executeAction<ICategory>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.delete<ICategory>(endpoint, { headers });

      if (response.success) {
        revalidateTag("categories","max");
        revalidateTag(`category-${id}`,"max");
        revalidatePath("/admin/categories");
        revalidatePath("/services");
      }

      return response;
    },
    {
      method: "DELETE",
      endpoint,
      fallbackMessage: "Failed to delete category",
    }
  );
};



export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};