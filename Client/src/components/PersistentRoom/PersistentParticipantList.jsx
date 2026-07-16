import UserAvatar from "../common/UserAvatar.jsx";
import useModalStore from "../../store/modalStore.js";
import {
  kickMember,
  blockMember,
  promoteMember,
} from "../../services/persistentRoomService.js";
import { toast } from "react-toastify";
import { UserX, Ban, ShieldPlus } from "lucide-react";

// participants: [{ _id, userName }]
const PersistentParticipantList = ({
  roomId,
  participants,
  currentUserId,
  hostId,
  isAdmin,
  roomAdmins = [],
  onlineUserIds
}) => {
  const setConfirmAction = useModalStore((state) => state.setConfirmAction);

  const formatDisplayName = (name) => {
    if (!name) return "";
    
    // 1. Take only the first word (splits by spaces and gets index 0)
    const firstWord = name.trim().split(/\s+/)[0];
    
    // 2. If that single word is longer than 10 characters, truncate it with ...
    const MAX_LENGTH = 10;
    if (firstWord.length > MAX_LENGTH) {
      return firstWord.slice(0, MAX_LENGTH) + "...";
    }
    
    return firstWord;
  };

  const handleKick = (member) => {
    setConfirmAction({
      title: "Kick Member",
      message: `Remove ${member.userName} from this room?`,
      confirmLabel: "Kick",
      danger: true,
      onConfirm: async () => {
        try {
          await kickMember(roomId, member._id, member.userName);
          toast.success(`${member.userName} was removed`);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to kick member");
        }
      },
    });
  };

  const handleBlock = (member) => {
    setConfirmAction({
      title: "Block Member",
      message: `Block ${member.userName}? They won't be able to rejoin this room.`,
      confirmLabel: "Block",
      danger: true,
      onConfirm: async () => {
        try {
          await blockMember(roomId, member._id, member.userName);
          toast.success(`${member.userName} was blocked`);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to block member");
        }
      },
    });
  };

  const handlePromote = (member) => {
    setConfirmAction({
      title: "Promote to Admin",
      message: `Make ${member.userName} an admin of this room?`,
      confirmLabel: "Promote",
      danger: false,
      onConfirm: async () => {
        try {
          await promoteMember(roomId, member._id);
          toast.success(`${member.userName} is now an admin`);
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to promote member",
          );
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
        Participants ({participants.length})
      </p>

      <div className="flex flex-col gap-3">
        {participants.map((member) => {
          const isSelf = String(member._id) === String(currentUserId);
          const isHost = String(member._id) === String(hostId);
          
          // 💡 Flat Rule: If current user is Admin, show actions on everyone except themselves
          const showActions = isAdmin && !isSelf;
          
          const isMemberAdmin = roomAdmins.some(
            (a) => String(a._id || a) === String(member._id)
          );
          return (
            // "group" lets the icon buttons below react to hover on THIS row specifically
            <div
              key={member._id}
              className="group flex items-center justify-between gap-3 p-2 rounded-2xl backdrop-blur-sm bg-white/1 dark:bg-black/1 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <UserAvatar username={member.userName} avatarUrl={member.avatarUrl}/>
                  {onlineUserIds.includes(member._id) && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                  )}
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-sm dark:text-white truncate"
                    title={member.userName}
                  >
                    {formatDisplayName(member.userName)}
                  </span>

                  {isSelf && (
                    <span className="text-[10px] border rounded px-1 dark:border-white dark:text-white text-gray-500">
                      you
                    </span>
                  )}

                  {(isHost || isMemberAdmin) && (
                    <span className="text-[10px] border border-black dark:border-white rounded px-1 bg-black text-white dark:bg-white dark:text-black">
                      admin
                    </span>
                  )}
                </div>
              </div>

              {showActions && (
                /* 💡 Updated theme variables: Icons are perfectly visible on both backgrounds */
                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  {!isMemberAdmin && (
                    <button
                      onClick={() => handlePromote(member)}
                      title="Promote to Admin"
                      className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <ShieldPlus className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleKick(member)}
                    title="Kick"
                    className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleBlock(member)}
                    title="Block"
                    className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersistentParticipantList;