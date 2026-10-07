import React, { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import "./TechMapStack.css";

export type Area = {
  title: string;
  tagline: string;
  description: string;
  points: string[];
  image?: string;
  color: string;
};

export const AREAS: Area[] = [
  {
    title: "Agentic AI",
    tagline: "AI agents that think, plan and act",
    description:
      "We build autonomous AI agents that can reason through a goal, break it into steps, choose the right tools and carry out business tasks with minimal supervision, while keeping humans in the loop where it matters.",
    points: ["Multi-step reasoning & planning", "Tool and API calling", "Human-in-the-loop approvals"],
    color: "#f1e0d3",
    image: "/services/service_01.png",
  },
  {
    title: "RAG",
    tagline: "Your knowledge, connected to AI",
    description:
      "Retrieval-Augmented Generation links language models to your enterprise documents, wikis and databases, so answers are grounded in your own trusted data, with sources, instead of guesses.",
    points: ["Vector search & embeddings", "Source-cited answers", "Secure, permission-aware access"],
    color: "#e6dcef",
    image: "/capabilities/cap_rnd.png",
  },
  {
    title: "Document Intelligence",
    tagline: "From unstructured files to structured data",
    description:
      "Invoices, contracts, forms and reports are read, classified and converted into clean structured data, ready to flow straight into your systems, cutting manual data entry and errors.",
    points: ["OCR & layout understanding", "Field & table extraction", "Validation and confidence scoring"],
    color: "#ffffd6",
    image: "/services/service_05.png",
  },
  {
    title: "Computer Vision",
    tagline: "Machines that see and understand",
    description:
      "Image and video analysis for detection, recognition and inspection. We turn visual inputs into actionable insight for quality control, safety monitoring, identity checks and more.",
    points: ["Object detection & tracking", "Defect and quality inspection", "Face & text recognition"],
    color: "#d9ecf5",
    image: "/capabilities/cap_ml.png",
  },
  {
    title: "NLP",
    tagline: "Understanding the language of business",
    description:
      "Natural language processing that reads emails, documents and messages to classify intent, extract entities, summarise long content and route work to the right people automatically.",
    points: ["Intent & sentiment analysis", "Summarisation & translation", "Entity extraction and routing"],
    color: "#dcf0e2",
    image: "/capabilities/cap_ai.png",
  },
  {
    title: "Predictive AI",
    tagline: "Forecast, classify, decide",
    description:
      "Machine-learning models that learn from historical data to forecast demand, flag risk, classify records and recommend the next best action, so decisions are faster and evidence-based.",
    points: ["Demand & trend forecasting", "Anomaly and risk detection", "Recommendation engines"],
    color: "#f7dbe4",
    image: "/services/service_02.png",
  },
  {
    title: "AI Automation",
    tagline: "Intelligence meets workflow",
    description:
      "We combine AI with RPA and business-process tools so repetitive, rule-heavy work runs end to end: AI handles the judgement, automation handles the clicks.",
    points: ["AI + RPA pipelines", "Workflow orchestration", "Exception handling with AI"],
    color: "#fbe8cc",
    image: "/services/service_03.png",
  },
  {
    title: "AI + Enterprise Systems",
    tagline: "AI inside the tools you already use",
    description:
      "AI capabilities integrated directly into ERP, CRM, logistics and other business platforms, so your teams get smart assistance inside their existing workflows without switching tools.",
    points: ["ERP & CRM integration", "Logistics & supply-chain AI", "APIs, connectors and SSO"],
    color: "#e0e3fa",
    image: "/services/service_04.png",
  },
];

const STACK_OFFSET = 16; // px each stuck card peeks below the previous one
const MAX_SHRINK = 0.06; // how much the covered card scales down (6%)

export function TechMapStack() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      cardRefs.current.forEach((card, i) => {
        const next = cardRefs.current[i + 1];
        const inner = innerRefs.current[i];
        if (!card || !inner || !next) return; // last card never shrinks

        const stickyTop = parseFloat(getComputedStyle(card).top) || 0;
        const stuckNextTop = stickyTop + STACK_OFFSET;
        const h = card.offsetHeight;

        // 0 = next card far below, 1 = next card fully covering this one
        const p = Math.min(
          1,
          Math.max(0, 1 - (next.getBoundingClientRect().top - stuckNextTop) / h)
        );

        inner.style.transform = `scale(${1 - p * MAX_SHRINK})`;
        inner.style.filter = `brightness(${1 - p * 0.08})`;
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="tm-section-wrap" id="technology-map">
      <div className="tm-section">
        <header className="tm-header">
          <span className="tm-eyebrow">
            <Sparkles className="w-3.5 h-3.5" />
            R&amp;D Areas
          </span>
          <h2 className="tm-title">Explore our interactive technology map</h2>
          <p className="tm-sub">
            <strong>Generative AI</strong> – exploring LLMs, enterprise AI and intelligent assistants.
          </p>
        </header>

        <div className="tm-stack">
          {AREAS.map((area, i) => (
            <article
              key={area.title}
              className="tm-card"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ top: `calc(var(--tm-top) + ${i * STACK_OFFSET}px)` }}
            >
              <div
                className="tm-card__inner"
                ref={(el) => {
                  innerRefs.current[i] = el;
                }}
                style={{ background: area.color }}
              >
                <div className="tm-card__text">
                  <div className="tm-card__meta-bar">
                    <span className="tm-card__num">{String(i + 1).padStart(2, "0")}</span>
                    <p className="tm-card__tagline">{area.tagline}</p>
                  </div>
                  <h3 className="tm-card__title">{area.title}</h3>
                  <p className="tm-card__desc">{area.description}</p>
                  <ul className="tm-card__points">
                    {area.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="tm-card__media">
                  {area.image ? (
                    <div className="tm-media-wrapper">
                      <img src={area.image} alt={area.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="tm-card__placeholder">Your image here</div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechMapStack;
