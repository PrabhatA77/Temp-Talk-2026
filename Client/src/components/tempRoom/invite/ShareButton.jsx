import { Share2 } from "lucide-react"
import {toast} from "react-toastify";
const ShareButton = ({link}) => {

  //const link = `${window.location.origin}/temp/join/${roomId}`;

  const handleShare = async ()=>{
    if(navigator.share){
      //native share sheet - works on mobile
      await navigator.share({
        title:"Join my TempTalk room",
        text:"Join my temporary chat room before it expires!",
        url:link,
      });
    }
    else{
      //fallback for desktop - just copy the link
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    }
  }

  return (
    <div className="flex flex-col gap-2 ">
      <p className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Share</p>

      <button 
        onClick={handleShare}
        className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm dark:text-white border-none transition-all backdrop-blur-sm bg-white/1 dark:bg-black/1 cursor-pointer"
        >
          <Share2 className="w-4 h-4"/>
          <span>Share Room</span>
        </button>
    </div>
  );
};

export default ShareButton