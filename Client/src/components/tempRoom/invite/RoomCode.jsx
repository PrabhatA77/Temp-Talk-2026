import usePersistentRoomStore from "../../../store/persistentRoomStore.js"
import {Copy,Check} from "lucide-react"
import { useState } from "react";


const RoomCode = ({link}) => {

    const {activeRoom} = usePersistentRoomStore();
    const [copied,setCopied] = useState(false);
    
    const roomCodeForTempRoom = link.split("/").pop();
    
    const code = (activeRoom?.roomCode !== undefined ? activeRoom?.roomCode : roomCodeForTempRoom);

        const handleCopy = async ()=>{
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(()=>setCopied(false),2000);
        };

  return (
    <div className="flex flex-col gap-2 ">
        <p className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
            Copy Room Code
        </p>

        {/* link box + copy button */}
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 backdrop-blur-sm bg-white/1 dark:bg-black/1 cursor-pointer">
            <span className="text-xs dark:text-white truncate flex-1">
                {code}
            </span>
            <button
                onClick={handleCopy}
                className="shrink-0 dark:text-white"
            >
                {copied ? 
                    <Check className="w-4 h-4 text-green-500"/>
                    :
                    <Copy className="w-4 h-4"/>    
            }
            </button>
        </div>

        {copied && (
            <p className="text-[10px] text-green-500">Code copied!</p>
        )}
    </div>
  )
}

export default RoomCode