// src/app/(dashboardGroup)/technician/_schema/services.schema.ts
import { z } from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.coerce
    .number({ message: "Price must be a number" }) 
    .min(1, "Price must be greater than 0"),
  duration: z.coerce
    .number({ message: "Duration must be a number" }) 
    .min(15, "Duration must be at least 15 minutes"),
  serviceArea: z
    .string()
    .min(1, "Enter at least one service area (comma separated)")
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    ),
  images: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    ),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export type CreateServiceFormValues = z.input<typeof createServiceSchema>;
export type UpdateServiceFormValues = z.input<typeof updateServiceSchema>;