import { useState } from "react";

const DurationPicker = ({ value, onChange }) => {
  const CHIPS = [
    { label: "15 min", value: 15 },
    { label: "30 min", value: 30 },
    { label: "1 hr", value: 60 },
    { label: "6 hr", value: 360 },
    { label: "24 hr", value: 1440 },
    { label: "Custom", value: "custom" },
  ];

  const [isCustom, setIsCustom] = useState(false);
  const [customHrs, setCustomHrs] = useState(0);
  const [customMins, setCustomMins] = useState(0);

  const handleChip = (val) => {
    if (val === "custom") {
      setIsCustom(true);
      onChange(customHrs * 60 + customMins);
    } else {
      setIsCustom(false);
      onChange(val);
    }
  };

  const handleCustomChange = (hrs, mins) => {
    const total = hrs * 60 + mins;
    onChange(total);
  };

  const formatDuration = (mins) => {
    if (!mins) return "0 minutes";
    if (mins < 60) return `${mins} minutes`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (m === 0) return `${h} ${h === 1 ? "hour" : "hours"}`;
    return `${h}h ${m}min`;
  };

  return (
    <div>
      <label>
        Duration <span>*</span>
      </label>

      {/* chips */}
      <div className="flex flex-wrap gap-2 mt-2">
        {CHIPS.map((chip) => {
          const isActive =
            chip.value === "custom"
              ? isCustom
              : value === chip.value && !isCustom;

          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => handleChip(chip.value)}
              className={`px-4 py-1.5 rounded-lg text-sm border transition-all
                ${
                  isActive
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                    : "bg-transparent border-gray-300 text-gray-600 dark:text-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white"
                }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* custom input only shows is custom chip is selected */}
      {isCustom && (
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2 dark:text-white">
            <input
              type="number"
              min={0}
              max={23}
              value={customHrs}
              onChange={(e) => {
                const hrs = Number(e.target.value);
                setCustomHrs(hrs);
                handleCustomChange(hrs, customMins);
              }}
              className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black dark:focus:border-white"
            />
            <span className="text-sm text-gray-500">hr</span>
          </div>
          <div className="flex items-center gap-2 dark:text-white">
            <input
              type="number"
              min={0}
              max={59}
              value={customMins}
              onChange={(e) => {
                const mins = Number(e.target.value);
                setCustomMins(mins);
                handleCustomChange(customHrs, mins);
              }}
              className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">min</span>
          </div>
        </div>
      )}
      {/* summary line */}
      {value > 0 && (
        <p className="text-sm text-gray-400 mt-2">
          Room will expire in{" "}
          <span className="text-black dark:text-white font-medium">{formatDuration(value)}</span>
        </p>
      )}
    </div>
  );
};

export default DurationPicker;
