import { z } from "zod";

export const submitTestimonialSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(10, "Please share a bit more detail").max(1000),
  displayName: z.string().trim().max(50).optional(),
  allowPublic: z.boolean().optional().default(false),
});