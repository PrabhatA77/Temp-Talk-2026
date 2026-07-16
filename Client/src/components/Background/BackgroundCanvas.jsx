import { useEffect, useRef } from "react";
import Particle from "./Particle";
import Mouse from "./Mouse";

export default function BackgroundCanvas({
  dotGap = 30,
  dotRadius = 2,
  interactionRadius = 120,
  lightColor = "#000000",
  darkColor = "#ffffff",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const mouse = new Mouse();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function getParticleColor() {
      return document.documentElement.classList.contains("dark")
        ? darkColor
        : lightColor;
    }

    function updateParticleColors() {
      const color = getParticleColor();
      particles.forEach((particle) => {
        particle.color = color;
        particle.targetColor = color;

        particle.baseColor = color;
      });
    }

    function createParticles() {
      particles = [];

      const isMobile = window.innerWidth < 768;
      const activeGap = isMobile ? dotGap * 1.5 : dotGap;
      const activeInteractionRadius = isMobile
        ? interactionRadius * 0.7
        : interactionRadius;

      for (let x = activeGap; x < canvas.width; x += activeGap) {
        for (let y = activeGap; y < canvas.height; y += activeGap) {
          particles.push(
            new Particle(
              x,
              y,
              dotRadius,
              activeInteractionRadius,
              getParticleColor(),
            ),
          );
        }
      }
    }

    let resizeTimeout;

    function handleResize() {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
        updateParticleColors();
      }, 200);
    }

    createParticles();
    updateParticleColors();

    const observer = new MutationObserver(() => {
      updateParticleColors();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // The physical shockwave function
    function handlePointerDown(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const shockwaveRadius = 75;
      const shockwaveStrength = 5;

      particles.forEach((particle) => {
        const dx = particle.x - clientX;
        const dy = particle.y - clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < shockwaveRadius) {
          const force = (shockwaveRadius - distance) / shockwaveRadius;
          const angle = Math.atan2(dy, dx);

          particle.vx += Math.cos(angle) * force * shockwaveStrength;
          particle.vy += Math.sin(angle) * force * shockwaveStrength;
        }
      });
    }

    // Consolidated Event Listeners
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown, {
      passive: false,
    });
    window.addEventListener("resize", handleResize);

    // NEW: Track if the canvas is on-screen
    let isVisible = true;

    // NEW: Set up the Intersection Observer
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If it comes back into view, restart the animation loop
            if (!isVisible) {
              isVisible = true;
              animate();
            }
          } else {
            // If it leaves the screen, flag it to stop
            isVisible = false;
          }
        });
      },
      { threshold: 0 }, // 0 means it triggers the moment 1 pixel is off-screen
    );

    // Tell the observer to watch your canvas
    visibilityObserver.observe(canvas);

    let animationFrameId;

    function animate() {

      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = performance.now();

      particles.forEach((particle) => {
        particle.update({
          ctx,
          mouse,
          time,
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      mouse.destroy();
      observer.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, [dotGap, dotRadius, interactionRadius, lightColor, darkColor]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
  );
}
