// src/actions/admin.actions.ts
'use server';

import { revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import type {
  ActionResponse,
  IUser,
  IBooking,
  ICategory,
  IUserFilterOptions,
  IUpdateUserStatusPayload,
  IPaginationOptions,
  ICreateCategoryPayload,
  GetBookingsOptions,
} from "@/types";


const getAllUsers = async (
  options: IUserFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IUser[]>> => {
  
  const endpoint = `/api/admin/users${buildQueryString(options)}`;

  return executeAction<IUser[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IUser[]>(endpoint, {
        headers,
        next: {
          revalidate: 60,
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
};

const updateUserStatus = async (
  id: string,
  payload: IUpdateUserStatusPayload
): Promise<ActionResponse<IUser>> => {
  const endpoint = `/api/admin/users/${id}`;

  return executeAction<IUser>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.patch<IUser>(endpoint, payload, { headers });

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
};

const getAllBookingsAdmin = async (
  options: GetBookingsOptions = {}
): Promise<ActionResponse<IBooking[]>> => {
  const queryOptions: Record<string, unknown> = { ...options };
  const endpoint = `/api/admin/bookings${buildQueryString(queryOptions)}`;

  return executeAction<IBooking[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IBooking[]>(endpoint, {
        headers,
        next: {
          revalidate: 60,
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
};

const getAllCategories = async (
  options: IUserFilterOptions = {}
): Promise<ActionResponse<ICategory[]>> => {
  const endpoint = `/api/admin/categories${buildQueryString(options)}`;

  return executeAction<ICategory[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<ICategory[]>(endpoint, {
        headers,
        next: {
          revalidate: 60,
          tags: ["categories"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch categories",
    }
  );
};

const createCategory = async (
  payload: ICreateCategoryPayload
): Promise<ActionResponse<ICategory>> => {
  const endpoint = "/api/admin/categories";

  return executeAction<ICategory>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post<ICategory>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("categories", "max");
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

export {
  getAllUsers,
  updateUserStatus,
  getAllBookingsAdmin,
  getAllCategories,
  createCategory,
};