import z from "zod";

export const registerSchema = z.object({
    userName: z.string().trim().min(3,"Username must be at least 3 characters long").max(30,"username cannot be larger then 30 characters"),
    email:z.email().trim().min(10,"Email must be at least 10 characters long").max(50,"Email cannot be larger then 30 characters"),
    password: z.string().trim().min(6,"Password must be at least 6 characters long").max(100,"Password cannot be long then 100 characters")
});

export const loginSchema = z.object({
    identifier:z.string().trim().min(1,"Username or Email is required").max(50,"Email or Username cannot be larger then 30 characters"),
    password: z.string().trim().min(6,"Password must be at least 6 characters long").max(100,"Password cannot be long then 100 characters")
});

export const otpSchema = z.object({
        email:z.email().trim().min(10,"Email must be at least 10 characters long").max(50,"Email cannot be larger then 30 characters"),
    verificationOtp : z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
})

export const sendVerificationOtpSchema = z.object({
    email:z.email().trim().min(10,"Email must be at least 10 characters long").max(50,"Email cannot be larger then 30 characters"),
})

export const forgotPasswordSchema = z.object({
    email:z.email().trim().min(10,"Email must be at least 10 characters long").max(50,"Email cannot be larger then 30 characters"),
})

export const verifyResetOtpSchema = z.object({
    email:z.email().trim().min(10,"Email must be at least 10 characters long").max(50,"Email cannot be larger then 30 characters"),
    otp : z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
    
})

export const resetPasswordSchema = z.object({
    email:z.email().trim().min(10,"Email must be at least 10 characters long").max(50,"Email cannot be larger then 30 characters"),
    
    password: z.string().trim().min(6,"Password must be at least 6 characters long").max(100,"Password cannot be long then 100 characters")
}) 