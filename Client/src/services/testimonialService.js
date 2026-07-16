import api from "./api.js";

export const getFeaturedTestimonials = async () => {
  const res = await api.get("/auth/testimonial/featured");
  return res.data;
};

export const submitTestimonial = async ({ rating, message, displayName, allowPublic }) => {
  const res = await api.post("/auth/testimonial", { rating, message, displayName, allowPublic });
  return res.data;
};