import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTempRoomStore from "../store/tempRoomStore.js";
import { tempChatWS } from "../services/ws.js";
import CountdownTimer from "../components/tempRoom/CountdownTimer";
import ParticipantList from "../components/tempRoom/ParticipantList.jsx";
import ChatWindow from "../components/tempRoom/ChatWindow";
import MessageInput from "../components/tempRoom/MessageInput";
import InvitePanel from "../components/tempRoom/InvitePanel";
import RoomOptionsMenu from "../components/tempRoom/RoomOptionsMenu";
import UsernamePrompt from "../components/tempRoom/UsernamePrompt.jsx";
import RoomExpiredModal from "../components/tempRoom/RoomExpiredModal.jsx";
import ExtendRoomModal from "../components/tempRoom/ExtendedRoomModal.jsx"

const TempChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    userName,
    setRoom,
    addMessage,
    addParticipant,
    removeParticipant,
    setExpired,
    clearRoom,
    room,
    isExpired,
    isExtended,
    setExtended,
    setIsCreator,
    participants,
    messages
  } = useTempRoomStore();

  //const [menuOpen,setMenuOpen] = useState(false);
  const [ready, setReady] = useState(
    !!(sessionStorage.getItem("tempUsername") || userName)?.trim(),
  );
  const [showExtendModal, setShowExtendModal] = useState(false);

  const isCreator = userName === room?.creatorName;
  const isAlmostDone = room?.expiresAt
    ? new Date(room.expiresAt) - new Date() < 5 * 60 * 1000
    : false;

  const connectToRoom = (name) => {
    //open ws connection + join the room
    tempChatWS.connect(roomId, name);

    //wire every server message type to a store action

    //when server says "joined" -> save room info in store
    tempChatWS.on("joined", (data) => {
      setRoom(data);
      //add all existing participants from server
      if(data.isExtended) setExtended();
      data.participants.forEach((p) => addParticipant(p));
      addParticipant(name); //add your self to list

      //load existing messages
      data.history.forEach((msg) => addMessage(msg));

      //check if this user is the creator
      setIsCreator(name === data.userName)
    });

    //when server says "newMessage"->add to message list
    tempChatWS.on("newMessage", (data) => addMessage(data));

    //when server says "userJoined"->add to participants list
    tempChatWS.on("userJoined", (data) => {
      addParticipant(data.userName);
      addMessage({
        type: "system",
        text: `${data.userName} joined the chat`,
        sentAt: new Date(),
      });
    });

    //when server says "userLeft"->remove from  participants list
    tempChatWS.on("userLeft", (data) => {
      removeParticipant(data.userName);
      addMessage({
        type: "system",
        text: `${data.userName} left the chat`,
        sentAt: new Date(),
      });
    });

    tempChatWS.on("roomExtended", (data) => {
      setRoom({ ...room, expiresAt: data.expiresAt });
      setExtended();
      addMessage({
        type: "system",
        text: "Room time has been extended",
        sentAt: new Date(),
      });
    });

    //when server says "roomExpired"->mark as expired in store
    tempChatWS.on("roomExpired", (data) => setExpired(data));

    //when server says "error"->navigate back
    tempChatWS.on("error", (data) => {
      //if username taken -> show prompt again with error
      //if room not found -> navigate away
      if (data.message?.includes("Username already taken")) {
        setReady(false);
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    //read from session storage
    const name =
      userName.trim() || sessionStorage.getItem("tempUsername") || "";

    //if username already exists connect immediately
    if (name) {
      connectToRoom(userName);
    }

    //cleanup runs when user leaves the page
    return () => {
      tempChatWS.disconnect();
      clearRoom();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //called a username prompt when guest types their name
  const handleUsernamePrompt = (name) => {
    setReady(true);
    connectToRoom(name);
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* username prompt - only shows if no usernmae yet */}
      {!ready && (
        <UsernamePrompt onJoin={handleUsernamePrompt} roomId={roomId} />
      )}

      {/* top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b dark:border-white">
        <div className="flex gap-3 justify-center items-center">
          <div className="font-bold text-2xl dark:text-white">RELAY</div>
          {room?.topic && room.topic !== "General Chat" && (
            <>
              <span className="text-gray-300 dark:text-gray-700">/</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                {room.topic}
              </span>
            </>
          )}
        </div>
        <div className="flex gap-3 justify-center items-center">
          {/* extend button — desktop only, < 5 mins, creator only, not extended yet */}
          {isAlmostDone && isCreator && !isExtended && (
            <button
              onClick={() => setShowExtendModal(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors animate-pulse"
            >
              Extend
            </button>
          )}
          <CountdownTimer />
          {/* 3 dot menu */}
          <RoomOptionsMenu roomId={roomId} />
        </div>

        {/* extend modal */}
        {showExtendModal && (
          <ExtendRoomModal
            roomId={roomId}
            onClose={() => setShowExtendModal(false)}
          />
        )}
      </div>

      {/* main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* left - participants list , hidden on mobile */}
        <div className="hidden lg:flex w-56 border-r border-gray-100  flex-col p-4 ">
          <ParticipantList
            participants={participants}
            currentUserName={userName}
            hostName={room?.creatorName}
            />
        </div>

        {/* middle - chat window + message input */}
        <div className="flex flex-col flex-1 overflow-hidden backdrop-blur-sm bg-white/1 dark:bg-black/1">
          <ChatWindow 
            messages={messages}
            currentUserName={userName}
            isExpired={isExpired}
          />
          <MessageInput 
            roomId={roomId}
            onSend={(text)=>tempChatWS.send({type:"message",roomId,text})}
            disabled={isExpired}
            disabledText="Room has Expired" 
          />
        </div>

        {/* right - invite panel, hidden on mobile */}
        <div className="hidden lg:flex w-64 border-l border-gray-100  flex-col p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <InvitePanel link={`${window.location.origin}/temp/join/${roomId}`} />
        </div>
      </div>

      {isExpired && <RoomExpiredModal />}

      {/* mobile bottom sheet - show when 3 dot menu tapped
      {menuOpen && (
        <RoomOptionsMenu
          roomId={roomId}
          onClose={()=>setMenuOpen(false)}
          />
      )} */}
    </div>
  );
};

export default TempChatRoom;
