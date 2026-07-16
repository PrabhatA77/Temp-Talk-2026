import UserAvatar from "../common/UserAvatar.jsx";

const ParticipantList = ({participants,currentUserName,hostName}) => {

  return (
    <div className="flex flex-col gap-3">
      {/* heading */}
      <p className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
        Participants ({participants.length})
      </p>

      {/* list */}
      <div className="flex flex-col gap-3">
        {participants.map((name) => (
          <div
            key={name}
            className="flex items-center gap-3
                p-2 rounded-2xl backdrop-blur-sm bg-white/1 dark:bg-black/1 transition-all duration-300"
          >
            <UserAvatar username={name} />

            <div className="flex items-center gap-2">
              <span className="text-sm dark:text-white">{name}</span>

              {/* you badge only shows next to current user */}
              {name === currentUserName && (
                <span className="text-[10px] border rounded px-1 dark:border-white dark:text-white text-gray-500">
                  you
                </span>
              )}

              {/* host badge — shows on creator's name for everyone */}
              {name === hostName && (
                <span className="text-[10px] border border-black dark:border-white rounded px-1 bg-black text-white dark:bg-white dark:text-black">
                  host
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
