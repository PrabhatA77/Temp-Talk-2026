import LandingFooter from "../components/LandingFooter.jsx"
import LandingMiddle from "../components/LandingMiddle.jsx"
import Navbar from "../components/Navbar.jsx"
import useModalStore from "../store/modalStore.js"
import TempRoomModal from "../components/Modal/TempRoomModal.jsx"
import PersistentRoomModal from "../components/Modal/PersistentRoomModal.jsx";
import { motion } from "framer-motion"

const LandingPage = () => {

  const {showModal,setShowModal, showPersistentModal, setShowPersistentModal} = useModalStore();

  //const anyModalOpen = showModal || showPersistentModal;

  return (
    <>
      {/* Blur only the page */}
      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        transition={{duration:0.3}}
       className={`flex flex-col min-h-screen transition-all duration-300 ${
          showModal ? "blur-sm" : ""
        }`}
      >
        <Navbar />
        <LandingMiddle />
        <LandingFooter />
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="transition-all duration-300 fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <TempRoomModal onclose={() => setShowModal(false)} />
        </div>
      )}

      {showPersistentModal && (
        <div
          className="transition-all duration-300 fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowPersistentModal(false)}
        >
          <PersistentRoomModal onclose={() => setShowPersistentModal(false)} />
        </div>
      )}
    </>
  )
}

export default LandingPage