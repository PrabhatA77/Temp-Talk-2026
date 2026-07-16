import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const TempRoomModal = ({ onclose }) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    onclose();
    navigate("/temp/create");
  };

  const handleJoin = () => {
    onclose();
    navigate("/temp/join");
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-125 rounded-xl bg-white dark:bg-neutral-900 shadow-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold dark:text-white">Temp Room</h2>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={onclose}
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="dark:text-white cursor-pointer" />
        </motion.button>
      </div>

      {/* Body */}
      <div className="mt-6 flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleCreate}
          className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Create a Room
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleJoin}
          className="w-full rounded-lg border border-black py-3 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Join a Room
        </motion.button>
      </div>
    </div>
  );
};

export default TempRoomModal;
