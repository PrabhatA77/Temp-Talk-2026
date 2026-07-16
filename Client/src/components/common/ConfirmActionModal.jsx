import Modal from "./Modal.jsx";
import useModalStore from "../../store/modalStore.js";
import { useState } from "react";

// Mount this ONCE near the root of PersistentChatRoom (or App).
// Any component triggers it via: setConfirmAction({ title, message, onConfirm })
const ConfirmActionModal = () => {
  const { confirmAction, clearConfirmAction } = useModalStore();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!confirmAction) return null;

  const { title, message, confirmLabel = "Confirm", danger = false, onConfirm } = confirmAction;

  const handleConfirm = async () => {
    setIsConfirming(true); 
    try {
      await onConfirm();
      clearConfirmAction();
    } finally {
      setIsConfirming(false); 
    }
  };

  return (
    <Modal onClose={clearConfirmAction} title={title}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={clearConfirmAction}
            disabled={isConfirming} 
            className="flex-1 py-2 rounded-lg border dark:border-white text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming} 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isConfirming ? "Confirming..." : confirmLabel} 
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;