import { useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore.js";
import { updateUsername } from "../../services/authService.js";

const UpdateUsernameForm = () => {
  const { user, updateUser } = useAuthStore();
  const [userName, setUserName] = useState(user?.userName || "");
  const [loading, setLoading] = useState(false);

  const isUnchanged = userName.trim() === user?.userName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || isUnchanged) return;

    setLoading(true);
    try {
      const data = await updateUsername(userName.trim());
      updateUser({ userName: data.user.userName });
      toast.success("Username updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-sm font-bold dark:text-white">Username</h3>
      <div className="flex gap-2 backdrop-blur-sm bg-white/1 dark:bg-black/1">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          maxLength={30}
          className="flex-1 border dark:border-white rounded-lg px-3 py-2 text-sm dark:text-white bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || isUnchanged || !userName.trim()}
          className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UpdateUsernameForm;