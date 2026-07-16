import { useEffect, useState } from "react";
import usePersistentRoomStore from "../../store/persistentRoomStore.js";
import { Plus, LogIn } from "lucide-react";
import RoomCard from "../../components/PersistentRoom/RoomCard.jsx";
import useAuthStore from "../../store/authStore.js";
import CreateRoomModal from "../../components/Modal/CreateRoomModal.jsx";
import JoinRoomModal from "../../components/Modal/JoinRoomModal.jsx";
import { motion } from "framer-motion";
import ConfirmActionModal from "../../components/common/ConfirmActionModal.jsx";

const RoomsDashboard = () => {
  const { rooms, fetchRooms } = usePersistentRoomStore();
  const { user } = useAuthStore();

  // State to handle our future modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  useEffect(() => {
    // 1. Initial fetch on mount
    fetchRooms();

    // 2. Background Polling (Silently update counts every 10 seconds)
    const interval = setInterval(() => {
      fetchRooms();
    }, 10000);

    // 3. Tab Focus Tracking (Instantly update when user switches back to this tab)
    const handleFocus = () => fetchRooms();
    window.addEventListener("focus", handleFocus);

    // Cleanup listeners when leaving the dashboard
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchRooms]);

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white p-6 lg:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">My Rooms</h1>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.95 }}
              onClick={() => setIsJoinOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Join Room
            </motion.button>
            <motion.button
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Create Room
            </motion.button>
          </div>
        </div>

        {/* Rooms Grid Section */}
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              You haven't joined any rooms yet.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Create a new room or join an existing one to get started.
            </p>
          </div>
        ) : (
          <div
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} currentUserId={user?._id} />
            ))}
          </div>
        )}
      </div>

      {isCreateOpen && (
        <CreateRoomModal onClose={() => setIsCreateOpen(false)} />
      )}

      {isJoinOpen && <JoinRoomModal onClose={() => setIsJoinOpen(false)} />}

      <ConfirmActionModal />
    </div>
  );
};

export default RoomsDashboard;
