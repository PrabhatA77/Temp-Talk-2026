import { useState } from "react";
import Modal from "../common/Modal.jsx";
import { toast } from "react-toastify";
import { Star, Loader2 } from "lucide-react";
import { submitTestimonial } from "../../services/testimonialService.js";

const SubmitTestimonialModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [allowPublic, setAllowPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || message.trim().length < 10) {
      toast.error("Please add a rating and at least a short message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTestimonial({ rating, message: message.trim(), displayName: displayName.trim(), allowPublic });
      toast.success("Thank you for sharing your experience!");
      setRating(0);
      setMessage("");
      setDisplayName("");
      setAllowPublic(false);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Rate Your Experience">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        

        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer"
            >
              <Star className={`w-7 h-7 transition-colors ${star <= (hoverRating || rating) ? "fill-black text-black dark:fill-white dark:text-white" : "text-gray-300 dark:text-gray-700"}`} />
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Your Experience</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you like about Relay? Be specific — it helps others!"
            rows={4}
            maxLength={1000}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Display Name (optional)</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Leave blank to use your account username"
            maxLength={50}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={allowPublic}
            onChange={(e) => setAllowPublic(e.target.checked)}
            className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
          />
          Allow this feedback to be shown publicly on the login/register pages
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </Modal>
  );
};

export default SubmitTestimonialModal;