// typingUsers: [{ userId, userName }] — excludes the current user by construction
// (the backend never echoes your own typing event back to you)
const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0].userName} is typing...`
      : typingUsers.length === 2
      ? `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`
      : `${typingUsers[0].userName} and ${typingUsers.length - 1} others are typing...`;

  return (
    <div className="px-4 pb-1">
      <p className="text-[11px] text-gray-400 dark:text-gray-500 italic animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default TypingIndicator;