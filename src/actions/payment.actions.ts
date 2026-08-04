// src/actions/payment.actions.ts
'use server';

import { revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/constants";
import type { ActionResponse } from "@/types/api.types";
import type {
  IPaymentFilterOptions,
  IPaginationOptions,
  ICreatePaymentPayload,
  IConfirmPaymentPayload,
} from "@/types";

/* ==========================================================================
   READ OPERATIONS
   ========================================================================== */

/**
 * Fetch customer payment history with filtering and pagination.
 * Endpoint: GET /api/payment/history
 */
export async function getPaymentHistory(
  options: IPaymentFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/payment/history${buildQueryString(options)}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
        headers,
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: ["payments", "payment-history"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch payment history",
    }
  );
}

/**
 * Fetch specific payment details by Payment ID.
 * Endpoint: GET /api/payment/:id
 */
export async function getPaymentById(id: string): Promise<ActionResponse<unknown>> {
  const endpoint = `/api/payment/${id}`;

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get(endpoint, {
        headers,
        next: {
          revalidate: CACHE_REVALIDATE_SECONDS.SHORT,
          tags: ["payments", `payment-${id}`],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch payment details",
    }
  );
}

/* ==========================================================================
   MUTATION OPERATIONS
   ========================================================================== */

/**
 * Create a new payment intent.
 * Endpoint: POST /api/payment/create
 */
export async function createPaymentIntent(
  payload: ICreatePaymentPayload
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/payment/create";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.post(endpoint, payload, { headers });
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to initialize payment",
    }
  );
}

/**
 * Confirm payment transaction.
 * Endpoint: POST /api/payment/confirm
 */
export async function confirmPayment(
  payload: IConfirmPaymentPayload
): Promise<ActionResponse<unknown>> {
  const endpoint = "/api/payment/confirm";

  return executeAction(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("payments", "max");
        revalidateTag("customer-bookings", "max");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to confirm payment",
    }
  );
}