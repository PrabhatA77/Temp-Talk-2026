import { useState } from "react";
import DurationPicker from "../../components/common/DurationPicker.jsx";
import useTempRoomStore from "../../store/tempRoomStore";
import { User, Tag, Users,ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createTempRoom } from "../../services/tempRoomService.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { toast } from "react-toastify";

const CreateTempRoomPage = () => {
  const navigate = useNavigate();

  const { userName, setUserName } = useTempRoomStore();

  const [duration, setDuration] = useState(30);
  const [topic, setTopic] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); //error message

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!userName.trim()) return setMessage("UserName is required");
    if (!duration || duration === 0)
      return setMessage("please select a duration");

    try {
      setLoading(true);

      const res = await createTempRoom({
        duration,
        topic: topic || "General Chat",
        maxParticipants: maxParticipants ? Number(maxParticipants) : 10,
        creatorName:userName.trim(),
      });

      if (res.success) {
        toast.success(res.message);
      }

      navigate(`/temp/${res.roomId}`);
    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10  min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-black text-6xl font-bold dark:text-white m-2">
          RELAY
        </div>
        <div className="text-[13px] text-gray-400 dark:text-gray-500 tracking-widest">
          ---------------- SIMPLE . MINIMAL . TERMINAL ----------------
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col border justify-center items-center p-8 rounded dark:border-white backdrop-blur-sm bg-white/1 dark:bg-black/1"
      >
        <div className="flex justify-between w-full">
          <button type="button" onClick={()=>navigate(-1)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          {/* heading */}
          <div className="font-extrabold text-3xl dark:text-white">
            CREATE ROOM
          </div>
          <div></div>
        </div>

        <div className="relative w-full m-4">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-black dark:text-white dark:bg-black placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        <DurationPicker value={duration} onChange={setDuration} />

        <div className="relative w-full m-4">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-black dark:text-white dark:bg-black placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        <div className="relative w-full m-4">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type="number"
            placeholder="Max Participants"
            min={1}
            max={10}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-black dark:text-white dark:bg-black placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        {message && (
          <div className="min-h-6 text-sm text-red-500 mt-2 font-bold">
            {message}
          </div>
        )}

        <button
          disabled={loading}
          className="mt-2 w-full py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};

export default CreateTempRoomPage;
