import { createTestimonial, getFeaturedTestimonials } from "../services/testimonial.service.js";
import User from "../Models/userModel.js";

export const submitTestimonial = async (req, res) => {
  try {
    const { rating, message, displayName, allowPublic } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await createTestimonial({
      userId: user._id,
      userName: user.userName,
      rating,
      message,
      displayName,
      allowPublic,
    });

    return res.status(201).json({ success: true, message: "Thank you for your feedback!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to submit feedback" });
  }
};

export const getFeatured = async (req, res) => {
  try {
    const testimonials = await getFeaturedTestimonials(10);
    const formatted = testimonials.map((t) => ({
      name: t.displayName,
      rating: t.rating,
      message: t.message,
      topic: t.topic,
    }));

    return res.status(200).json({ success: true, testimonials: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch testimonials" });
  }
};