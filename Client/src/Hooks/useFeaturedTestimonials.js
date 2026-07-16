import { useEffect, useState } from "react";
import { getFeaturedTestimonials } from "../services/testimonialService.js";

// Centralized fetch so any page can reuse it without duplicating logic —
// exactly the reusability the spec asked for (Landing/About/etc. later).
export function useFeaturedTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getFeaturedTestimonials()
      .then((data) => { if (!cancelled) setTestimonials(data.testimonials || []); })
      .catch(() => { if (!cancelled) setTestimonials([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { testimonials, loading };
}