import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A scripted, looping mock of Relay's real chat UI — demonstrates typing
// indicators, presence, and message bubbles without needing a live room.
const SCRIPT = [
  { type: "typing", side: "left" },
  { type: "message", side: "left", text: "just shipped real-time typing indicators 👀" },
  { type: "typing", side: "right" },
  { type: "message", side: "right", text: "no way, let's gooo 🚀" },
  { type: "typing", side: "left" },
  { type: "message", side: "left", text: "online status + kick/block too" },
  { type: "pause" },
];

const STEP_DURATION = 1600;

const LiveChatDemo = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typingSide, setTypingSide] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let idx = 0;

    const tick = () => {
      if (cancelled) return;
      const step = SCRIPT[idx % SCRIPT.length];

      if (step.type === "typing") {
        setTypingSide(step.side);
      } else if (step.type === "message") {
        setTypingSide(null);
        setVisibleCount((c) => c + 1);
      } else if (step.type === "pause") {
        setTypingSide(null);
        setVisibleCount(0);
      }

      idx += 1;
      setTimeout(tick, STEP_DURATION);
    };

    const timer = setTimeout(tick, STEP_DURATION);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const messages = SCRIPT.filter((s) => s.type === "message").slice(0, visibleCount);

  return (
    <div className="w-full max-w-sm mx-auto rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-zinc-900">
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-black dark:bg-white" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-zinc-950" />
        </div>
        <span className="text-sm font-bold">relay-demo</span>
        <span className="ml-auto text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          live
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4 h-56 justify-end">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs ${
                  msg.side === "right"
                    ? "bg-black text-white dark:bg-white dark:text-black rounded-br-none"
                    : "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typingSide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex ${typingSide === "right" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-center gap-1 rounded-2xl px-3 py-2.5 ${
                typingSide === "right" ? "bg-black dark:bg-white rounded-br-none" : "bg-gray-100 dark:bg-zinc-800 rounded-bl-none"
              }`}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    typingSide === "right" ? "bg-white dark:bg-black" : "bg-gray-400 dark:bg-gray-500"
                  }`}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveChatDemo;