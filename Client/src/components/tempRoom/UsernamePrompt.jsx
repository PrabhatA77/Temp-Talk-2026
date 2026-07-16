import { useState } from "react"
import {User} from "lucide-react";
import useTempRoomStore from "../../store/tempRoomStore.js";
import { getTempRoomParticipants } from "../../services/tempRoomService.js";
import { handleApiError } from "../../utils/handleApiError.js";

const UsernamePrompt = ({onJoin,roomId}) => {

    const {setUserName} = useTempRoomStore();
    const [input,setInput] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);

    const handleJoin = async () => {
        if(!input.trim()) return setError("Username is required");

        try {
          setLoading(true);
        // check if username is taken in this room before connecting
      const { participants } = await getTempRoomParticipants(roomId);
      if (participants.includes(input.trim())) {
        return setError("Username already taken in this room. Please choose another.");
      }

      // all good — save and connect
      setUserName(input.trim());
      onJoin(input.trim());

    } catch (error) {
      const err = handleApiError(error);
      setError(err.message || "Failed to join. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const handleKeyDown = (e) => {
        if(e.key === "Enter") handleJoin();
    };

  return (
    // overlay — sits on top of the whole page
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-black border dark:border-white rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">

        <div>
          <h2 className="text-xl font-bold dark:text-white">Enter your name</h2>
          <p className="text-sm text-gray-400 mt-1">
            Pick a username to join this room
          </p>
        </div>

        {/* username input */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
            autoFocus
            className="border dark:border-white w-full rounded-lg py-2 pl-10 pr-4 text-sm dark:text-white dark:bg-black focus:outline-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm font-medium"
        >
          {loading ? "Checking" : "Join Room"}
        </button>

      </div>
    </div>
  );
};

export default UsernamePrompt