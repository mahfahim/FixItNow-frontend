// src/types/enums.ts
export enum Role {
  CUSTOMER = "CUSTOMER",
  TECHNICIAN = "TECHNICIAN",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum BookingStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  PAID = "PAID",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentProvider {
  STRIPE = "STRIPE",
  SSLCOMMERZ = "SSLCOMMERZ",
}

export enum Weekday {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum NotificationType {
  BOOKING = "BOOKING",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
  REVIEW = "REVIEW",
}

