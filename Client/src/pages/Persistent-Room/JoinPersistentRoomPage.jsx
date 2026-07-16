// src/pages/Persistent-Room/JoinPersistentRoomPage.jsx
import { useState } from "react";
import { useNavigate,useSearchParams  } from "react-router-dom";
import usePersistentRoomStore from "../../store/persistentRoomStore.js";
import { toast } from "react-toastify";

const JoinPersistentRoomPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const joinRoom = usePersistentRoomStore((state) => state.joinRoom);
  const [roomCode, setRoomCode] = useState(searchParams.get("code") || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setLoading(true);
    try {
      const room = await joinRoom(roomCode.trim());
      navigate(`/persistent/${room._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Room not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm border dark:border-white rounded-2xl p-8"
      >
        <h2 className="text-xl font-bold dark:text-white text-center">
          Join Persistent Room
        </h2>

        <input
          type="text"
          placeholder="Room ID"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          maxLength={6}
          required
          className="border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white bg-transparent focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading || !roomCode.trim()}
          className="rounded border-2 px-6 py-2 bg-black text-white border-black dark:bg-white dark:text-black dark:border-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Joining..." : "Join Room"}
        </button>
      </form>
    </div>
  );
};

export default JoinPersistentRoomPage;