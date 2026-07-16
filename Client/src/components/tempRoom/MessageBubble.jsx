import UserAvatar from "../common/UserAvatar.jsx";
import { Pencil, Trash2, Check, X, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import useModalStore from "../../store/modalStore.js";

const MessageBubble = ({
  message,
  isOwn,
  isAdmin,
  onEdit,
  onDelete,
  onImageClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.text);
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);
  const setConfirmAction = useModalStore((state) => state.setConfirmAction);

  const time = new Date(message.sentAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const canEdit = isOwn && !!onEdit && !message.fileUrl;
  const canDelete = (isOwn || isAdmin) && !!onDelete;

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === message.text) {
      setIsEditing(false);
      return;
    }
    onEdit(message._id, trimmed);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setConfirmAction({
      title: "Delete Message",
      message:
        "This message will be removed for everyone. This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        setIsDeletingLocal(true);
        try {
          await onDelete(message._id);
        } finally {
          setIsDeletingLocal(false);
        }
      },
    });
  };

  const handleFileDownload = async () => {
    setIsDownloadingFile(true);
    try {
      const response = await fetch(message.fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = message.fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("File download failed:", err);
    } finally {
      setIsDownloadingFile(false);
    }
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[70%] text-xs italic text-gray-400 dark:text-gray-600 px-4 py-2">
          This message was deleted
        </div>
      </div>
    );
  }

  if (isDeletingLocal) {
    return (
      <div
        className={`flex ${isOwn ? "justify-end" : "justify-start"} items-center w-full gap-2 px-4 py-2`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-xs text-gray-400 italic">Deleting asset...</span>
      </div>
    );
  }

  const actionButtons = (canEdit || canDelete) && !isEditing && (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {canEdit && (
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      {canDelete && (
        <button
          onClick={handleDeleteClick}
          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-gray-500 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  const editBox = isEditing && (
    <div className="flex flex-col gap-2 w-full">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={2}
        autoFocus
        className="w-full resize-none rounded-lg border dark:border-white bg-transparent px-3 py-2 text-sm dark:text-white focus:outline-none"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            setDraft(message.text);
            setIsEditing(false);
          }}
          className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const imageElement = message.fileUrl && (
    <img
      src={message.fileUrl}
      alt={message.fileName || "Shared"}
      onClick={() => onImageClick?.(message._id)}
      className="rounded-lg max-w-sm w-full object-cover mt-1 cursor-zoom-in hover:opacity-95 transition-all"
    />
  );

  const fileCardElement = message.fileType &&
    message.fileType !== "image" &&
    message.fileUrl && (
      <button
        onClick={handleFileDownload}
        disabled={isDownloadingFile}
        className="flex items-center gap-3 w-full max-w-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 px-3 py-3 mt-1 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left disabled:opacity-60"
      >
        <div className="shrink-0 w-9 h-9 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          {isDownloadingFile ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium dark:text-white truncate">
            {message.fileName || "File"}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            {isDownloadingFile ? "Downloading..." : "Tap to download"}
          </p>
        </div>
      </button>
    );

  const shouldRenderText =
    message.text &&
    message.text !== "Image" &&
    message.text !== message.fileName;

  // My message (Right side)
  if (isOwn) {
    return (
      <div className="flex justify-end items-center gap-2 group w-full">
        {actionButtons}
        <div className="relative max-w-[70%] flex flex-col items-react justify-end">
          {isEditing ? (
            editBox
          ) : (
            <>
              {imageElement}
              {fileCardElement}
              {shouldRenderText && (
                <div className="bg-black text-white dark:bg-white dark:text-black rounded-2xl rounded-br-none py-2.5 px-4 text-sm wrap-break-word w-fit self-end">
                  {message.text}
                </div>
              )}
              <span className="absolute -bottom-5 right-0 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {time}{message.isEdited && " · edited"}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Other user's message (Left side)
  return (
    <div className="flex items-end gap-2 group w-full">
      <UserAvatar username={message.userName} avatarUrl={message.avatarUrl} />
      <div className="flex flex-col max-w-[70%]">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 ml-1">
          {message.userName}
        </p>
        <div className="flex items-center gap-2">
          <div className="relative flex flex-col items-start max-w-full">
            {isEditing ? (
              editBox
            ) : (
              <>
                {imageElement}
                {fileCardElement}
                {shouldRenderText && (
                  <div className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-2xl rounded-bl-none px-4 py-2.5 text-sm wrap-break-word w-fit">
                    {message.text}
                  </div>
                )}
                <span className="absolute -bottom-5 left-0 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {time}{message.isEdited && " · edited"}
                </span>
              </>
            )}
          </div>
          {actionButtons}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
