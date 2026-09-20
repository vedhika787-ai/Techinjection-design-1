import React, { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FEATURED_USE_CASE } from "@/data/heroContent";

const WORKFLOW_STEPS = [
  { id: "01", title: "Email In", desc: "A customer's RFQ arrives by email with shipment details, pricing requests, tables, and supporting documents.", image: "/Email in.png", background: "bg-[#8c9574]" },
  { id: "02", title: "AI Reads & Extracts", desc: "AI understands both structured and unstructured content, extracting shipment details from the email, tables, PDFs, and attached documents.", image: "/ai read & extract.png", background: "bg-[#101826]" },
  { id: "03", title: "Validates Data", desc: "Extracted information is validated before pricing begins. Missing, inconsistent, or incorrect data is automatically flagged for review.", image: "/validates data.png", background: "bg-white" },
  { id: "04", title: "Applies Rate Rules", desc: "The system applies the relevant rate cards and business rules to calculate the quotation based on the shipment requirements.", image: "/applies rate rules.png", background: "bg-[#efe9dd]" },
  { id: "05", title: "Builds Quote", desc: "Once pricing is confirmed, the system generates a structured quotation with shipment details, applicable charges, and customer-specific pricing.", image: "/builds quote.png", background: "bg-[#6e4fe8]" },
  { id: "06", title: "Sends Reply", desc: "The completed quotation is attached to an AI-generated response and sent back to the customer, reducing manual follow-up.", image: "/sends reply.png", background: "bg-[#2563eb]" },
];

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export const FeaturedUseCase: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<SVGPathElement>(null);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const connector = connectorRef.current;
    if (!track || !connector) return;

    const drawConnector = () => {
      const trackRect = track.getBoundingClientRect();
      const points = pinRefs.current
        .filter((pin): pin is HTMLSpanElement => pin !== null)
        .map((pin) => {
          const pinRect = pin.getBoundingClientRect();
          return { x: pinRect.left + pinRect.width / 2 - trackRect.left, y: pinRect.top + pinRect.height / 2 - trackRect.top };
        });

      if (points.length < 2) return;
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let index = 0; index < points.length - 1; index += 1) {
        const current = points[index];
        const next = points[index + 1];
        const middleY = (current.y + next.y) / 2;
        path += ` C ${current.x} ${middleY}, ${next.x} ${middleY}, ${next.x} ${next.y}`;
      }

      connector.setAttribute("d", path);
      const length = connector.getTotalLength();
      connector.style.strokeDasharray = `${length}`;
      connector.style.strokeDashoffset = `${length}`;
      requestAnimationFrame(() => { connector.style.strokeDashoffset = "0"; });
    };

    const resizeObserver = new ResizeObserver(drawConnector);
    resizeObserver.observe(track);
    drawConnector();
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section id="use-case" className="relative overflow-hidden bg-white py-20 font-heading text-[#15181f] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={revealVariants} className="mx-auto mb-20 max-w-2xl text-center sm:mb-24">
          <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">AI-Powered NVOCC Quotation Automation</h2>
          <p className="mt-3 text-lg font-medium text-[#5c6270] sm:text-xl">{FEATURED_USE_CASE.headline}</p>
          <span className="mt-5 inline-flex rounded-full border border-[#e7e3da] bg-white px-4 py-2.5 text-sm font-bold text-[#5c6270] shadow-sm">Problem solved: {FEATURED_USE_CASE.problemTag}</span>
        </motion.div>

        <div ref={trackRef} className="relative">
          <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible lg:block" aria-hidden="true">
            <path ref={connectorRef} fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="3" style={{ transition: "stroke-dashoffset 1.4s ease" }} />
          </svg>

          {WORKFLOW_STEPS.map((step, index) => {
            const isRight = index % 2 === 1;
            return (
              <motion.article key={step.id} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={revealVariants} className={`relative z-10 mb-20 grid items-center gap-8 last:mb-0 lg:mb-28 lg:grid-cols-2 lg:gap-14 ${isRight ? "lg:[&>.workflow-visual]:order-2 lg:[&>.workflow-copy]:order-1 lg:[&>.workflow-copy]:text-right" : ""}`}>
                <div className="workflow-visual relative flex justify-center">
                  <span ref={(element) => { pinRefs.current[index] = element; }} className="absolute -top-5 left-1/2 z-20 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-transparent bg-[#2563eb] text-sm font-black text-white shadow-lg shadow-[#2563eb]/30">{step.id}</span>
                  <div className="inline-flex max-w-full items-center justify-center overflow-hidden rounded-[22px] border border-[#d9d5cb] bg-white p-2 shadow-[0_18px_40px_-22px_rgba(16,24,38,0.35)] sm:p-3">
                    <img src={step.image} alt="" className="block max-h-[240px] max-w-full object-contain transition duration-500 hover:scale-105 sm:max-h-[280px]" />
                  </div>
                </div>
                <div className="workflow-copy lg:pt-2">
                  <h3 className="text-2xl font-extrabold sm:text-3xl">{step.title}</h3>
                  <p className="mt-2 max-w-lg text-base leading-7 text-[#5c6270] sm:text-lg">{step.desc}</p>
                  <a href="#contact" className="mt-5 inline-flex items-center gap-2 text-base font-bold text-[#15181f]">
                    See how it works
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#101826] text-white transition-transform duration-200 hover:translate-x-1"><ArrowRight className="h-4 w-4" /></span>
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-6 border-t border-[#e7e3da] pt-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold uppercase tracking-[0.16em] text-[#5c6270]">Powered by</span>
            {FEATURED_USE_CASE.techTags.map((tag) => <span key={tag} className="rounded-full border border-[#e7e3da] bg-white px-3.5 py-2 text-sm font-semibold text-[#15181f]">{tag}</span>)}
          </div>
          <div className="flex items-center gap-3 text-base font-semibold text-[#5c6270] sm:text-lg"><CheckCircle2 className="h-5 w-5 text-[#2563eb]" />{FEATURED_USE_CASE.resultLine}</div>
        </div>

        <div className="mt-9 text-center"><a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#2563eb]/20 transition hover:bg-[#1d4ed8]">{FEATURED_USE_CASE.ctaText}<ArrowRight className="h-4 w-4" /></a></div>
      </div>
    </section>
  );
};
