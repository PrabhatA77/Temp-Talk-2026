import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  Zap, ShieldCheck, Image as ImageIcon, Users, Server, Database, Code,
  Smartphone, Globe, MessageSquare, Lock, Sparkles, Mail,ChevronDown,
} from "lucide-react";
import LiveChatDemo from "../components/About/LiveChatDemo.jsx";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const AboutPage = () => {
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleHeroMouseMove = (e) => {
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color), transparent 80%)`;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [expandedFeature, setExpandedFeature] = useState(null);
  const [activeTech, setActiveTech] = useState(null);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Real-Time WebSocket Engine",
      description: "Instantly syncs messages, active typing indicators, and live online/offline presence using an optimized ws-based event architecture.",
      detail: "Presence is tracked via an in-memory Map of live socket connections per room. Typing events are debounced client-side and auto-expire after 2 seconds if a stopTyping signal is ever missed.",
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-blue-500" />,
      title: "Advanced Media Lifecycles",
      description: "Multer-buffered memory streams pipe directly to Cloudinary. Hard-deletes are automatically triggered when accounts or rooms are destroyed.",
      detail: "Files never touch disk — they're uploaded as in-memory buffers straight to Cloudinary via streamifier. Deleting a message, room, or account triggers a matching Cloudinary cleanup, so nothing is orphaned.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
      title: "Granular Admin Controls",
      description: "Room hosts can seamlessly promote members, instantly kick disruptors (force-closing their sockets), and maintain global blocklists.",
      detail: "Promote, kick, and block are each backed by a REST endpoint plus a live WebSocket broadcast — a kicked user's socket is force-closed the instant it fires, no refresh required.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: "Expressive Interactions",
      description: "Features a full emoji picker, an image lightbox gallery, and animated message edit/delete states.",
      detail: "The lightbox supports full keyboard navigation (arrow keys, Escape) and looping between images. Message edits and deletes animate through Framer Motion spring transitions rather than snapping instantly.",
    },
    {
      icon: <Lock className="w-6 h-6 text-red-500" />,
      title: "Secure Authentication",
      description: "Hardened by HTTP-only JWT cookies, encrypted bcrypt passwords, and robust Resend-powered OTP flows for email verification and account recovery.",
      detail: "Supports both password (bcrypt + email OTP) and Google Sign-In, verified server-side via google-auth-library — both paths converge on the same signed, httpOnly JWT cookie.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-teal-500" />,
      title: "Fluid Framer UI",
      description: "Built with a mobile-first philosophy using Tailwind CSS. Modals spring into view, grids stagger gracefully, and themes switch instantly.",
      detail: "Page transitions run through AnimatePresence with mode='wait', and dashboard grids stagger their children on mount for a sequential, polished reveal instead of popping in all at once.",
    },
  ];

  const stack = [
    { name: "React 19", icon: <Code className="w-5 h-5" />, why: "Concurrent rendering and hooks made the real-time UI state manageable at scale." },
    { name: "Node.js", icon: <Server className="w-5 h-5" />, why: "Same language on both ends, and native WebSocket support without extra tooling." },
    { name: "Express", icon: <Server className="w-5 h-5" />, why: "Minimal and unopinionated — easy to bolt a raw ws server onto the same HTTP server." },
    { name: "MongoDB", icon: <Database className="w-5 h-5" />, why: "Flexible schema fit fast-moving features like reactions and file attachments well." },
    { name: "WebSockets", icon: <Zap className="w-5 h-5" />, why: "Chose native ws over Socket.io for a lighter footprint and full control over the protocol." },
    { name: "Tailwind CSS", icon: <ImageIcon className="w-5 h-5" />, why: "Fast dark-mode support and consistent spacing without writing separate stylesheets." },
    { name: "Framer Motion", icon: <Sparkles className="w-5 h-5" />, why: "Spring-based transitions feel far more natural than CSS keyframes for chat UI." },
    { name: "Zustand", icon: <Database className="w-5 h-5" />, why: "Lighter than Redux for a project this size, with zero boilerplate for real-time state." },
  ];

  const toggleFeature = (idx) => setExpandedFeature((prev) => (prev === idx ? null : idx));
  const toggleTech = (idx) => setActiveTech((prev) => (prev === idx ? null : idx));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden pt-10 pb-20 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-black dark:bg-white origin-left z-50"
      />

      {/* 1. HERO SECTION — with mouse-spotlight */}
      <div
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative [--spotlight-color:rgba(0,0,0,0.06)] dark:[--spotlight-color:rgba(255,255,255,0.08)]"
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlightBg }}
        />

        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative max-w-4xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-6"
        >
          <motion.div
            variants={fadeInUp}
            className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center rotate-3 shadow-2xl"
          >
            <MessageSquare className="w-10 h-10" />
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Designed for{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-500 to-black dark:from-gray-400 dark:to-white">
              Connection.
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mt-4 leading-relaxed">
            Relay is a high-performance, full-stack communication platform engineered to deliver instant messaging with uncompromising speed, rich media support, and robust administrative security.
          </motion.p>

          {/* interactive badge strip */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mt-2">
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Real-Time" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "Secure Auth" },
              { icon: <Users className="w-3.5 h-3.5" />, label: "Solo Built" },
            ].map((badge, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-gray-300"
              >
                {badge.icon}
                {badge.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            animate={{ y: [0, 6, 0] }}
            transition={{ y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
            className="mt-4 text-gray-300 dark:text-gray-700"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.section>
      </div>

      <div className="w-full h-px bg-linear-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent my-20 max-w-6xl mx-auto" />

      {/* 2. LIVE DEMO */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
          <p className="text-gray-500 dark:text-gray-400">A live mock of Relay's own chat interface.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <LiveChatDemo />
        </motion.div>
      </section>

      {/* 3. FEATURES GRID — now expandable */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Under the Hood</h2>
          <p className="text-gray-500 dark:text-gray-400">The architecture powering the Relay experience. Click a card for detail.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => {
            const isOpen = expandedFeature === idx;
            return (
              <motion.button
                key={idx}
                variants={fadeInUp}
                onClick={() => toggleFeature(idx)}
                className="text-left p-6 rounded-3xl border border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/20 hover:bg-gray-100 dark:hover:bg-zinc-900/50 transition-colors duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-gray-300 dark:text-gray-700 mt-2">
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800">
                        {feature.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* 4. TECH STACK — now interactive */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-2xl font-bold mb-2"
        >
          The Technology Stack
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-sm text-gray-400 dark:text-gray-500 mb-8"
        >
          Tap a pill to see why it was chosen.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-4"
        >
          {stack.map((item, idx) => (
            <motion.button
              key={idx}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              onClick={() => toggleTech(idx)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-sm text-sm font-medium cursor-pointer transition-colors ${
                activeTech === idx
                  ? "border-black dark:border-white bg-black text-white dark:bg-white dark:text-black"
                  : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              }`}
            >
              <span className={activeTech === idx ? "" : "text-gray-500 dark:text-gray-400"}>{item.icon}</span>
              {item.name}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTech !== null && (
            <motion.div
              key={activeTech}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 max-w-md mx-auto text-sm text-gray-500 dark:text-gray-400 italic"
            >
              "{stack[activeTech].why}"
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 5. MEET THE DEVELOPER */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-3xl mx-auto px-6 mt-32"
      >
        <div className="p-8 md:p-12 rounded-3xl bg-black text-white dark:bg-white dark:text-black flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
          <div className="z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">The Developer</h2>
            <p className="text-gray-400 dark:text-gray-600 mb-6 text-sm">
              Currently pursuing a B.Tech in Computer Science, building Relay as a capstone exploration into real-time distributed systems, modern React architectures, and advanced full-stack engineering principles.
            </p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <a
                href="https://github.com/PrabhatA77"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-900 text-white dark:bg-gray-100 dark:text-black hover:scale-110 transition-transform"
                title="GitHub"
              >
                <Globe className="w-5 h-5" />
              </a>

              <a
                href="https://www.linkedin.com/in/prabhat-rathore-626944303/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-900 text-white dark:bg-gray-100 dark:text-black hover:scale-110 transition-transform"
                title="LinkedIn"
              >
                <Globe className="w-5 h-5" />
              </a>

              <a
                href="testops177@gmail.com"
                className="p-2 rounded-full bg-zinc-900 text-white dark:bg-gray-100 dark:text-black hover:scale-110 transition-transform"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="w-32 h-32 rounded-full bg-zinc-900 dark:bg-gray-100 flex items-center justify-center shrink-0 z-10 border-4 border-black dark:border-white shadow-2xl">
            <Code className="w-12 h-12 text-white dark:text-black" />
          </div>

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-900/50 dark:bg-gray-200/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zinc-900/50 dark:bg-gray-200/50 rounded-full blur-3xl pointer-events-none" />
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;