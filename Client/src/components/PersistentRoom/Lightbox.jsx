import { useState, useEffect, useMemo, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// messages: full room messages array (from Zustand)
// currentImageId: the _id of the message whose image was clicked
// onClose: closes the lightbox
const Lightbox = ({ messages, currentImageId, onClose }) => {
  
  const gallery = useMemo(
  () => (messages || []).filter((m) => m.fileType === "image" && !!m.fileUrl), // CHANGED
  [messages]
);

  const startIndex = useMemo(() => {
    const idx = gallery.findIndex((m) => m._id === currentImageId);
    return idx === -1 ? 0 : idx;
  }, [gallery, currentImageId]);

  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [isDownloading, setIsDownloading] = useState(false);

  // keep activeIndex in sync if the lightbox is reopened on a different image
  const [prevStartIndex, setPrevStartIndex] = useState(startIndex);
  if (startIndex !== prevStartIndex) {
    setPrevStartIndex(startIndex);
    setActiveIndex(startIndex);
  }

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1)); // loop to end
  }, [gallery.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1)); // loop to start
  }, [gallery.length]);

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  // lock background scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (gallery.length === 0) return null;

  const activeImage = gallery[activeIndex];
  const hasMultiple = gallery.length > 1;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(activeImage.fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `relay-image-${activeImage._id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{duration:0.2}}
      className="fixed inset-0 z-50 backdrop-blur-md bg-black/90 text-white flex items-center justify-center"
      onClick={onClose} // click outside the image closes it
    >
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10"
        title="Close"
      >
        <X className="w-7 h-7" />
      </button>

      {/* download button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        disabled={isDownloading}
        className="absolute top-4 right-16 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10 disabled:opacity-50"
        title="Download"
      >
        <Download className="w-6 h-6" />
      </button>

      {/* image counter */}
      {hasMultiple && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-sm text-white/70">
          {activeIndex + 1} / {gallery.length}
        </div>
      )}

      {/* prev arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10"
          title="Previous"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* next arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10"
          title="Next"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* main image — deliberately NO pointer-events-none / user-select-none / draggable=false,
          so mobile long-press still opens the native "Save to Photos" sheet */}
      <motion.img
        key={activeImage._id}
        src={activeImage.fileUrl}
        alt="Full preview"
        initial={{opacity:0,scale:0.95}}
        animate={{opacity:1,scale:1}}
        transition={{duration:0.2}}
        onClick={(e) => e.stopPropagation()} // clicking the image itself shouldn't close the lightbox
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
      />

      {/* sender/time caption */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs text-white/60">
        Shared by {activeImage.userName}
      </div>
    </motion.div>
  );
};

export default Lightbox;