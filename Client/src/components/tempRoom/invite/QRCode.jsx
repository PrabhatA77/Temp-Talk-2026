import {QRCodeSVG} from "qrcode.react";

const QRCode = ({link}) => {

  //const link = `${window.location.origin}/temp/join/${roomId}`;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
        Scan QR Code
      </p>

      {/* QR Code*/}
      <div className="flex justify-center p-3 dark:border-white rounded-lg">
        <QRCodeSVG
          value={link}
          size={140}
          bgColor="transparent"
          fgColor="currentColor"
          className="dark:text-white"
        />
      </div>

      <p className="text-[10px] text-gray-400 text-center">
        Scan to join this room
      </p>
    </div>
  );
};

export default QRCode