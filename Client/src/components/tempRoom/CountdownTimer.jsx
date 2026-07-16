import {useEffect,useState} from "react";
import {Timer} from "lucide-react";
import useTempRoomStore from "../../store/tempRoomStore.js";

const CountdownTimer = () => {
    const {room,setExpired} = useTempRoomStore();
    const [timeLeft , setTimeLeft] = useState("");
    const [isAlmostDone,setIsAlmostDone] = useState(false);//true when < 5 mins left

    useEffect(()=>{
        //dont start until room info is loaded from server
        if(!room?.expiresAt) return;

        const interval = setInterval(()=>{
            const now = new Date();
            const expiry = new Date(room.expiresAt);
            const diff = expiry - now;//diff in ms

            //room has expired
            if(diff < 0){
                setTimeLeft("00:00:00");
                setExpired();
                clearInterval(interval);
                return;
            }

            //convert ms to hrs,mins,secs
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
            const seconds = Math.floor((diff % (1000*60)) / 1000);

            //pad with leading zero "5"->"05"
            const pad = (n)=>String(n).padStart(2,"0");
            
            setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

            //warn user when less than 5 minutes remain
            setIsAlmostDone(diff < 5*60*1000);
        },1000);

        //cleanup -> stop the interval when component unmounts
        return ()=>clearInterval(interval);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[room?.expiresAt]); // restarts if expiresAt change

    if(!room?.expiresAt) return null;

    return (
    <div className={`flex items-center gap-2 text-sm font-mono ${isAlmostDone ? "text-red-500" : "dark:text-white text-black"}`}>
        <Timer className="w-4 h-4 dark:text-white"/>
        <span>{timeLeft}</span>

        {/* warning text when almost done */}
        {isAlmostDone && (
            <span className="text-xs text-red-400 animate-pulse">expiring soon</span>
        )}
    </div>
  );
};

export default CountdownTimer