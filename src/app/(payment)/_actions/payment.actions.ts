// src/app/(payment)/_actions/payment.actions.ts
'use server';

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { ICreatePaymentPayload, IConfirmPaymentPayload } from "@/types";

const BASE_URL = process.env.BACKEND_API_URL as string;

/**
 * Helper function to retrieve authorization headers using cookies
 */
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


export async function createPaymentIntent(payload: ICreatePaymentPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/payment/create`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in createPaymentIntent:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to initialize payment",
    };
  }
}


export async function confirmPayment(payload: IConfirmPaymentPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/payment/confirm`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      revalidateTag("payments", "max");
      revalidateTag("customer-bookings", "max");
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in confirmPayment:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to confirm payment",
    };
  }
}