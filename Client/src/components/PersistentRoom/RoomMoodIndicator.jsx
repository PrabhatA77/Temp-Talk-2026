const RoomMoodIndicator = ({ mood }) => {
  if (!mood?.label) return null;

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 text-xs"
      title={mood.description}
    >
      <span className="text-sm leading-none">{mood.emoji}</span>
      <span className="font-medium text-gray-600 dark:text-gray-300">{mood.label}</span>
    </div>
  );
};

export default RoomMoodIndicator;