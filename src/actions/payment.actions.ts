// src/actions/payment.actions.ts

'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { executeAction } from "@/lib/request-wrapper";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { buildQueryString } from "@/lib/query-string";
import type {
  ActionResponse,
  IPayment,
  IPaymentFilterOptions,
  IPaginationOptions,
  ICreatePaymentPayload,
  IConfirmPaymentPayload,
  IRefundPaymentPayload,
  ICreatePaymentResponse,
} from "@/types";




const getPaymentHistory = async (
  options: IPaymentFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IPayment[]>> => {
  const endpoint = `/api/payment/history${buildQueryString(options)}`;

  return executeAction<IPayment[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IPayment[]>(endpoint, {
        headers,
        next: {
          revalidate: 60,
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
};




const getAllPayments = async (
  options: IPaymentFilterOptions & IPaginationOptions = {}
): Promise<ActionResponse<IPayment[]>> => {
  const endpoint = `/api/payment${buildQueryString(options)}`;

  return executeAction<IPayment[]>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IPayment[]>(endpoint, {
        headers,
        next: {
          revalidate: 60,
          tags: ["payments"],
        },
      });
    },
    {
      method: "GET",
      endpoint,
      fallbackMessage: "Failed to fetch payments",
    }
  );
};





const getPaymentById = async (id: string): Promise<ActionResponse<IPayment>> => {
  const endpoint = `/api/payment/${id}`;

  return executeAction<IPayment>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.get<IPayment>(endpoint, {
        headers,
        next: {
          revalidate: 60,
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
};





const createPaymentIntent = async (
  payload: ICreatePaymentPayload
): Promise<ActionResponse<ICreatePaymentResponse>> => {
  const endpoint = "/api/payment/create";

  return executeAction<ICreatePaymentResponse>(
    async () => {
      const headers = await getAuthHeaders();
      return apiClient.post<ICreatePaymentResponse>(endpoint, payload, { headers });
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to initialize payment",
    }
  );
};





const confirmPayment = async (
  payload: IConfirmPaymentPayload
): Promise<ActionResponse<IPayment>> => {
  const endpoint = "/api/payment/confirm";

  return executeAction<IPayment>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post<IPayment>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("payments","max");
        revalidateTag("customer-bookings","max");
        revalidatePath("/customer/bookings");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to confirm payment",
    }
  );
};





const refundPayment = async (
  payload: IRefundPaymentPayload
): Promise<ActionResponse<IPayment>> => {
  const endpoint = "/api/payment/refund";

  return executeAction<IPayment>(
    async () => {
      const headers = await getAuthHeaders();
      const response = await apiClient.post<IPayment>(endpoint, payload, { headers });

      if (response.success) {
        revalidateTag("payments","max");
        revalidateTag("customer-bookings","max");
        revalidatePath("/admin/payments");
      }

      return response;
    },
    {
      method: "POST",
      endpoint,
      fallbackMessage: "Failed to process payment refund",
    }
  );
};



export {
  createPaymentIntent,
  confirmPayment,
  refundPayment,
  getPaymentHistory,
  getAllPayments,
  getPaymentById,
};