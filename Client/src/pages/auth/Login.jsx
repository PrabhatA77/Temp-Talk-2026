import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../services/authService.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore.js";
import { GoogleLogin } from "@react-oauth/google";
import CommunityFeedbackCard from "../../components/Testimonials/CommunityFeedbackCard.jsx";
import { useFeaturedTestimonials } from "../../Hooks/useFeaturedTestimonials.js";

const Login = () => {
  const navigate = useNavigate();

  const setUSer = useAuthStore((state) => state.setUser);

  const { testimonials, loading: testimonialsLoading } =
    useFeaturedTestimonials(); // NEW
  const hasTestimonials = !testimonialsLoading && testimonials.length > 0;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(""); // it can be error message or normal success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({
        identifier,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        setUSer(data.user);
      }

      navigate("/");
    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage("");
    setLoading(true);
    try {
      const data = await googleLogin(credentialResponse.credential);
      if (data.success) {
        toast.success(data.message);
        setUSer(data.user);
      }
      navigate("/");
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

        {hasTestimonials && ( // NEW — mobile-only compact block
          <div className="lg:hidden w-full max-w-md">
            <CommunityFeedbackCard
              testimonials={testimonials}
              compact
              title="What people are saying"
            />
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
              placeholder="Username/Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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

          <div className="w-full flex justify-start mt-1">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline"
            >
              Forgot Password?
            </Link>
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
            {loading ? "Login..." : "Login"}
          </button>

          <div className="flex items-center gap-3 w-full max-w-md my-2">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          </div>

          <div className="w-full max-w-md flex justify-center rounded-2xl ">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setMessage("Google Sign-In failed. Please try again.")
              }
              theme="outline"
              width="384"
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black dark:text-white hover:underline"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>

      {hasTestimonials && (
        <div className="hidden lg:flex flex-1 items-center justify-center p-10  border-gray-200 dark:border-white ">
          <div className="max-w-md w-full rounded-2xl p-2 backdrop-blur-sm bg-white/1 dark:bg-black/1">
            <CommunityFeedbackCard testimonials={testimonials} title="Community Feedback" />
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
