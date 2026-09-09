import React from "react";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { CORE_CAPABILITIES } from "@/data/heroContent";
import { Sparkles } from "lucide-react";

// Map capabilities to slides with relevant imagery
const CAPABILITY_IMAGE_MAP: Record<string, string> = {
  "01": "/capabilities/cap_ai.png",
  "02": "/capabilities/cap_ml.png",
  "03": "/capabilities/cap_auto.png",
  "04": "/capabilities/cap_se.png",
  "05": "/capabilities/cap_doc.png",
  "06": "/capabilities/cap_rnd.png",
};

// Map capabilities to slides with user attached imagery and exact content
const CAPABILITY_SLIDES: CoverflowSlide[] = CORE_CAPABILITIES.map((cap) => {
  return {
    src: CAPABILITY_IMAGE_MAP[cap.number] || "/capabilities/cap_ai.png",
    alt: `${cap.number} – ${cap.title}`,
    number: cap.number,
    title: cap.title,
    subtitle: `Capability ${cap.number}`,
    description: cap.description,
    meta: [
      { label: "Overview", value: cap.description }
    ],
  };
});

export const CoreCapabilities: React.FC = () => {
  return (
    <section id="capabilities" className="py-24 bg-bg-base overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-3 text-xs font-mono font-semibold tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
            What We Build
          </h2>
          <p className="mt-3.5 text-slate-600 text-base sm:text-lg font-sans leading-relaxed font-normal">
            Engineered AI systems and software infrastructure built for operational reliability and real workflows.
          </p>
        </div>

        <div className="w-full">
          <CoverflowCarousel
            slides={CAPABILITY_SLIDES}
            showCaption={true}
            showPagination={true}
            showNavigation={true}
            cardWidth="clamp(300px, 32vw, 440px)"
            className="py-4"
          />
        </div>
      </div>
    </section>
  );
};
