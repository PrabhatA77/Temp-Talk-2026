import { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService.js";
import { Eye, EyeOff } from "lucide-react";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || newPassword.length < 6) return;

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
      <h3 className="text-sm font-bold dark:text-white">Change Password</h3>

      <div className="relative backdrop-blur-sm bg-white/1 dark:bg-black/1">
        <input
          type={showCurrent ? "text" : "password"}
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white bg-transparent focus:outline-none pr-10"
        />
        <button
          type="button"
          onClick={() => setShowCurrent(!showCurrent)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative backdrop-blur-sm bg-white/1 dark:bg-black/1">
        <input
          type={showNew ? "text" : "password"}
          placeholder="New password (min 6 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white bg-transparent focus:outline-none pr-10"
        />
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading || !currentPassword || newPassword.length < 6}
        className="self-start px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;