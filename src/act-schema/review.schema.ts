// src/act-schema/review.schema.ts 
// src/act-schema/review.schema.ts

import { z } from "zod";

const NO_HTML_REGEX = /^[^<>]*$/; 
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/; 

export const createReviewSchema = z.object({
  bookingId: z
    .string({ message: "Booking selection is required" })
    .trim()
    .min(1, "Booking selection is required")
    .regex(SAFE_ID_REGEX, "Invalid Booking ID format"),

  rating: z
    .number({ message: "Rating is required" })
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),

  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(500, "Comment cannot exceed 500 characters")
    .regex(NO_HTML_REGEX, "Comment contains invalid characters (< or >)")
    .optional()
    .or(z.literal("")),
});

export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;