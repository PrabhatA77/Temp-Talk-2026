// components/tempRoom/RoomExpiredModal.jsx
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const RoomExpiredModal = () => {
  const navigate = useNavigate();

  return (
    // overlay — not clickable to dismiss, user must choose an option
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-8 w-full max-w-sm flex flex-col items-center gap-6 text-center">

        {/* icon */}
        <div className="w-14 h-14 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center">
          <Clock className="w-6 h-6 text-gray-400 dark:text-gray-600" />
        </div>

        {/* text */}
        <div>
          <h2 className="text-lg font-bold dark:text-white">Room Expired</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            This room's time is up. All messages have been cleared.
          </p>
        </div>

        {/* actions */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate("/temp/create")}
            className="w-full py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Create a new room
          </button>
          <button
            onClick={() => navigate("/temp/join")}
            className="w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Join another room
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoomExpiredModal;