// components/tempRoom/ExtendRoomModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import DurationPicker from "../common/DurationPicker";
import { extendTempRoom } from "../../services/tempRoomService";
import { handleApiError } from "../../utils/handleApiError";
import useTempRoomStore from "../../store/tempRoomStore";
import { toast } from "react-toastify";

const ExtendRoomModal = ({ roomId, onClose }) => {
  const { userName } = useTempRoomStore();
  const [duration, setDuration] = useState(30);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState("");

  const handleExtend = async () => {
    setMessage("");
    if (!duration || duration === 0) return setMessage("Please select a duration");

    try {
      setLoading(true);
      const res = await extendTempRoom({
        roomId,
        extraMinutes: duration,
        userName,
      });
      if (res.success) toast.success(res.message);
      onClose();
    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold dark:text-white">Extend Room</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 dark:text-white" />
          </button>
        </div>

        {/* duration picker — reused directly */}
        <DurationPicker value={duration} onChange={setDuration} />

        {message && (
          <p className="text-sm text-red-500 mt-2">{message}</p>
        )}

        <button
          onClick={handleExtend}
          disabled={loading}
          className="mt-4 w-full py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {loading ? "Extending..." : "Extend Room"}
        </button>
      </div>
    </div>
  );
};

export default ExtendRoomModal;