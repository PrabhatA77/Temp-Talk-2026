import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    verificationOtp: { type: String, default: "" },
    verificationOtpSentAt: { type: Date, default: null },
    verificationOtpExpiresAt: { type: Date },
    resetOtp: { type: String, default: "" },
    resetOtpExpiresAt: { type: Date },
    resetOtpVerified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
