import {z} from "zod";
export const updateUsernameSchema = z.object({
    userName:z.string().trim().min(3,"Username must be at least 3 characters").max(30)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to delete your account"),
});