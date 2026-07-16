import { useRef, useState, useEffect } from "react";
import { SendHorizonal,Paperclip,Smile } from "lucide-react";
import { toast } from "react-toastify";
import UploadProgressBar from "../PersistentRoom/UploadProgressBar.jsx";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  onSend,
  disabled,
  disabledText,
  onTyping,
  onStopTyping,
  onUploadFile,
}) => {
  const [text, setText] = useState("");
  const [uploadProgress,setUploadProgress] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef =useRef(null);

  const isUploading = uploadProgress !== null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const stopTypingNow = () => {
    if (isTypingRef.current) {
      onStopTyping?.();
      isTypingRef.current = false;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // clean up the timer if the component unmounts mid-typing
  useEffect(() => () => stopTypingNow(), []); // eslint-disable-line react-hooks/exhaustive-deps

  //auto resize textarea height
  const handleChange = (e) => {
    setText(e.target.value);

    const textarea = textareaRef.current;
    const maxHeight = 120;
    //reset height first so it can shrink if user deletes text
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }

    // --- typing signal (debounced) ---
    if (e.target.value.trim()) {
      if (!isTypingRef.current) {
        onTyping?.(); // fire once when typing starts, not on every keystroke
        isTypingRef.current = true;
      }
      // reset the 2s "went silent" timer on every keystroke
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(stopTypingNow, 2000);
    } else {
      stopTypingNow(); // input cleared
    }
  };

  const sendMessage = () => {
    const trimmed = text.trim();

    //dont send empty messages
    if (!trimmed) return;

    //send to server via websocket
    onSend(trimmed);

    // clear input + reset height back to 1 line
    stopTypingNow(); 
    setText("");
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    // press Enter to send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so picking the same file twice still fires onChange
    if (!file || !onUploadFile) return;

    if (file.size > 10 * 1024 * 1024) {
      return toast.error("File size exceeds the 10 MB limit.");
    }

    setUploadProgress(0);
    try {
      await onUploadFile(file, (percent) => setUploadProgress(percent));
      // success — the actual message bubble arrives via WS newMessage, nothing to render here
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadProgress(null);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    
    // Simulate a change event so typing indicators and textarea height update
    if (textareaRef.current) {
      // Focus back on the input after picking an emoji
      textareaRef.current.focus(); 
    }
  };

  return (
    <div className="relative dark:border-white px-4 py-3">
      {isUploading && (
        <div className="mb-2">
          <UploadProgressBar progress={uploadProgress}/>
        </div>
      )}

      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-4 mb-2 z-50 shadow-2xl animate-fade-in"
        >
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            theme="auto" // Automatically detects system dark/light mode
            lazyLoadEmojis={true}
          />
        </div>
      )}

      <div className="flex items-end gap-3">
        {onUploadFile && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handlePaperclipClick}
              disabled={disabled || isUploading}
              className="mb-1 p-2 rounded-full  dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
              title="Send an image or file (Max size: 10 MB)"
            >
              <Paperclip className="w-4 h-4"/>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          disabled={disabled || isUploading}
          className="mb-1 p-2 rounded-full dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
          title="Add Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* text area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={stopTypingNow}
          placeholder={disabled ? disabledText : "Type a message..."}
          disabled={disabled}
          rows={1} //starts as 1 line
          style={{ maxHeight: "120px", overflowY: "hidden" }}
          className="flex-1 resize-none bg-transparent border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {/* send button */}
        <button
          onClick={sendMessage}
          disabled={disabled || isUploading || !text.trim()}
          className="mb-1 p-2 rounded-full dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
        >
          <SendHorizonal className="w-4 h-4" />
        </button>
      </div>

      {/* hint text */}
      {!disabled && !isUploading && (
        <p className="text-[10px] text-gray-400 mt-1 ml-1">
          Enter to send · Shift+Enter for new line
        </p>
      )}
    </div>
  );
};

export default MessageInput;
