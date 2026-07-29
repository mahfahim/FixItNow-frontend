// src/types/review.types.ts
export type ICreateReviewPayload = {
  bookingId: string;
  rating: number; // 1 to 5
  comment?: string;
};

export type IUpdateReviewPayload = {
  rating?: number;
  comment?: string;
};

export type IReviewFilterOptions = {
  searchTerm?: string;
  rating?: number;
  technicianId?: string;
  customerId?: string;
};
