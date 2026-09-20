import React, { useEffect, useRef } from "react";
import { SERVICES_LIST, type ServiceItem } from "@/data/servicesData";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import BlueMeshyBackground from "@/components/ui/blue-meshy-background";

interface ServicesPageProps {
  onNavigateHome?: (hash?: string) => void;
}

// ─── Slide-reveal hook (IntersectionObserver, plays once) ─────────────────────
function useSlideReveal(direction: "left" | "right") {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial style
    const xOffset = direction === "right" ? "60px" : "-60px";
    el.style.opacity = "0";
    el.style.transform = `translateX(${xOffset})`;
    el.style.transition = "opacity 0.7s ease-out, transform 0.7s ease-out";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateX(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction]);

  return ref;
}

// ─── Individual service section ───────────────────────────────────────────────
const ServiceSection: React.FC<{ service: ServiceItem; index: number }> = ({
  service,
  index,
}) => {
  const isEven = index % 2 === 1;

  // Images on right side (odd-indexed, isEven=true) slide from right; text/left side slides from left
  const imageDir = isEven ? "right" : "left";
  const textDir = isEven ? "left" : "right";

  const imageRef = useSlideReveal(imageDir);
  const textRef = useSlideReveal(textDir);

  const renderServiceImageFrame = (service: ServiceItem) => {
    switch (service.frameType) {
      case "cyber":
        return (
          <div className="service-image-frame relative group rounded-3xl p-3 bg-gradient-to-br from-cyan-500/25 via-blue-600/15 to-purple-600/25 shadow-2xl border border-cyan-400/40 overflow-hidden backdrop-blur-md transition-all duration-500 hover:shadow-[0_15px_45px_-10px_rgba(6,182,212,0.35)]">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 flex items-center justify-center">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/35 flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-cyan-300 tracking-wider uppercase">{service.badgeText}</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-slate-900/90 border border-cyan-500/35 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-lg transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      case "blueprint":
        return (
          <div className="service-image-frame relative group rounded-3xl p-3.5 bg-white/95 border-2 border-indigo-200/90 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.25)]">
            <div className="relative rounded-2xl overflow-visible aspect-[500/345] bg-gradient-to-br from-indigo-50/60 via-white to-indigo-50/40 flex items-center justify-center p-3">
              <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <img src={service.image} alt={service.title} className="relative z-10 block w-full h-auto object-contain" />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 border border-indigo-200 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-[11px] font-mono font-bold text-indigo-700 tracking-wider uppercase">{service.badgeText}</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white border border-indigo-200 shadow-md flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      case "document":
        return (
          <div className="service-image-frame relative group rounded-3xl p-3.5 bg-gradient-to-br from-blue-400/20 via-indigo-500/15 to-sky-400/20 border-2 border-blue-500/40 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_45px_-8px_rgba(37,99,235,0.3)]">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 flex items-center justify-center">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-900/90 border border-blue-400/40 shadow-sm flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-blue-300 tracking-wider uppercase">{service.badgeText}</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-slate-900/90 border border-blue-400/40 shadow-md flex items-center justify-center text-blue-400 backdrop-blur-md transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      case "workflow":
        return (
          <div className="service-image-frame relative group rounded-3xl p-3.5 bg-white border-2 border-emerald-500/35 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(16,185,129,0.25)]">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/20 flex items-center justify-center p-3">
              <img src={service.image} alt={service.title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 border border-emerald-300 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono font-bold text-emerald-800 tracking-wider uppercase">{service.badgeText}</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white border border-emerald-200 shadow-md flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      case "browser":
        return (
          <div className="service-image-frame relative group rounded-2xl overflow-hidden border-2 border-slate-700/70 bg-slate-900 shadow-2xl transition-all duration-500 hover:shadow-[0_15px_45px_-10px_rgba(30,41,59,0.4)]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <div className="text-[11px] font-mono text-slate-300 bg-slate-950/80 px-3 py-0.5 rounded-md border border-slate-700/60">https://techinjections.com/web-scale</div>
              <div className="w-8" />
            </div>
            <div className="relative aspect-[4/3] bg-slate-950 flex items-center justify-center p-2">
              <img src={service.image} alt={service.title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-600/50 shadow-md flex items-center justify-center text-cyan-400 backdrop-blur-md transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      case "smartphone":
        return (
          <div className="service-image-frame relative group mx-auto max-w-[340px] sm:max-w-[380px] rounded-[36px] p-3 bg-slate-900 border-4 border-slate-700/90 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_45px_-10px_rgba(30,41,59,0.5)]">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20" />
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/5] bg-black flex items-center justify-center">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-black/80 border border-white/20 shadow-md flex items-center justify-center text-white backdrop-blur-md transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      case "network":
        return (
          <div className="service-image-frame relative group rounded-3xl p-3.5 bg-slate-900 border-2 border-indigo-400/40 shadow-[0_12px_40px_-10px_rgba(99,102,241,0.3)] overflow-hidden transition-all duration-500 hover:shadow-[0_15px_45px_-8px_rgba(99,102,241,0.45)]">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 flex items-center justify-center">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-900/90 border border-indigo-400/40 shadow-sm flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-indigo-300 tracking-wider uppercase">{service.badgeText}</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-slate-900/90 border border-indigo-400/40 shadow-md flex items-center justify-center text-indigo-300 backdrop-blur-md transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      case "infinity":
        return (
          <div className="service-image-frame relative group rounded-3xl p-3.5 bg-white border-2 border-sky-400/50 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_45px_-8px_rgba(14,165,233,0.3)]">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-sky-50/50 via-white to-slate-50 flex items-center justify-center p-3">
              <img src={service.image} alt={service.title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 border border-sky-300 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-sky-800 tracking-wider uppercase">{service.badgeText}</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white border border-sky-300 shadow-md flex items-center justify-center text-sky-600 transition-transform group-hover:scale-110">
                <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-current stroke-[1.8] fill-none">{service.svg}</svg>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id={service.id}
      className={`relative py-20 sm:py-24 px-6 sm:px-10 transition-colors duration-500 bg-gradient-to-b ${service.bgGradient}`}
    >
      <div className="max-w-[1180px] mx-auto">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${isEven ? "lg:flex-row-reverse" : ""}`}>

          {/* Media Column — slides in from its side */}
          <div ref={imageRef} className="relative z-0 w-full min-w-0 sm:w-[80%] lg:w-[40%] flex-shrink-0">
            {renderServiceImageFrame(service)}
          </div>

          {/* Content Column — slides in from opposite side */}
          <div ref={textRef} className="relative z-10 flex-1 min-w-0">
            {/* Bold numbered heading */}
            <p className="text-[25px] sm:text-[29px] lg:text-[32px] font-black font-heading uppercase tracking-normal text-[#1D4ED8] mb-2 select-none">
              {service.heading}
            </p>

            {/* Title — matches the body copy scale */}
            <h2 className="text-base sm:text-lg font-sans font-semibold text-[var(--ink)] tracking-tight leading-relaxed max-w-[54ch]">
              {service.title}
            </h2>

            {/* Featured Note */}
            {service.note && (
              <p className="text-sm font-semibold text-[#2563EB] mt-3 font-mono flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-ping" />
                <span>{service.note}</span>
              </p>
            )}

            {/* Body Paragraph */}
            <p className="text-base sm:text-lg text-[var(--ink-soft)] leading-relaxed mt-4 max-w-[54ch]">
              {service.description}
            </p>

            {/* Capabilities Box */}
            <div className="capabilities-box shadow-md bg-white/95 backdrop-blur-sm">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-3">
                {service.capsLabel}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {service.chips.map((chip) => (
                  <span key={chip} className="service-chip shadow-xs">{chip}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigateHome }) => {
  const handleGlobalNavigate = (page: "home" | "services", hash?: string) => {
    if (page === "home") {
      if (onNavigateHome) onNavigateHome(hash);
    } else if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="services-page min-h-screen bg-[#FAFAF8] text-[var(--ink)] selection:bg-[var(--coral)] selection:text-white font-sans">
      <Header activePage="services" onNavigate={handleGlobalNavigate} />

      {/* Hero */}
      <header className="services-hero-gradient relative flex min-h-[100svh] items-center overflow-hidden bg-white px-6 pb-16 pt-28 sm:px-10 sm:pt-32 lg:pb-24">
        <BlueMeshyBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="services-hero-copy max-w-[760px]">
            <p className="text-sm font-bold tracking-widest uppercase text-[#0F2A52] mb-4 font-mono">✦ Services</p>
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-heading font-extrabold text-[#0F2A52] leading-[1.08] tracking-[-0.03em]">
              <span>Engineering built around your data,</span>{" "}
              <span className="text-[#0F2A52]">not around a demo.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#294A70] leading-relaxed mt-6 max-w-[52ch] font-normal">
              Eight capability areas, one engineering team — from generative AI applications to the cloud infrastructure that keeps them running.
            </p>
          </div>

          <div className="services-hero-image-wrap" aria-label="Business technology professional">
            <img
              src="/servicesheropngimage.png"
              alt="Technology professional holding a laptop"
              className="services-hero-image"
            />
          </div>
        </div>
      </header>

      {/* Service Sections */}
      <main className="w-full">
        {SERVICES_LIST.map((service, index) => (
          <ServiceSection key={service.id} service={service} index={index} />
        ))}
      </main>

      <Footer onNavigate={handleGlobalNavigate} />
    </div>
  );
};

