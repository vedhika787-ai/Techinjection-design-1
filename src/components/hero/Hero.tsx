import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Brain, ChevronDown, ArrowRight } from "lucide-react";
import { HERO_CONTENT } from "@/data/heroContent";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { RobotSequence } from "./RobotSequence";

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
      <TopoBackground className="w-full min-h-screen flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-6">
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm sm:text-base font-semibold font-sans bg-accent text-white hover:bg-accent-hover transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                  <span>{HERO_CONTENT.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-semibold font-sans border border-slate-300 text-slate-800 hover:bg-accent/5 hover:border-accent hover:text-accent transition-colors w-full sm:w-auto bg-white/60 shadow-sm"
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

            {/* Right Robot Visual (45% on desktop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="lg:col-span-5 w-full flex items-center justify-center relative mt-6 lg:mt-0"
            >
              <RobotSequence
                totalFrames={40}
                frameInterval={80}
                className="w-full max-w-md lg:max-w-none"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll cue centered inside background at bottom edge */}
        <div className="w-full flex justify-center pt-2 pb-2 z-10">
          <a
            href="#about"
            aria-label="Scroll to Company Introduction"
            className="p-2 text-text-secondary hover:text-accent transition-colors"
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
