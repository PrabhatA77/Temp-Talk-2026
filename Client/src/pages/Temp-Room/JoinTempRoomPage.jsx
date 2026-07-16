import { useState } from "react";
import useTempRoomStore from "../../store/tempRoomStore";
import { User,House ,ArrowLeft} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { joinTempRoom,getTempRoomParticipants } from "../../services/tempRoomService";
import { toast } from "react-toastify";
import { handleApiError } from "../../utils/handleApiError";

const JoinTempRoomPage = () => {
  const navigate = useNavigate();
  const {roomId:urlRoomId} = useParams();

  const {setUserName} = useTempRoomStore();
  const [roomId,setRoomId] = useState(urlRoomId || "");

  const [usernameInput,setUsernameInput] = useState("");

  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");//error message

  async function handleSubmit(e){
    e.preventDefault();
    setMessage("");

    if (!usernameInput.trim()) return setMessage("Username is required");
    if (!roomId.trim()) return setMessage("Room ID is required");

    try {
      setLoading(true);

      const res = await joinTempRoom({roomId});

      const {participants} = await getTempRoomParticipants(roomId);
      if(participants.includes(usernameInput.trim())){
        return setMessage("Username already taken in this room. Please choose another.")
      }

      if(res.success){
        toast.success(res.message);
      }
      
      setUserName(usernameInput.trim());
      navigate(`/temp/${roomId.trim()}`);
      
    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10  min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-black text-6xl font-bold dark:text-white m-2">
          RELAY
        </div>
        <div className="text-[14px] dark:text-white">
          ---------------- SIMPLE . MINIMAL . TERMINAL ----------------
        </div>
      </div>

      <form onSubmit={handleSubmit}
        className="flex flex-col border justify-center items-center p-8 rounded dark:border-white backdrop-blur-sm bg-white/1 dark:bg-black/1"
      >
        {/* heading */}
        <div className="flex justify-between w-full">
          <button type="button" onClick={()=>navigate(-1)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          {/* heading */}
          <div className="font-extrabold text-3xl dark:text-white">
            JOIN ROOM
          </div>
          <div></div>
        </div>

        <div className="relative w-full m-4">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="border w-full rounded py-2 pl-10 pr-4 text-black dark:text-white dark:border-white"
          />
        </div>
        
        <div className="relative w-full m-4">
          <House className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => !urlRoomId && setRoomId(e.target.value)}
            readOnly={!!urlRoomId}
            className={`border w-full rounded py-2 pl-10 pr-4 text-black dark:text-white dark:border-white ${urlRoomId? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>


        {message && (
          <div className="min-h-6 text-sm text-red-500 mt-2 font-bold">
            {message}
          </div>
        )}

        <button
          disabled={loading}
          className="border rounded m-4 px-4 py-2 w-full max-w-md bg-black text-white dark:text-black dark:bg-white cursor-pointer"
        >
          {loading ? "Joining..." : "Join Room"}
        </button>
      </form>
    </div>
  )
}

export default JoinTempRoomPage