import { Mail } from "lucide-react"
import { useState } from "react"
import { forgotPassword } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../utils/handleApiError";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const [message, setMessage] = useState(""); // it can be error message or normal success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await forgotPassword({email});

      if(data.success){
        toast.success(data.message);
      }

      navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);

    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10 min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-black text-6xl font-bold dark:text-white m-2">
          RELAY
        </div>
        <div className="text-[14px] dark:text-white">
          ---------------- SIMPLE . MINIMAL . TERMINAL ----------------
        </div>
      </div>
      <form
      onSubmit={handleSubmit}
        className="flex flex-col border justify-center items-center p-8 rounded dark:border-white backdrop-blur-sm bg-white/1 dark:bg-black/1">
          <h1 className="text-3xl font-bold dark:text-white">
          Forgot Password?
        </h1>
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
        {message && (
          <div className="min-h-6 text-sm text-red-500 mt-2 font-bold">
            {message}
          </div>
        )}
        <button
          disabled={loading}
          className="border rounded m-4 px-4 py-2 w-full max-w-md bg-black text-white dark:text-black dark:bg-white cursor-pointer"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword