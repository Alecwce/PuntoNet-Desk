import { z } from "zod";

export const createClientSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters long"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Must be a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({
    id: z.string().uuid("Client ID must be a valid UUID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .optional(),
    email: z.string().email("Must be a valid email address").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional(),
  }),
});
