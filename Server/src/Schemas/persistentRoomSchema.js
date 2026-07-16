import {z} from "zod";

export const createPersistentRoomSchema = z.object({
    name:z.string().trim().min(1,"Room name is Required").max(100),
    description:z.string().trim().max(500).optional(),
});

export const joinPersistentRoomSchema = z.object({
    roomCode: z
    .string()
    .length(6, "Room code must be 6 characters")
    .regex(/^[A-Z0-9]{6}$/i, "Invalid room code format"),
})