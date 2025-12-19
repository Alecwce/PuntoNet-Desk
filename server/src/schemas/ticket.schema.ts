import { z } from "zod";

export const createTicketSchema = z.object({
  body: z.object({
    subject: z
      .string({ required_error: "Subject is required" })
      .min(1, "Subject cannot be empty")
      .max(200, "Subject cannot be longer than 200 characters"),
    description: z
      .string({ required_error: "Description is required" })
      .min(1, "Description cannot be empty")
      .max(2000, "Description cannot be longer than 2000 characters"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
      required_error: "Priority is required",
      invalid_type_error: "Priority must be LOW, MEDIUM, HIGH, or CRITICAL",
    }),
  }),
});

export const updateTicketSchema = z.object({
  params: z.object({
    id: z.string().uuid("Ticket ID must be a valid UUID"),
  }),
  body: z.object({
    subject: z
      .string()
      .min(1, "Subject cannot be empty")
      .max(200, "Subject cannot be longer than 200 characters")
      .optional(),
    description: z
      .string()
      .min(1, "Description cannot be empty")
      .max(2000, "Description cannot be longer than 2000 characters")
      .optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    assigneeId: z
      .string()
      .uuid("Assignee ID must be a valid UUID")
      .nullable()
      .optional(),
  }),
});
