import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Brain, ChevronDown, ArrowRight } from "lucide-react";
import { HERO_CONTENT } from "@/data/heroContent";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { RobotSequence } from "./RobotSequence";

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative w-full min-h-[calc(100svh-5rem)] lg:min-h-[calc(100svh-9rem)] flex flex-col justify-between overflow-hidden">
      <TopoBackground
        background="#ffffff"
        className="w-full min-h-[calc(100svh-5rem)] lg:min-h-[calc(100svh-9rem)] flex flex-col justify-between bg-white pt-24 sm:pt-24 lg:pt-16 pb-6"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-grow flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
            {/* Left Content (58% on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Headline */}
              <h1
                className="font-heading font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6"
                style={{
                  fontSize: "clamp(2.5rem, 4.8vw, 4.25rem)",
                }}
              >
                Engineering Intelligence.
                <br />
                <span className="text-slate-900">Building What's Next.</span>
              </h1>

              {/* 3. Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8 font-sans font-normal">
                {HERO_CONTENT.subheadline}
              </p>

              {/* 4. CTA Row */}
              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <motion.a
                  href="#capabilities"
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm sm:text-base font-semibold font-sans bg-accent text-white shadow-md w-full sm:w-auto"
                >
                  <span>{HERO_CONTENT.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>

                <motion.a
                  href="#contact"
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-semibold font-sans border border-slate-300 text-slate-800 w-full sm:w-auto bg-white/60 shadow-sm"
                >
                  <span>{HERO_CONTENT.secondaryCta}</span>
                </motion.a>
              </div>

              {/* 5. Trust Line */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/80 text-xs sm:text-sm text-text-secondary font-mono">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>8+ yrs</span>
                </div>
                <span className="text-border text-base">•</span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span>10+ engineers</span>
                </div>
                <span className="text-border text-base">•</span>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-accent" />
                  <span>AI-first</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual for mobile (< lg) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="lg:hidden w-full flex items-end justify-center relative mt-6"
            >
              <RobotSequence
                frameInterval={75}
                maxHeight="480px"
                className="w-full max-w-md"
              />
            </motion.div>

            {/* Grid spacer for desktop */}
            <div className="hidden lg:block lg:col-span-5" />
          </div>
        </div>

        {/* Full-height bottom-anchored Hero Visual on desktop (stretching from top to bottom) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="hidden lg:flex lg:absolute lg:right-2 xl:right-8 2xl:right-16 lg:bottom-0 lg:top-16 xl:top-12 lg:w-[50%] xl:w-[48%] 2xl:w-[46%] pointer-events-none z-10 items-end justify-end overflow-hidden"
        >
          <RobotSequence
            frameInterval={75}
            maxHeight="none"
            className="relative left-6 -top-8 w-full h-full flex items-end justify-end lg:scale-90"
          />
        </motion.div>

        {/* Scroll cue centered inside background at bottom edge */}
        <div className="w-full flex justify-center pt-2 pb-2 z-20 pointer-events-auto">
          <a
            href="#about"
            aria-label="Scroll to Company Introduction"
            className="p-2 text-text-secondary"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </a>
        </div>
      </TopoBackground>
    </section>
  );
};
