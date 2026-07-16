import { useNavigate } from "react-router-dom"; // NEW

const LandingFooter = () => {
  const navigate = useNavigate(); // NEW

  return (
    <div className="flex flex-col gap-4 lg:flex-row justify-around border-gray-200 p-4 items-center backdrop-blur-sm bg-white/1 dark:bg-black/1">
      <div className="text-3xl font-bold dark:text-white">RELAY</div>
      <div className="flex gap-4">
        <div
          onClick={() => navigate("/terms")}
          className="text-gray-600 dark:text-gray-200 text-[12px] cursor-pointer hover:text-black dark:hover:text-white transition-colors"
        >
          TERMS OF SERVICE
        </div>
        <div
          onClick={() => navigate("/legal-info")}
          className="text-gray-600 dark:text-gray-200 text-[12px] cursor-pointer hover:text-black dark:hover:text-white transition-colors"
        >
          PRIVACY POLICY
        </div>
        <div className="text-gray-600 dark:text-gray-200 text-[12px]">TWITTER</div>
        <div className="text-gray-600 dark:text-gray-200 text-[12px]">GITHUB</div>
      </div>
      <div className="flex text-gray-600 dark:text-gray-200 text-[12px]">&copy; 2026 RELAY CHAT. ALL RIGHTS RESERVED.</div>
    </div>
  );
};

export default LandingFooter;