import {
  Moon,
  Sun,
  UserCircle,
  MessagesSquare,
  Info,
  LogOut,
  MessageSquareDashed,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { logout } from "../services/authService.js";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import FeedbackModal from "./common/FeedbackModal.jsx";
import SubmitTestimonialModal from "./Testimonials/SubmitTestimonialModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearUser } = useAuthStore();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);

  // close dropdown when clicking outside — same pattern as RoomOptionsMenu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIsDark(isDark);
  };

  const handleSubmit = () => navigate("/register");
  const goToLandingPage = () => navigate("/");
  const goToLogin = () => navigate("/login");
  const goToRoomsDashBoard = () => navigate("/rooms");
  const goToAbout = () => navigate("/about");

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  const handleDropdownRooms = () => {
    setDropdownOpen(false);
    navigate("/rooms");
  };

  const handleDropdownAbout = () => {
    setDropdownOpen(false);
    navigate("/about");
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await logout();
    } catch (err) {
      // even if the server call fails, clear the local session so the UI doesn't get stuck
      console.error("Logout request failed:", err.message);
    } finally {
      clearUser(); // updates authStore -> Navbar re-renders instantly, no refresh needed
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  // monogram fallback until real avatar photos exist
  const initial = user?.userName?.charAt(0).toUpperCase() || "?";

  return (
    <>
      <div className="transition-all border-b border-gray-200 dark:border-gray-800 h-16 w-full flex justify-around items-center px-4 py-2 backdrop-blur-sm bg-white/1 dark:bg-black/1 z-999">
        <div>
          <button
            className="transition-all font-bold text-3xl cursor-pointer dark:text-white hover:drop-shadow-glow-black dark:hover:drop-shadow-glow-white"
            onClick={goToLandingPage}
          >
            RELAY
          </button>
        </div>

        <div className="hidden gap-12 lg:flex">
          <button
            onClick={goToRoomsDashBoard}
            className="transition-all hover:text-gray-600 cursor-pointer dark:text-white dark:hover:text-gray-200 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            Rooms
          </button>
          <button
            onClick={goToAbout}
            className="transition-all hover:text-gray-600 cursor-pointer dark:text-white dark:hover:text-gray-200 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            About
          </button>
        </div>

        <div className="transition-all flex gap-4 justify-center items-center">
          <button
            className="transition-all dark:text-white"
            onClick={toggleTheme}
          >
            {!isDark ? (
              <Moon className="cursor-pointer w-5 h-5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800" />
            ) : (
              <Sun className="cursor-pointer w-5 h-5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative z-50" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full border dark:border-white flex items-center justify-center text-sm font-bold dark:text-white overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                title={user?.userName}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.userName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initial
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-11 bg-white dark:bg-black border dark:border-white rounded-lg shadow-lg w-48 overflow-hidden animate-fade-in z-999">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold dark:text-white truncate">
                      {user?.userName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={goToProfile}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
                  >
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </button>

                  <button
                    onClick={handleDropdownRooms}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
                  >
                    <MessagesSquare className="w-4 h-4" />
                    Rooms
                  </button>

                  <button
                    onClick={handleDropdownAbout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                    About
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsFeedbackOpen(true); // Open the modal
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    <MessageSquareDashed className="w-4 h-4" />
                    Send Feedback
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsTestimonialOpen(true);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    <Star className="w-4 h-4" />
                    Rate Relay
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all cursor-pointer border-t border-gray-100 dark:border-gray-800"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                className="transition-all p-1 cursor-pointer hover:text-gray-600 dark:text-white dark:hover:text-gray-200"
                onClick={goToLogin}
              >
                Login
              </button>
              <button
                className="transition-all text-white border bg-black px-2 py-1 rounded cursor-pointer hover:text-gray-200 dark:text-black dark:hover:text-gray-600 dark:bg-white"
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <SubmitTestimonialModal isOpen={isTestimonialOpen} onClose={() => setIsTestimonialOpen(false)} />
        
    </>
  );
};

export default Navbar;
