// src/types/payment.types.ts
import { PaymentProvider, PaymentStatus } from "./enums";

export type ICreatePaymentPayload = {
  bookingId: string;
  provider: PaymentProvider;
};

export type IConfirmPaymentPayload = {
  sessionId: string;
  transactionId?: string;
};

export type IRefundPaymentPayload = {
  paymentId: string;
  reason?: string;
  amount?: number;
};

export type IPaymentFilterOptions = {
  searchTerm?: string;
  status?: PaymentStatus;
  provider?: PaymentProvider;
  bookingId?: string;
  startDate?: string;
  endDate?: string;
};

export type IInitiatePaymentInput = {
  transactionId: string;
  bookingId: string;
  amount: number;
  provider: PaymentProvider;
  customerName: string;
  customerEmail: string;
  serviceName?: string;
};

export type IGatewayResult = {
  paymentUrl: string;
  sessionId?: string;
  sessionkey?: string;
};