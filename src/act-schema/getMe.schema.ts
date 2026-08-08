// src/act-schema/getMe.schema.ts
import { z } from "zod";


export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
  profileImage: z
    .string()
    .url("Must be a valid URL")
    .optional(), 
});


export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;

