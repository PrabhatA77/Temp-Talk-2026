import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// Minimalist, crisp animation parameters fitting the terminal style
const variants = {
  hidden: {
    opacity: 0,
    y: 4,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.02,
      type: "tween",
      duration: 0.15,
    },
  }),
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.1,
    },
  },
};

export default function RotatingText({
  prefix = "",
  words = [],
  className = "",
  holdTime = 2000,
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [phase, setPhase] = useState("typing");

  const currentWord = words[wordIndex] || "";

  // Dynamic max-width buffer allocation prevents surrounding text layout from shifting
  const longest = useMemo(
    () => words.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [words]
  );

  useEffect(() => {
    if (!currentWord) return;

    let id;

    switch (phase) {
      case "typing":
        if (visibleCount < currentWord.length) {
          id = setTimeout(() => {
            setVisibleCount((v) => v + 1);
          }, 60); // Clean terminal cursor stroke pacing
        } else {
          id = setTimeout(() => {
            setPhase("pause");
          }, holdTime);
        }
        break;

      case "pause":
        id = setTimeout(() => {
          setPhase("deleting");
        }, 100);
        break;

      case "deleting":
        if (visibleCount > 0) {
          id = setTimeout(() => {
            setVisibleCount((v) => v - 1);
          }, 30); // Quick erase backspacing
        } else {
          id = setTimeout(() => {
            setWordIndex((i) => (i + 1) % words.length);
            setPhase("typing");
            setVisibleCount(1);
          }, 150);
        }
        break;
    }

    return () => clearTimeout(id);
  }, [phase, visibleCount, currentWord, holdTime, words.length]);

  return (
    <div className={`flex items-center font-mono text-2xl tracking-tight text-black dark:text-white ${className}`}>
      {prefix && <span className="mr-2 text-gray-500 dark:text-zinc-500 select-none">{prefix}</span>}

      <span
        className="relative inline-flex items-center min-h-[1.5em]"
        style={{
          width: `${longest.length}ch`,
        }}
      >
        {/* 💡 FIX: Keep the character collection mapped consistently inside unique word wrapper containers */}
        <AnimatePresence mode="wait">
          <motion.span 
            key={wordIndex} 
            className="inline-flex"
          >
            {currentWord
              .slice(0, visibleCount)
              .split("")
              .map((char, i) => (
                <motion.span
                  key={`${wordIndex}-char-${i}`}
                  custom={i}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="inline-block text-black dark:text-white whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
          </motion.span>
        </AnimatePresence>

        {/* 💡 THEME UPDATE: WhatsApp/Terminal style solid flashing blinking block cursor */}
        <motion.span
          className="ml-0.5 h-[1.1em] w-1.75 bg-black dark:bg-white inline-block self-center align-middle"
          animate={{
            opacity: [1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "steps(2)", // Gives it a crisp hardware console toggle effect instead of a soft fade
          }}
        />
      </span>
    </div>
  );
}