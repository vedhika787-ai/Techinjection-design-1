import React from "react";
import { motion, type Variants } from "framer-motion";
import { COMPANY_INTRO } from "@/data/heroContent";
import { Award, Code2, Sparkles } from "lucide-react";

export const CompanyIntro: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="about" className="py-24 bg-surface border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (50%) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* 1. Section label pill */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-slate-800 bg-slate-100 border border-slate-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {COMPANY_INTRO.eyebrow}
              </span>
            </motion.div>

            {/* 2. Sub-heading */}
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 tracking-tight leading-tight mb-6"
            >
              {COMPANY_INTRO.subheading}
            </motion.h2>

            {/* 3. Body copy (~40 words max) */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-normal mb-8"
            >
              {COMPANY_INTRO.body}
            </motion.p>

            {/* 4. Inline stat row */}
            <motion.div
              variants={itemVariants}
              className="w-full pt-6 border-t border-border grid grid-cols-2 gap-6"
            >
              <div className="space-y-1">
                <div className="flex items-baseline gap-2 font-mono font-extrabold text-3xl sm:text-4xl text-slate-900">
                  <span className="text-accent">8+</span>
                  <span className="text-sm font-semibold text-slate-500 font-sans">years</span>
                </div>
                <p className="text-xs font-sans font-medium text-slate-500">Deep software engineering & R&D</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2 font-mono font-extrabold text-3xl sm:text-4xl text-slate-900">
                  <span className="text-accent">10+</span>
                  <span className="text-sm font-semibold text-slate-500 font-sans">engineers</span>
                </div>
                <p className="text-xs font-sans font-medium text-slate-500">Technical depth & AI specialists</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 w-full"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border bg-bg-base p-3 shadow-md group">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="/teamwork.jpeg"
                  alt="Techinjections Engineering Teamwork"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent-dark/80 via-accent-dark/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs font-mono font-medium text-white/90 uppercase tracking-wider">
                      Collaborative Engineering
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-white">
                    Teamwork Makes The Dream Work
                  </h3>
                </div>
              </div>

              {/* Badges footer on card */}
              <div className="mt-3 px-2 py-2 flex items-center justify-between text-xs font-mono text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  <span>Research-Driven</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-accent" />
                  <span>Production-Grade</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
