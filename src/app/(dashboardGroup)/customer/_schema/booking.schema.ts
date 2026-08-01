// src/app/(dashboardGroup)/customer/_schema/booking.schema.ts

import { z } from "zod";


const NO_HTML_REGEX = /^[^<>]*$/; 
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; 
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/; 

export const createBookingSchema = z.object({
    serviceId: z
        .string({ message: "Service selection is required" })
        .trim()
        .min(1, "Service selection is required")
        .regex(SAFE_ID_REGEX, "Invalid Service ID format"),

    technicianId: z
        .string({ message: "Technician selection is required" })
        .trim()
        .min(1, "Technician selection is required")
        .regex(SAFE_ID_REGEX, "Invalid Technician ID format"),

    scheduledDate: z
        .string({ message: "Scheduled date is required" })
        .trim()
        .min(1, "Please pick a date")
        .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
            message: "Invalid date format provided",
        }),

    scheduledTime: z
        .string({ message: "Scheduled time is required" })
        .trim()
        .min(1, "Please pick a time")
        .regex(TIME_REGEX, "Invalid time format (must be HH:mm, e.g. 14:30)"),

    address: z
        .string({ message: "Address is required" })
        .trim()
        .min(5, "Address must be at least 5 characters long")
        .max(250, "Address cannot exceed 250 characters")
        .regex(NO_HTML_REGEX, "Address contains invalid or illegal characters (< or >)"),

    addressId: z
        .string()
        .trim()
        .regex(SAFE_ID_REGEX, "Invalid Address ID format")
        .optional()
        .or(z.literal("")),

    notes: z
        .string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .regex(NO_HTML_REGEX, "Notes contain invalid or illegal characters (< or >)")
        .optional()
        .or(z.literal("")),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;

export const cancelBookingSchema = z.object({
    cancellationReason: z
        .string({ message: "Cancellation reason is required" })
        .trim()
        .min(5, "Reason must be at least 5 characters long")
        .max(200, "Reason cannot exceed 200 characters")
        .regex(NO_HTML_REGEX, "Cancellation reason contains invalid or illegal characters (< or >)"),
});

export type CancelBookingFormValues = z.infer<typeof cancelBookingSchema>;