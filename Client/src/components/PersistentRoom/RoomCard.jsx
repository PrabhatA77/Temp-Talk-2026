import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MoreVertical, LogOut, Trash2 } from "lucide-react";
import useModalStore from "../../store/modalStore.js";
import usePersistentRoomStore from "../../store/persistentRoomStore.js";
import { leaveRoom, deleteRoom } from "../../services/persistentRoomService.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const RoomCard = ({ room, currentUserId }) => {
  const navigate = useNavigate();
  const setConfirmAction = useModalStore((state) => state.setConfirmAction);
  const fetchRooms = usePersistentRoomStore((state) => state.fetchRooms);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Check if current user is in the admins array
  const isAdmin = room.admins.some((a) => (a._id || a) === currentUserId);
  const memberCount = room.members?.length || 0;

  // Handle clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = () => {
    // Navigate using the roomCode (matching how your backend join routes are structured)
    navigate(`/persistent/${room._id}`);
  };

  const handleLeave = (e) => {
    e.stopPropagation(); // Prevents the card click from firing
    setMenuOpen(false);
    setConfirmAction({
      title: "Leave Room",
      message: `Are you sure you want to leave "${room.name}"?`,
      confirmLabel: "Leave",
      danger: true,
      onConfirm: async () => {
        try {
          await leaveRoom(room._id);
          toast.success("Left room successfully");
          fetchRooms(); // Instantly update dashboard
        } catch (err) {
          if (err.response?.data?.actionRequired === "transfer_admin") {
            toast.error(
              "You are the last admin. Please enter the room and promote someone before leaving.",
            );
          } else {
            toast.error(err.response?.data?.message || "Failed to leave room");
          }
        }
      },
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevents the card click from firing
    setMenuOpen(false);
    setConfirmAction({
      title: "Delete Room",
      message: `Permanently delete "${room.name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteRoom(room._id);
          toast.success("Room deleted");
          fetchRooms(); // Instantly update dashboard
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete room");
        }
      },
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="relative flex flex-col p-5 bg-white/1 dark:bg-black/1 backdrop-blur-sm rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all cursor-pointer group min-h-40 shadow dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
    >
      {/* Header Row */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold truncate pr-2 dark:text-white group-hover:underline">
          {room.name}
        </h3>

        {/* 3-Dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl w-40 z-10 overflow-hidden">
              <button
                onClick={handleLeave}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Leave
              </button>
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
        {room.description || "No description provided."}
      </p>

      {/* Footer Row */}
      {/* Footer Row */}
      <div className="flex items-center justify-between mt-4">
        {/* 💡 Wrap the counts in a flex container */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>
              {memberCount} Member{memberCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* 💡 NEW: Live Online Count */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="relative flex h-2 w-2">
              {room.onlineCount > 0 && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  room.onlineCount > 0 ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </span>
            <span
              className={
                room.onlineCount > 0 ? "text-green-600 dark:text-green-400" : ""
              }
            >
              {room.onlineCount || 0} Online
            </span>
          </div>
        </div>

        {isAdmin && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
            Admin
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default RoomCard;
