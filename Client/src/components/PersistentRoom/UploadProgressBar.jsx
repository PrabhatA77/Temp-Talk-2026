const UploadProgressBar = ({ progress = 0 }) => {
  return (
    <div className="flex flex-col gap-1 px-1">
      <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500">
        Uploading... {progress}%
      </p>
    </div>
  );
};

export default UploadProgressBar;