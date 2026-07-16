import Testimonial from "../Models/testimonialModel.js";
import { analyzeTestimonial } from "./aiTestimonial.service.js";

const FEATURE_THRESHOLDS = {
  minConfidence: 0.7,
  minQuality: 0.6,
  minRating: 4,
  minMessageLengthForAI: 25, // cheap pre-filter — skip the AI call for very short submissions
};

export async function createTestimonial({ userId, userName, rating, message, displayName, allowPublic }) {
  const testimonial = await Testimonial.create({
    userId,
    displayName: displayName?.trim() || userName,
    rating,
    message: message.trim(),
    allowPublic,
  });

  // background analysis — fire-and-forget, never blocks the submission response
  processTestimonial(testimonial._id.toString()).catch((err) =>
    console.error("testimonial.service: background analysis failed:", err.message)
  );

  return testimonial;
}

async function processTestimonial(testimonialId) {
  const testimonial = await Testimonial.findById(testimonialId);
  if (!testimonial) return;

  if (testimonial.message.length < FEATURE_THRESHOLDS.minMessageLengthForAI) {
    testimonial.sentiment = "neutral";
    testimonial.featured = false;
    testimonial.analyzedAt = new Date();
    await testimonial.save();
    return;
  }

  const analysis = await analyzeTestimonial(testimonial.message);
  if (!analysis) return; // AI failed — leave unanalyzed rather than guessing

  testimonial.sentiment = analysis.sentiment;
  testimonial.confidence = analysis.confidence;
  testimonial.topic = analysis.topic;
  testimonial.quality = analysis.quality;
  testimonial.analyzedAt = new Date();

  // the actual "should this be featured" decision is OUR policy, not the AI's opinion
  testimonial.featured =
    testimonial.allowPublic &&
    analysis.sentiment === "positive" &&
    analysis.confidence >= FEATURE_THRESHOLDS.minConfidence &&
    analysis.quality >= FEATURE_THRESHOLDS.minQuality &&
    testimonial.rating >= FEATURE_THRESHOLDS.minRating;

  await testimonial.save();
}

export async function getFeaturedTestimonials(limit = 10) {
  // fetch a larger pool so we can de-duplicate by user below without a second query
  const pool = await Testimonial.find({ featured: true, allowPublic: true })
    .sort({ quality: -1, createdAt: -1 })
    .limit(limit * 3)
    .select("userId displayName rating message topic");

  const seenUsers = new Set();
  const deduped = [];

  for (const t of pool) {
    const key = t.userId.toString();
    if (seenUsers.has(key)) continue;
    seenUsers.add(key);
    deduped.push(t);
    if (deduped.length >= limit) break;
  }

  return deduped;
}