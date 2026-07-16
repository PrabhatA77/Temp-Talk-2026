const UserAvatar = ({ username, avatarUrl, size = "md" }) => {
  const initial = username?.charAt(0).toUpperCase() || "?";

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  }[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        referrerPolicy="no-referrer"
        className="w-8 h-8 rounded-full border dark:border-white object-cover shrink-0"
      />
    );
  }

  return (
    <div className={`${sizeClasses} shrink-0 flex items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black font-bold`}>
      {initial}
    </div>
  );
};

export default UserAvatar;
