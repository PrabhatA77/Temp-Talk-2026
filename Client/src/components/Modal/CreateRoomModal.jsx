import { useState } from "react";
import Modal from "../common/Modal.jsx";
import usePersistentRoomStore from "../../store/persistentRoomStore.js";
import { toast } from "react-toastify";

const CreateRoomModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createRoom = usePersistentRoomStore((state) => state.createRoom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Room name is required");

    setIsLoading(true);
    try {
      await createRoom(name, description);
      toast.success("Room created successfully!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Create New Room">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium dark:text-gray-300">Room Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Study Group"
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium dark:text-gray-300">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this room for?"
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors resize-none h-24"
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
            {isLoading ? "Creating..." : "Create Room"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRoomModal;