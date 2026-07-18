import DecoCard from "./DecoCard";
import { Lock, Clock } from "lucide-react";
import useModalStore from "../store/modalStore.js";
import useAuthStore from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RotatingText from "./common/RotatingText.jsx";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 150ms delay between each section appearing
      delayChildren: 0.1, // Wait 100ms before starting
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const LandingMiddle = () => {
  const setShowModal = useModalStore((state) => state.setShowModal);
  const setShowPersistentModal = useModalStore(
    (state) => state.setShowPersistentModal,
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handlePersistentClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowPersistentModal(true);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-10 justify-center items-center grow w-full px-4 text-center"
    >
      <div className="flex flex-col gap-30 justify-center items-center grow w-full px-4 text-center">
        <motion.div
          variants={fadeUp}
          className="flex flex-col justify-center items-center gap-6"
        >
          <div className="text-xl font-bold dark:text-white">
            <RotatingText
              className="text-3xl sm:text-5xl md:text-6xl font-black"
              prefix="Conversations"
              words={[
                "Reimagined..",
                "Effortless..",
                "Connected...",
                "Seamless....",
                "Meaningful..",
                "Borderless..",
                "Responsive..",
                "Personalized",
                "Redefined...",
              ]}
            />
          </div>
          <div className="dark:text-white">
            Create temporary rooms for quick conversations or permanent spaces
            that grow with your community.
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex gap-4 flex-col sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.95 }}
            className="transition-all rounded border-2 px-10 py-2 bg-black text-white border-black hover:text-gray-200 cursor-pointer dark:bg-white dark:text-black dark:border-white dark:hover:text-black dark:hover:bg-gray-100"
            onClick={() => setShowModal(true)}
          >
            Create / Join <span className="font-extrabold">Temp Room</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePersistentClick}
            className="transition-all rounded border-2 px-10 py-2 hover:bg-gray-200 cursor-pointer bg-gray-50 dark:text-white dark:hover:text-gray-200 dark:bg-black dark:hover:bg-black "
          >
            Create / Join{" "}
            <span className="font-extrabold">Persistent Room</span>
          </motion.button>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="w-full">
        <div className="flex flex-col sm:flex-row backdrop-blur-sm bg-white/1 dark:bg-black/1">
          <DecoCard
            icon={Clock}
            heading="Temp Room"
            subHeading="INSTANT . NO TRACE"
            point1="Generates a secure, one-time link instantly."
            point2="No account registration required."
            point3="History is wiped permanently upon exit."
          />
          <DecoCard
            icon={Lock}
            heading="Persistent Room"
            subHeading="SECURE . LOGGED"
            point1="Dedicated space bound to your authenticated account."
            point2="Messages are securely transmitted and retained."
            point3="Manage access control and participants."
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LandingMiddle;
