// src/app/(authGroup)/_schema/auth.schema.ts
import { z } from "zod";
import { Role } from "@/types";


export const loginValidationSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});


export const registerValidationSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  role: z.enum([Role.CUSTOMER, Role.TECHNICIAN], {
    message: "Role must be either CUSTOMER or TECHNICIAN",
  }),
});


export type LoginValidationSchema = z.infer<typeof loginValidationSchema>;
export type RegisterValidationSchema = z.infer<typeof registerValidationSchema>;