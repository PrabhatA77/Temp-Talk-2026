import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";
import usePersistentRoomStore from "../../store/persistentRoomStore.js";
import { persistentChatWS } from "../../services/ws.js";
import PersistentRoomOptionsMenu from "../../components/PersistentRoom/PersistentRoomOptionsMenu.jsx";
import ChatWindow from "../../components/tempRoom/ChatWindow.jsx";
import MessageInput from "../../components/tempRoom/MessageInput";
import InvitePanel from "../../components/tempRoom/InvitePanel.jsx";
import PersistentParticipantList from "../../components/PersistentRoom/PersistentParticipantList.jsx";
import ConfirmActionModal from "../../components/common/ConfirmActionModal.jsx";
import { toast } from "react-toastify";
import TypingIndicator from "../../components/PersistentRoom/TypingIndicator.jsx";
import { ChevronLeft } from "lucide-react";
import { uploadRoomFile } from "../../services/persistentRoomService.js";
import Lightbox from "../../components/PersistentRoom/Lightbox.jsx";
import RoomMoodIndicator from "../../components/PersistentRoom/RoomMoodIndicator.jsx";

const PersistentChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [activeLightboxImageId, setActiveLightboxImageId] = useState(null);

  const { user } = useAuthStore();
  const {
    activeRoom,
    messages,
    loadMessages,
    addMessage,
    addParticipant,
    removeParticipant,
    clearActiveRoom,
    promoteToAdmin,
    typingUsers,
    onlineUserIds,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    addTypingUser,
    removeTypingUser,
    editMessageInStore,
    removeMessageFromStore,
    roomMood,
    setRoomMood,
  } = usePersistentRoomStore();

  const typingTimeoutsRef = useRef({});

  const isAdmin = (activeRoom?.admins || []).some(
    (a) => String(a._id || a) === String(user?._id),
  );

  const participants = activeRoom?.members || [];

  useEffect(() => {
    usePersistentRoomStore
      .getState()
      .fetchRoomById(roomId) // roomId param is now the roomCode
      .catch(() => navigate("/"));

    //load message hostory from REST first
    loadMessages(roomId).catch(() => {});

    //connect ws - auth happens via httpOnly cookie,no username needed
    persistentChatWS.connect(roomId);

    persistentChatWS.on("newMessage", (data) => {
      addMessage({
        _id: data.message._id,
        userName: data.message.sender.userName,
        avatarUrl: data.message.sender.avatarUrl || "",
        text: data.message.content,
        fileUrl: data.message.fileUrl || "",
        fileName: data.message.fileName || "",
        fileType: data.message.fileType || "",
        sentAt: data.message.createdAt,
        isEdited: data.message.isEdited || false,
        isDeleted: data.message.isDeleted || false,
      });
    });

    persistentChatWS.on("userJoined", (data) => {
      addParticipant(data.userId, data.userName);
      addMessage({
        type: "system",
        text: `${data.userName} joined the room`,
        sentAt: new Date(),
      });
    });

    persistentChatWS.on("userLeft", (data) => {
      removeParticipant(data.userId);
      addMessage({
        type: "system",
        text: `${data.userName} left the room`,
        sentAt: new Date(),
      });
    });

    persistentChatWS.on("roomMoodUpdated", (data) => {
      setRoomMood(data.mood);
    });

    persistentChatWS.on("adminPromoted", (data) => {
      promoteToAdmin(data.userId);

      // Optional: Find the user's name to show a system message
      const promotedUser = usePersistentRoomStore
        .getState()
        .activeRoom?.members.find((m) => m._id === data.userId);
      if (promotedUser) {
        addMessage({
          type: "system",
          text: `${promotedUser.userName} is now an admin`,
          sentAt: new Date(),
        });
      }
    });

    persistentChatWS.on("onlineUsers", (data) => {
      setOnlineUsers(data.userIds);
    });

    persistentChatWS.on("userOnline", (data) => {
      addOnlineUser(data.userId);
    });

    persistentChatWS.on("userOffline", (data) => {
      removeOnlineUser(data.userId);
    });

    persistentChatWS.on("typing", (data) => {
      addTypingUser(data.userId, data.userName);

      if (typingTimeoutsRef.current[data.userId]) {
        clearTimeout(typingTimeoutsRef.current[data.userId]);
      }
      typingTimeoutsRef.current[data.userId] = setTimeout(() => {
        removeTypingUser(data.userId);
        delete typingTimeoutsRef.current[data.userId];
      }, 2000);
    });

    persistentChatWS.on("stopTyping", (data) => {
      removeTypingUser(data.userId);
      if (typingTimeoutsRef.current[data.userId]) {
        clearTimeout(typingTimeoutsRef.current[data.userId]);
        delete typingTimeoutsRef.current[data.userId];
      }
    });

    persistentChatWS.on("messageEdited", (data) => {
      editMessageInStore(data.messageId, data.newContent);
    });

    persistentChatWS.on("messageDeleted", (data) => {
      removeMessageFromStore(data.messageId);
    });

    function handleMembershipChange(data, action) {
      const { targetUserId, targetUserName, adminName } = data;

      if (targetUserId === user?._id) {
        // YOU are the victim
        toast.error(`You have been ${action} by ${adminName}.`);
        persistentChatWS.disconnect();
        navigate("/");
        return;
      }

      // bystander view — someone else was removed
      removeParticipant(targetUserId);
      addMessage({
        type: "system",
        text: `${targetUserName} was ${action} by ${adminName}`,
        sentAt: new Date(),
      });
    }

    persistentChatWS.on("roomDeleted", () => {
      toast.error("This room was deleted by the admin.");
      persistentChatWS.disconnect();
      navigate("/");
    });

    persistentChatWS.on("memberKicked", (data) => {
      handleMembershipChange(data, "kicked");
    });

    persistentChatWS.on("memberBlocked", (data) => {
      handleMembershipChange(data, "blocked");
    });

    persistentChatWS.on("error", (data) => {
      toast.error(data?.message || "An error occurred");
    });

    return () => {
      persistentChatWS.disconnect();
      clearActiveRoom();
      Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
      typingTimeoutsRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  //const participantNames = (activeRoom?.members || []).map((m) => m.userName);

  return (
    <div className="flex flex-col h-screen">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b dark:border-white">
        <div className="flex gap-3 justify-center items-center">
          <button
            onClick={() => navigate("/")}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-2xl dark:text-white">RELAY</div>

          {activeRoom?.name && (
            <>
              <span className="text-gray-300 dark:text-gray-700">/</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                {activeRoom.name}
              </span>
            </>
          )}

          {activeRoom?.description && (
            <>
              <span className="text-gray-300 dark:text-gray-700">/</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 tracking-widest">
                {activeRoom.description}
              </span>
            </>
          )}

          <RoomMoodIndicator mood={roomMood}/>
        </div>

        <PersistentRoomOptionsMenu
          roomId={roomId}
          isAdmin={isAdmin}
          participants={participants}
          currentUserId={user?._id}
          hostId={activeRoom?.creator?._id}
          roomAdmins={activeRoom?.admins || []}
          link={`${window.location.origin}/persistent/join?code=${activeRoom?.roomCode}`}
          onlineUserIds={onlineUserIds}
        />
      </div>

      {/* main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* left - participants, hidden on mobile */}
        <div className="hidden lg:flex w-64 border-r border-gray-100 flex-col p-4 gap-3">
          <PersistentParticipantList
            roomId={roomId}
            participants={participants}
            currentUserId={user?._id}
            hostId={activeRoom?.creator?._id}
            isAdmin={isAdmin}
            roomAdmins={activeRoom?.admins || []}
            onlineUserIds={onlineUserIds}
          />
        </div>

        {/* middle - chat */}
        <div className="flex flex-col flex-1 overflow-hidden backdrop-blur-sm bg-white/1 dark:bg-black/1">
          <ChatWindow
            messages={messages}
            currentUserName={user?.userName}
            isExpired={false} // persistent rooms never expire
            isAdmin={isAdmin}
            onEdit={(messageId, newContent) =>
              persistentChatWS.send({
                type: "editMessage",
                messageId,
                newContent,
              })
            }
            onDelete={(messageId) =>
              persistentChatWS.send({ type: "deleteMessage", messageId })
            }
            onImageClick={(messageId) => setActiveLightboxImageId(messageId)}
          />
          <TypingIndicator typingUsers={typingUsers} />
          <MessageInput
            onSend={(text) =>
              persistentChatWS.send({ type: "message", content: text })
            }
            onTyping={() => persistentChatWS.send({ type: "typing" })}
            onStopTyping={() => persistentChatWS.send({ type: "stopTyping" })}
            onUploadFile={(file, onProgress) =>
              uploadRoomFile(roomId, file, onProgress)
            } // CHANGED — was onUploadImage/uploadRoomImage
            disabled={false}
          />
        </div>

        <div className="hidden lg:flex w-64 border-l border-gray-100 flex-col p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <InvitePanel
            link={`${window.location.origin}/persistent/join?code=${activeRoom?.roomCode}`}
          />
        </div>
      </div>

      <ConfirmActionModal />

      {/* renders on top of everything when an image is clicked */}

      {activeLightboxImageId && (
        <Lightbox
          key={activeLightboxImageId}
          messages={messages}
          currentImageId={activeLightboxImageId}
          onClose={() => setActiveLightboxImageId(null)}
        />
      )}
    </div>
  );
};

export default PersistentChatRoom;
