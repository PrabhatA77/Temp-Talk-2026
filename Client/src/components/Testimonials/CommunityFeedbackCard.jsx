import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircleHeart } from "lucide-react";

const ROTATE_INTERVAL = 7000;

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`w-4 h-4 ${i <= rating ? "fill-black text-black dark:fill-white dark:text-white" : "text-gray-300 dark:text-gray-700"}`} />
    ))}
  </div>
);

// Expects the parent to fetch testimonials (via useFeaturedTestimonials) and
// only render this once there's at least one — keeps this component reusable
// and dumb, per the spec's "future expansion" requirement.
const CommunityFeedbackCard = ({ testimonials, title = "Community Feedback", compact = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  const active = testimonials[activeIndex];

  return (
    <div className={`flex flex-col gap-4 ${compact ? "" : "h-full justify-center"}`}>
      {!compact && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <MessageCircleHeart className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">{title}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-3"
        >
          <StarRating rating={active.rating} />
          <p className={`text-black dark:text-white leading-relaxed ${compact ? "text-sm" : "text-lg"}`}>"{active.message}"</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">— {active.name}</p>
        </motion.div>
      </AnimatePresence>

      {testimonials.length > 1 && (
        <div className="flex gap-1.5 mt-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${i === activeIndex ? "w-6 bg-black dark:bg-white" : "w-1.5 bg-gray-300 dark:bg-gray-700"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeedbackCard;