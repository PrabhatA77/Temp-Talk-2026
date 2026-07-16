import { useState, useRef, useEffect } from "react";
import { MoreVertical, LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useModalStore from "../../store/modalStore.js";
import { leaveRoom, deleteRoom } from "../../services/persistentRoomService.js";
import { toast } from "react-toastify";

// isAdmin: boolean — is the CURRENT user an admin of this room
const ParticipantListOptionsMenu = ({ roomId, isAdmin }) => {
  const navigate = useNavigate();
  const setConfirmAction = useModalStore((state) => state.setConfirmAction);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLeaveClick = () => {
    setDropDownOpen(false);
    setConfirmAction({
      title: "Leave Room",
      message: "Are you sure you want to leave this room?",
      confirmLabel: "Leave",
      danger: true,
      onConfirm: async () => {
        try {
          const data = await leaveRoom(roomId);
          toast.success(data.message || "Left room");
          navigate("/");
        } catch (err) {
          // Server sends this specific shape when you're the last admin
          if (err.response?.data?.actionRequired === "transfer_admin") {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.response?.data?.message || "Failed to leave room");
          }
        }
      },
    });
  };

  const handleDeleteClick = () => {
    setDropDownOpen(false);
    setConfirmAction({
      title: "Delete Room",
      message: "This permanently deletes the room and all its messages for everyone. This cannot be undone.",
      confirmLabel: "Delete Room",
      danger: true,
      onConfirm: async () => {
        try {
          const data = await deleteRoom(roomId);
          toast.success(data.message || "Room deleted");
          navigate("/");
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete room");
        }
      },
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="dark:text-white p-1"
        onClick={() => setDropDownOpen((prev) => !prev)}
      >
        <MoreVertical className="text-gray-600 dark:text-white cursor-pointer w-5 h-5" />
      </button>

      {dropDownOpen && (
        <div className="absolute right-0 top-8 bg-white dark:bg-black border dark:border-white rounded-lg shadow-lg w-44 overflow-hidden animate-fade-in z-40">
          <button
            onClick={handleLeaveClick}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Leave Room
          </button>

          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Room
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantListOptionsMenu;