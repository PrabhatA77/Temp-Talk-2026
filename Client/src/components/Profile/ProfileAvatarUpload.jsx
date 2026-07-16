import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore.js";
import { updateAvatar } from "../../services/authService.js";

const ProfileAvatarUpload = () => {
  const { user, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be under 5MB");
    }

    setIsUploading(true);
    try {
      const data = await updateAvatar(file);
      updateUser({ avatarUrl: data.user.avatarUrl });
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update photo");
    } finally {
      setIsUploading(false);
    }
  };

  const initial = user?.userName?.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 dark:border-white overflow-hidden flex items-center justify-center text-2xl font-bold dark:text-white">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.userName} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black border-2 border-white dark:border-black hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
          title="Change photo"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatarUpload;