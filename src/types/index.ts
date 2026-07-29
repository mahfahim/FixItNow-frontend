
export * from "./enums";


export * from "./auth.types";
export * from "./category.types";
export * from "./service.types";
export * from "./booking.types";
export * from "./payment.types";
export * from "./review.types";
export * from "./technician.types";
export * from "./admin.types";


export interface Review {
  id?: string;
  customerId?: string;
  technicianId?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  customer?: {
    id: string;
    name: string;
  };
}

export interface Service {
  id?: string;
  name: string;
}

export interface TechnicianUser {
  id: string;
  name: string;
  email: string;
}

export interface ITechnician {
  id: string;
  district?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user: TechnicianUser;
  services?: Service[];
  reviewsReceived?: Review[];
}