import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";
import { register } from "../../services/authService.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CommunityFeedbackCard from "../../components/Testimonials/CommunityFeedbackCard.jsx";
import { useFeaturedTestimonials } from "../../Hooks/useFeaturedTestimonials.js";

const Register = () => {
  const navigate = useNavigate();

  const { testimonials, loading: testimonialsLoading } = useFeaturedTestimonials(); // NEW
  const hasTestimonials = !testimonialsLoading && testimonials.length > 0; // NEW

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(""); // it can be error message or normal success message

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {clearUser} = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await register({
        userName,
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);
      }

      clearUser();

      navigate(`/verify-email?email=${encodeURIComponent(email)}`);

    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
    <div className="flex-1 flex flex-col justify-center items-center p-10 gap-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-black text-6xl font-bold dark:text-white m-2">
          RELAY
        </div>
        <div className="text-[14px] dark:text-white">
          ---------------- SIMPLE . MINIMAL . TERMINAL ----------------
        </div>
      </div>
      {hasTestimonials && (
          <div className="lg:hidden w-full max-w-md">
            <CommunityFeedbackCard testimonials={testimonials} compact title="What people are saying" />
          </div>
        )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border justify-center items-center p-8 rounded dark:border-white backdrop-blur-sm bg-white/1 dark:bg-black/1"
      >
        <div className="relative w-full m-4">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border w-full rounded py-2 pl-10 pr-4 text-black dark:text-white dark:border-white"
          />
        </div>

        <div className="relative w-full m-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full rounded py-2 pl-10 pr-4 text-black dark:text-white dark:border-white"
          />
        </div>

        <div className="relative w-full m-4">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full rounded py-2 pl-10 pr-10 text-black dark:text-white dark:border-white"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>

    {hasTestimonials && (
        <div className="hidden lg:flex flex-1 items-center justify-center p-10">
          <div className="max-w-md w-full rounded-2xl p-2 backdrop-blur-sm bg-white/1 dark:bg-black/1">
            <CommunityFeedbackCard testimonials={testimonials} title="What Users Are Saying" />
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;
