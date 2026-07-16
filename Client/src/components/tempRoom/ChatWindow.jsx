import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import { MessageSquare } from "lucide-react";

const ChatWindow = ({messages,currentUserName,isExpired, isAdmin, onEdit, onDelete, onImageClick}) => {
  
  const bottomRef = useRef(null); //invisible div at the bottom

  //auto scroll to bottom every time messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      {/* empty state */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center select-none">
          <div className="w-12 h-12 rounded-full  flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-gray-300 dark:text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
              No messages yet
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-700 mt-0.5">
              Be the first to say something
            </p>
          </div>
        </div>
      )}

      {/* render each message */}
      {messages.map((msg, index) => {
        // system message - centered
        if (msg.type === "system") {
          return (
            <div key={index} className="flex justify-center">
              <span className="text-[11px] text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full">
                {msg.text}
              </span>
            </div>
          );
        }

        //normal message
        return (
          <MessageBubble
            key={msg._id || index}
            message={msg}
            isOwn={msg.userName === currentUserName}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            onImageClick={onImageClick}
          />
        );
      })}

      {/* room expired message */}
      {isExpired && (
        <div className="flex justify-center">
          <span className="text-[11px] text-red-400 bg-red-50 dark:bg-red-950 px-3 py-1 rounded-full">
            This Room has Expired
          </span>
        </div>
      )}

      {/* invisible div - scroll target */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
