import { useEffect, useRef, useState } from "react";
import {
  verifyResetOtp,
  sendResetOtp,
} from "../../services/authService.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../utils/handleApiError.js";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const refs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(60);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e, index) => {
    setMessage("");

    const value = e.target.value.replace(/\D/g, "");

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        refs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = [...otp];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    if (pasted.length === 6) {
      refs.current[5]?.blur();
    } else {
      refs.current[pasted.length]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const otpVal = otp.join("");

      await verifyResetOtp({
        email,
        otp:otpVal,
      });

      toast.success("OTP verified successfully");
      
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);

    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setMessage("");

      const data = await sendResetOtp({ email });

      toast.success(data.message);
      setCountdown(60);
    } catch (error) {
      const err = handleApiError(error);
      setMessage(err.message);
    }
  };

  const disabled = otp.some((digit) => digit === "");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 p-10 gap-10 ">

        <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-black text-6xl font-bold dark:text-white m-2">
          RELAY
        </div>
        <div className="text-[14px] dark:text-white">
          ---------------- SIMPLE . MINIMAL . TERMINAL ----------------
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="border rounded-lg p-8 w-full max-w-md flex flex-col items-center dark:border-white backdrop-blur-sm bg-white/1 dark:bg-black/1"
      >
        <h1 className="text-3xl font-bold dark:text-white">
          CONFIRM OTP
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
          Enter the 6-digit verification code sent to
        </p>

        <p className="font-semibold dark:text-white mt-1">
          {email}
        </p>

        {/* OTP Boxes */}
        <div className="flex gap-3 mt-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (refs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoFocus={index === 0}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 rounded border text-center text-xl font-semibold outline-none border-gray-300 dark:border-gray-600 dark:bg-neutral-900 dark:text-white focus:border-black dark:focus:border-white"
            />
          ))}
        </div>

        {/* Error */}
        <div className="h-6 mt-3 text-sm text-red-500 font-medium">
          {message}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={!email || disabled || loading}
          className="w-full mt-2 rounded bg-black text-white dark:bg-white dark:text-black py-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend OTP */}
        <button
          type="button"
          disabled={countdown > 0}
          onClick={handleResendOtp}
          className="mt-5 text-sm text-gray-600 dark:text-gray-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {countdown > 0
            ? `Resend OTP (${countdown}s)`
            : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};
export default VerifyResetOtp