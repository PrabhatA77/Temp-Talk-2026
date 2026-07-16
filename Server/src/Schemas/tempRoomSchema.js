import z from "zod";

export const createTempRoomSchema = z.object({
  duration: z
    .number({ required_error: "Duration is required" })
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration cannot exceed 24 hours"),

  topic: z
    .string()
    .max(50, "Topic cannot exceed 50 characters")
    .optional(),

  maxParticipants: z
    .number()
    .min(2, "At least 2 participants required")
    .max(10, "Cannot exceed 50 participants")
    .optional(),
  
    creatorName: z.string().min(1, "Creator name is required").max(20),
});

export const joinTempRoomSchema = z.object({
  roomId: z
    .string({ required_error: "Room ID is required" })
    .min(1, "Room ID cannot be empty")
    .max(20, "Invalid Room ID"),
});
