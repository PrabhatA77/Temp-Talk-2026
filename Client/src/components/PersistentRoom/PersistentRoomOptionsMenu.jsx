import { useState, useRef, useEffect } from "react";
import { MoreVertical, Users, Share2, LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal.jsx";
import InvitePanel from "../tempRoom/InvitePanel.jsx";
import PersistentParticipantList from "./PersistentParticipantList.jsx";
import useModalStore from "../../store/modalStore.js";
import { leaveRoom, deleteRoom } from "../../services/persistentRoomService.js";
import { toast } from "react-toastify";

const PersistentRoomOptionsMenu = ({
  roomId,
  isAdmin,
  participants,
  currentUserId,
  hostId,
  roomAdmins,
  link,
  onlineUserIds
}) => {
  const navigate = useNavigate();
  const setConfirmAction = useModalStore((state) => state.setConfirmAction);

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "people" | "invite" | null
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

  const handleOption = (option) => {
    setDropDownOpen(false);
    setActiveModal(option);
  };

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
          const responseData = err.response?.data;

          // Special case: server refuses because this user is the only admin
          // left with other members still in the room. Send them straight to
          // the People list so they can promote someone right away.
          if (responseData?.actionRequired === "transfer_admin") {
            toast.error(responseData.message);
            setActiveModal("people");
          } else {
            toast.error(responseData?.message || "Failed to leave room");
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
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          className="dark:text-white p-1"
          onClick={() => setDropDownOpen((prev) => !prev)}
        >
          <MoreVertical className="dark:text-white cursor-pointer" />
        </button>

        {dropDownOpen && (
          <div className="absolute right-0 top-8 bg-white dark:bg-black border dark:border-white rounded-lg shadow-lg w-44 overflow-hidden animate-fade-in z-40">
            <button
              onClick={() => handleOption("people")}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              People
            </button>

            <button
              onClick={() => handleOption("invite")}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Invite
            </button>

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

      {activeModal === "people" && (
        <Modal onClose={() => setActiveModal(null)} title="People in this room">
          <PersistentParticipantList
            roomId={roomId}
            participants={participants}
            currentUserId={currentUserId}
            hostId={hostId}
            isAdmin={isAdmin}
            roomAdmins={roomAdmins}
            onlineUserIds={onlineUserIds}
          />
        </Modal>
      )}

      {activeModal === "invite" && (
        <Modal onClose={() => setActiveModal(null)} title="Invite People">
          <InvitePanel link={link} />
        </Modal>
      )}
    </>
  );
};

export default PersistentRoomOptionsMenu;