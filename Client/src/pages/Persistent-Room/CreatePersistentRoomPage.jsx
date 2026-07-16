// src/pages/Persistent-Room/CreatePersistentRoomPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePersistentRoomStore from "../../store/persistentRoomStore.js";
import { toast } from "react-toastify";

const CreatePersistentRoomPage = () => {
  const navigate = useNavigate();
  const createRoom = usePersistentRoomStore((state) => state.createRoom);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const room = await createRoom(name.trim(), description.trim());
      navigate(`/persistent/${room._id}`); // straight into the chat room
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm border dark:border-white rounded-2xl p-8 backdrop-blur-sm bg-white/1 dark:bg-black/1"
      >
        <h2 className="text-xl font-bold dark:text-white text-center">
          Create Persistent Room
        </h2>

        <input
          type="text"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white bg-transparent focus:outline-none"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white bg-transparent resize-none focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="rounded border-2 px-6 py-2 bg-black text-white border-black dark:bg-white dark:text-black dark:border-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};

export default CreatePersistentRoomPage;