// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toApiError } from "./api-error";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
}

export function formatDate(
  dateStr?: string | Date | null,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!dateStr) return "N/A";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatTime(timeStr?: string): string {
  if (!timeStr) return "N/A";
  const [hours, minutes] = timeStr.split(":");
  if (!hours || !minutes) return timeStr;
  const hourNum = parseInt(hours, 10);
  const period = hourNum >= 12 ? "PM" : "AM";
  const formattedHour = hourNum % 12 || 12;
  return `${formattedHour}:${minutes} ${period}`;
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
