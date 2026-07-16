import { useState, useRef, useEffect } from "react";
import { MoreVertical, Users, Share2, Timer } from "lucide-react";
import PeopleModal from "./modals/PeopleModal.jsx";
import InviteModal from "./modals/InviteModal.jsx";
import ExtendRoomModal from "./ExtendedRoomModal.jsx";
import useTempRoomStore from "../../store/tempRoomStore.js";

const RoomOptionsMenu = ({ roomId }) => {
  const { userName, room, isExtended } = useTempRoomStore();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const dropdownRef = useRef(null);

  const isCreator = userName === room?.creatorName;
  const isAlmostDone = room?.expiresAt
    ? new Date(room.expiresAt) - new Date() < 5 * 60 * 1000
    : false;

  //close dropdown when clickng outside
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
    setDropDownOpen(false); //close dropdown first
    setActiveModal(option); //then open modal
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          className="lg:hidden dark:text:white p-1"
          onClick={() => setDropDownOpen((prev) => !prev)}
        >
          <MoreVertical className="dark:text-white cursor-pointer" />
        </button>

        {dropDownOpen && (
          <div className="absolute right-0 top-8 bg-white dark:bg-black border dark:border-white rounded-lg shadow-lg w-40 overflow-hidden animate-fade-in z-40">
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
            {isAlmostDone && isCreator && !isExtended && (
              <button
                onClick={() => handleOption("extend")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
              >
                <Timer className="w-4 h-4" />
                Extend Room
              </button>
            )}
          </div>
        )}
      </div>
      {/* modals */}
      {activeModal === "people" && (
        <PeopleModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "invite" && (
        <InviteModal onClose={() => setActiveModal(null)} link={`${window.location.origin}/temp/join/${roomId}`} />
      )}
      {activeModal === "extend" && (
        <ExtendRoomModal roomId={roomId} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};

export default RoomOptionsMenu;
