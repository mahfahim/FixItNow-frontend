// src/types/index.ts

export * from "./enums";
export * from "./auth.types";
export * from "./category.types";
export * from "./service.types";
export * from "./booking.types";
export * from "./review.types";
export * from "./technician.types";
export * from "./admin.types";
export * from "./payment.types";

import {
  Role,
  UserStatus,
  BookingStatus,
  PaymentStatus,
  PaymentProvider,
  Weekday,
  NotificationType,
} from "./enums";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string | null;
  status: UserStatus;
  isDeleted: boolean;
  lastLoginAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  technicianProfile?: ITechnician | null;
  addresses?: IAddress[];
  bookingsAsCustomer?: IBooking[];
  reviewsGiven?: IReview[];
  notifications?: INotification[];
  favoriteTechnicians?: IFavoriteTechnician[];
}

export interface ITechnician {
  id: string;
  userId: string;
  bio?: string | null;
  yearsOfExperience: number;
  hourlyRate: number | string;
  averageRating: number | string;
  totalReviews: number;
  totalCompletedJobs: number;
  profileImage?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  user: IUser;
  services?: IService[];
  bookingsAsTechnician?: IBooking[];
  reviewsReceived?: IReview[];
  availabilitySlots?: IAvailabilitySlot[];
  favoritedBy?: IFavoriteTechnician[];
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  services?: IService[];
}

export interface IService {
  id: string;
  technicianId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number | string;
  duration: number;
  images: string[];
  serviceArea: string[];
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  technician?: ITechnician;
  category?: ICategory;
  bookings?: IBooking[];
}

export interface IAddress {
  id: string;
  userId: string;
  label?: string | null;
  addressLine: string;
  city: string;
  district: string;
  postalCode?: string | null;
  isDefault: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  user?: IUser;
  bookings?: IBooking[];
}

export interface IBooking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  addressId?: string | null;
  scheduledDate: string | Date;
  scheduledTime: string;
  address: string;
  notes?: string | null;
  price: number | string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  cancellationReason?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  customer?: IUser;
  technician?: ITechnician;
  service?: IService;
  addressRef?: IAddress | null;
  payment?: IPayment | null;
  review?: IReview | null;
  statusHistory?: IBookingStatusHistory[];
}

export interface IBookingStatusHistory {
  id: string;
  bookingId: string;
  status: BookingStatus;
  note?: string | null;
  createdAt?: string | Date;

  booking?: IBooking;
}

export interface IPayment {
  id: string;
  bookingId: string;
  transactionId: string;
  amount: number | string;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt?: string | Date | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  booking?: IBooking;
}

export interface IReview {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment?: string | null;
  createdAt?: string | Date;

  booking?: IBooking;
  customer?: IUser;
  technician?: ITechnician;
}

export interface IAvailabilitySlot {
  id: string;
  technicianId: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  technician?: ITechnician;
}

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt?: string | Date;

  user?: IUser;
}

export interface IFavoriteTechnician {
  id: string;
  customerId: string;
  technicianId: string;
  createdAt?: string | Date;

  customer?: IUser;
  technician?: ITechnician;
}

export interface IPaginationOptions extends Record<string, unknown> {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}



export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: IPaginationOptions;
}


export interface PaginatedActionResponse<T = unknown> extends ActionResponse<T[]> {
  bookings?: T[];
}


export interface NextFetchCacheConfig {
  revalidate?: number | false;
  tags?: string[];
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ApiRequestOptions {
  headers?: HeadersInit;
  timeoutMs?: number;
  cache?: RequestCache;
  next?: NextFetchCacheConfig;
}

export interface ICreatePaymentResponse {
  payment: IPayment;
  gatewayUrl: string;
}