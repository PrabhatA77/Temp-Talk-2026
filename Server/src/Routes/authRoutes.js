import express from "express";
import { register,login,googleLogin, getProfile, sendVerificationOtp, verifyOtp, forgotPassword, resetPassword, logout, verifyResetOtp,sendResetPasswordOtp } from "../Controllers/authController.js";
import { validate } from "../MiddleWare/validate.js";
import { registerSchema,loginSchema,otpSchema, forgotPasswordSchema, resetPasswordSchema, sendVerificationOtpSchema, verifyResetOtpSchema } from "../Schemas/authSchema.js";
import { updateUsername,changePassword,updateAvatar,deleteAccount } from "../Controllers/profileController.js";

import { submitFeedback } from "../Controllers/feedbackController.js";
import { updateUsernameSchema,changePasswordSchema,deleteAccountSchema } from "../Schemas/profileSchema.js";
import verifyToken from "../MiddleWare/verifyToken.js";
import upload from "../MiddleWare/multer.js";
import { submitTestimonial,getFeatured } from "../Controllers/testimonialController.js";
import { submitTestimonialSchema } from "../Schemas/testimonialSchema.js";

const router = express.Router();

router.post("/register",validate(registerSchema),register);
router.post("/login",validate(loginSchema),login);
router.post("/google",googleLogin);
router.post("/send-verification-otp",validate(sendVerificationOtpSchema),sendVerificationOtp);
router.post("/verify-email",validate(otpSchema),verifyOtp);
router.post("/forgot-password",validate(forgotPasswordSchema),forgotPassword);
router.post("/verify-reset-otp",validate(verifyResetOtpSchema),verifyResetOtp);
router.post("/send-reset-otp", sendResetPasswordOtp);
router.post("/reset-password",validate(resetPasswordSchema),resetPassword);
router.post("/logout",verifyToken,logout);
router.get("/profile",verifyToken,getProfile);

//profile management
router.patch("/profile/username",verifyToken,validate(updateUsernameSchema),updateUsername);
router.patch("/profile/password", verifyToken, validate(changePasswordSchema), changePassword);
router.post("/profile/avatar", verifyToken, upload.single("avatar"), updateAvatar);
router.delete("/profile", verifyToken, validate(deleteAccountSchema), deleteAccount);

router.post("/feedback",verifyToken,submitFeedback);

router.get("/testimonial/featured", getFeatured); 
router.post("/testimonial", verifyToken, validate(submitTestimonialSchema), submitTestimonial);

export default router;