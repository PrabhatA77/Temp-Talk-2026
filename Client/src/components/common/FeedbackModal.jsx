import { useState } from "react";
import Modal from "./Modal.jsx";
import { toast } from "react-toastify";
import { sendFeedbackAPI } from "../../services/authService.js"; // Adjust import path as needed
import { MessageSquareDashed, Loader2 } from "lucide-react";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState("Bug Report");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await sendFeedbackAPI(category, message.trim());
      toast.success("Feedback sent! Thank you for helping improve Relay.");
      setMessage(""); // Clear form
      onClose();      // Close modal
    } catch (error) {
        console.error("Feedback Submission Error:", error);
      toast.error(error.response?.data?.message || "Failed to send feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Send Feedback">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
          Found a bug? Have a feature idea? Let us know directly!
        </p> */}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
          >
            <option value="Bug Report" className="bg-white dark:bg-zinc-950 text-black dark:text-white">🐛 Bug Report</option>
            <option value="Feature Request" className="bg-white dark:bg-zinc-950 text-black dark:text-white">✨ Feature Request</option>
            <option value="General Feedback" className="bg-white dark:bg-zinc-950 text-black dark:text-white">💬 General Feedback</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Message</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            rows={4}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquareDashed className="w-4 h-4" />}
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;