import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useModalStore from "../../store/modalStore.js";
import useAuthStore from "../../store/authStore.js";
import { deleteAccount } from "../../services/authService.js";
import { Eye, EyeOff } from "lucide-react";

const DeleteAccountSection = () => {
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);
  const setConfirmAction = useModalStore((state) => state.setConfirmAction);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleDeleteClick = () => {
    if (!password) {
      toast.error("Please enter your password to confirm");
      return;
    }

    setConfirmAction({
      title: "Delete Account",
      message:
        "This permanently deletes your account and removes you from every room. This cannot be undone.",
      confirmLabel: "Delete My Account",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteAccount(password);
          clearUser();
          toast.success("Account deleted");
          navigate("/");
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to delete account",
          );
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-3 border border-red-300 dark:border-red-900 rounded-xl p-4 backdrop-blur-sm bg-red/1 dark:bg-red-950/1 ">
      <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Deleting your account is permanent. You'll be removed from all rooms
        you're in.
      </p>

      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password to confirm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white bg-transparent focus:outline-none pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      <button
        onClick={handleDeleteClick}
        className="self-start px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
      >
        Delete Account
      </button>
    </div>
  );
};

export default DeleteAccountSection;
