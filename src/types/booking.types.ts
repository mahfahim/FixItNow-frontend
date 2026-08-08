// src/types/booking.types.ts

import { BookingStatus, PaymentStatus } from "./enums";
import { IPaginationOptions} from "./index";

export type ICreateBookingPayload = {
  serviceId: string;
  technicianId?: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  addressId?: string;
  notes?: string;
};

export type IUpdateBookingStatusPayload = {
  status: BookingStatus;
  cancellationReason?: string;
  note?: string;
};

export type IBookingFilterOptions = {
  search?: string;        
  searchTerm?: string;
  status?: BookingStatus | string;  
  paymentStatus?: PaymentStatus | string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  technicianId?: string;
};

export interface GetBookingsOptions extends IBookingFilterOptions, IPaginationOptions {};