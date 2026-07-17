import CopyLink from "./invite/CopyLink.jsx"
import ShareButton from "./invite/ShareButton.jsx"
import QRCode from "./invite/QRCode.jsx"
import RoomCode from "./invite/RoomCode.jsx";

const InvitePanel = ({link}) => {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
        Invite People
      </p>

      <RoomCode link={link}/>
      <CopyLink link={link}/>
      <ShareButton link={link}/>
      <QRCode link={link}/>
    </div>
  )
};

export default InvitePanel