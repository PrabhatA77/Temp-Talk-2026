import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // snapshot at submission time — survives username changes or account
    // deletion without needing a populate() join on the public endpoint
    displayName: { type: String, required: true, trim: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    allowPublic: { type: Boolean, default: false },

    sentiment: { type: String, enum: ["positive", "neutral", "negative"], default: "neutral" },
    confidence: { type: Number, default: 0 },
    topic: { type: String, default: "" },
    quality: { type: Number, default: 0 },

    featured: { type: Boolean, default: false },
    analyzedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

testimonialSchema.index({ featured: 1, allowPublic: 1 });

export default mongoose.model("Testimonial", testimonialSchema);