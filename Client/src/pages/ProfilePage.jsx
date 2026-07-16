import useAuthStore from "../store/authStore.js";
import ProfileAvatarUpload from "../components/Profile/ProfileAvatarUpload.jsx";
import UpdateUsernameForm from "../components/Profile/UpdateUsernameForm.jsx";
import ChangePasswordForm from "../components/Profile/ChangePasswordForm.jsx";
import DeleteAccountSection from "../components/Profile/DeleteAccountSection.jsx";
import ConfirmActionModal from "../components/common/ConfirmActionModal.jsx";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" })
    : null;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <ProfileAvatarUpload />
          <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email}</p>
          {memberSince && (
            <p className="text-[11px] text-gray-400 dark:text-gray-600">Member since {memberSince}</p>
          )}
        </div>

        <div className="border-t dark:border-gray-800" />

        <UpdateUsernameForm />

        <div className="border-t dark:border-gray-800" />

        <ChangePasswordForm />

        <div className="border-t dark:border-gray-800" />

        <DeleteAccountSection />
      </div>

      <ConfirmActionModal/>
    </div>
  );
};

export default ProfilePage;