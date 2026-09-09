import React, { useEffect, useRef, useState } from "react";

export interface RobotSequenceProps {
  totalFrames?: number;
  frameInterval?: number; // ms per frame
  className?: string;
  maxHeight?: string;
}

export const RobotSequence: React.FC<RobotSequenceProps> = ({
  totalFrames = 40,
  frameInterval = 80,
  className = "",
  maxHeight = "400px",
}) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef(true);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const paddedIndex = String(i).padStart(3, "0");
      const img = new Image();
      img.src = `/robot-frames/frame-${paddedIndex}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= Math.min(8, totalFrames)) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
  }, [totalFrames]);

  // IntersectionObserver to pause when out of viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Frame animation loop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let lastTime = performance.now();
    let frameId: number;

    const loop = (now: number) => {
      if (isVisibleRef.current) {
        const delta = now - lastTime;
        if (delta >= frameInterval) {
          setCurrentFrame((prev) => (prev >= totalFrames ? 1 : prev + 1));
          lastTime = now - (delta % frameInterval);
        }
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [frameInterval, totalFrames]);

  const currentPadded = String(currentFrame).padStart(3, "0");

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none overflow-visible ${className}`}
      style={{ minHeight: "280px", maxHeight }}
    >
      {/* Subtle depth glow behind the robot */}
      <div className="pointer-events-none absolute inset-4 bg-gradient-to-tr from-accent/10 via-transparent to-accent-dark/5 rounded-full blur-2xl opacity-70" />

      {/* Floating accent particles */}
      <div className="pointer-events-none absolute top-4 left-6 w-2 h-2 rounded-full bg-accent/40 animate-pulse" />
      <div className="pointer-events-none absolute bottom-8 right-6 w-1.5 h-1.5 rounded-full bg-accent/30 animate-ping" />
      <div className="pointer-events-none absolute top-1/4 right-4 w-2 h-2 rounded-full border border-border" />

      {/* Main transparent robot image, sized smaller so it doesn't cover the entire right side */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <img
          src={`/robot-frames/frame-${currentPadded}.png`}
          alt="Techinjections AI Robot"
          className="max-h-[340px] sm:max-h-[380px] w-auto object-contain drop-shadow-md transition-opacity duration-150"
          loading="eager"
          draggable={false}
        />
      </div>

      {/* Loading spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}
    </div>
  );
};
