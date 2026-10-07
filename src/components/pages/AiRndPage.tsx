import React, { useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TechMapStack } from "@/components/sections/TechMapStack";

interface AiRndPageProps {
  onNavigate: (page: "home" | "services" | "ai-rnd", hash?: string) => void;
}

export const AiRndPage: React.FC<AiRndPageProps> = ({ onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="ai-rnd-page min-h-screen bg-bg-base text-text-primary font-sans">
      <Header activePage="ai-rnd" onNavigate={onNavigate} />

      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-16 pt-28 sm:px-10 sm:pt-32 lg:pb-24 text-white">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/services.jpeg"
            aria-hidden="true"
          >
            <source src="/ai-rnd-hero.mp4" type="video/mp4" />
            <source src="/AI%26R%26D%20HERO%20.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

          <div className="relative z-10 mx-auto w-full max-w-[1180px]">
            <div className="max-w-2xl text-left">
              <h1
                className="font-heading font-extrabold text-white tracking-tight leading-[1.12]"
                style={{
                  fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                }}
              >
                Research Today.
                <br />
                <span className="text-white/95">Engineer Tomorrow.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/85 font-sans font-normal">
                At Techinjections, research is part of engineering. We explore emerging technologies, experiment with new AI approaches, and transform promising ideas into practical business applications.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Technology Map Card Stack Animation */}
        <TechMapStack />
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
