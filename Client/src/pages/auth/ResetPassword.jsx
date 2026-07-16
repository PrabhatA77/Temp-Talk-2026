import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/authService";
import { handleApiError } from "../../utils/handleApiError";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email) {
      navigate("/forgot-password");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword({
        email,
        password,
      });

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-10  px-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-black text-6xl font-bold dark:text-white">
          RELAY
        </div>

        <div className="text-sm dark:text-white text-center">
          ---------------- SIMPLE . MINIMAL . TERMINAL ----------------
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border dark:border-white rounded-lg p-8 w-full max-w-md flex flex-col items-center backdrop-blur-sm bg-white/1 dark:bg-black/1"
      >
        <h1 className="text-3xl font-bold dark:text-white">
          Reset Password
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-6">
          Enter your new password.
        </p>

        {/* Password */}
        <div className="relative w-full mb-4">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full rounded py-2 pl-10 pr-10 dark:bg-black dark:text-white dark:border-white outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative w-full">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border w-full rounded py-2 pl-10 pr-10 dark:bg-black dark:text-white dark:border-white outline-none"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Error */}
        <div className="h-6 mt-4 text-red-500 text-sm font-medium">
          {message}
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            !password ||
            !confirmPassword
          }
          className="w-full rounded bg-black text-white dark:bg-white dark:text-black py-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;