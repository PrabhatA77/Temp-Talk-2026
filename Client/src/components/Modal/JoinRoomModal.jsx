import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal.jsx";
import usePersistentRoomStore from "../../store/persistentRoomStore.js";
import { toast } from "react-toastify";

const JoinRoomModal = ({ onClose }) => {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const joinRoom = usePersistentRoomStore((state) => state.joinRoom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return toast.error("Room code is required");

    setIsLoading(true);
    try {
      // 💡 FIX: Capture the room returned by the backend
      const joinedRoom = await joinRoom(roomCode);
      
      toast.success("Joined room successfully!");
      onClose();
      
      // 💡 FIX: Navigate using the database _id (matches your routing!)
      navigate(`/persistent/${joinedRoom._id}`); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Join Room">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium dark:text-gray-300">Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-character code"
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors uppercase"
            maxLength={6}
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Join Room"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinRoomModal;