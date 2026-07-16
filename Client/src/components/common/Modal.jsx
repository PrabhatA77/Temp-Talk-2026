import { X } from "lucide-react";
import { motion } from "framer-motion";

const Modal = ({ onClose, title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* modal box - slide up animation */}
      <motion.div
        initial={{ y: "100%", opacity: 0.5, scale: 1 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: "100%", opacity: 0, transition: { duration: 0.15 } }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-white dark:bg-black border dark:border-white w-full max-w-md rounded-t-2xl p-6 animate-slide-up max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="font-bold dark:text-white">{title}</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 dark:text-white cursor-pointer" />
          </button>
        </div>
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
