import React from "react";

export interface ServiceItem {
  id: string;
  number: string;
  heading: string;
  sideIndexTitle: string;
  title: string;
  note?: string;
  isFeatured?: boolean;
  description: string;
  capsLabel: string;
  chips: string[];
  image: string;
  imageFit?: "cover" | "contain";
  svg: React.ReactNode;
  bgColor: string;
  bgGradient: string;
  frameType:
    | "cyber"
    | "blueprint"
    | "document"
    | "workflow"
    | "browser"
    | "smartphone"
    | "network"
    | "infinity";
  badgeText: string;
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "s01",
    number: "01",
    heading: "01. AI & GENERATIVE AI",
    sideIndexTitle: "AI & Generative AI",
    title: "Artificial intelligence that solves real business problems",
    description:
      "We design and build AI-powered applications that combine intelligent models, business data and automated workflows — improving decision-making, productivity and operational efficiency.",
    capsLabel: "Capabilities",
    chips: [
      "Generative AI",
      "LLM applications",
      "AI agents",
      "RAG applications",
      "AI-powered search",
      "Intelligent decision systems",
    ],
    image: "/services/service_01.png",
    imageFit: "cover",
    bgColor: "#F6F8FC",
    bgGradient: "from-[#FAFBFD] via-[#F4F7FB] to-[#F7F6FC]",
    frameType: "cyber",
    badgeText: "AI Neural Core",
    svg: (
      <>
        <circle cx="24" cy="24" r="6" />
        <circle cx="24" cy="8" r="3" />
        <circle cx="40" cy="18" r="3" />
        <circle cx="40" cy="34" r="3" />
        <circle cx="24" cy="42" r="3" />
        <circle cx="8" cy="34" r="3" />
        <circle cx="8" cy="18" r="3" />
        <path d="M24 14v4M27.4 20.6l9.6-4.4M29 27l8 5M24 30v8M19 27l-8 5M18.6 20.6L9 16.2" />
      </>
    ),
  },
  {
    id: "s02",
    number: "02",
    heading: "02. ML & DEEP LEARNING",
    sideIndexTitle: "ML & Deep Learning",
    title: "Turn data into intelligence",
    description:
      "We design machine learning and deep learning systems that turn raw, messy data into forecasts, classifications and recommendations your team can act on.",
    capsLabel: "Capabilities",
    chips: [
      "Predictive analytics",
      "Forecasting",
      "Recommendation engines",
      "Anomaly detection",
      "Model training",
      "Model deployment",
    ],
    image: "/services/service_02.png",
    imageFit: "contain",
    bgColor: "#F7F6FC",
    bgGradient: "from-[#F7F6FC] via-[#F5F4FA] to-[#FDFBF7]",
    frameType: "blueprint",
    badgeText: "Deep Learning Flow",
    svg: (
      <>
        <path d="M8 40V22M18 40V12M28 40V26M38 40V16" />
        <path d="M6 40h36" />
      </>
    ),
  },
  {
    id: "s03",
    number: "03",
    heading: "03. DOCUMENT INTELLIGENCE",
    sideIndexTitle: "Document Intelligence",
    title: "From documents to structured intelligence",
    note: "Our most requested engineering service",
    isFeatured: true,
    description:
      "We turn unstructured documents — invoices, emails, contracts, container paperwork — into clean, validated, structured data your systems can use immediately.",
    capsLabel: "Capabilities",
    chips: [
      "OCR",
      "Invoice extraction",
      "Document classification",
      "Intelligent field extraction",
      "Automated document workflows",
      "Human-in-the-loop validation",
    ],
    image: "/services/service_03.png",
    imageFit: "cover",
    bgColor: "#FDFBF7",
    bgGradient: "from-[#FDFBF7] via-[#FAF6F0] to-[#F4F9F6]",
    frameType: "document",
    badgeText: "Doc Intelligence Hub",
    svg: (
      <>
        <path d="M14 6h14l8 8v28a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M28 6v8h8" />
        <path d="M17 26h14M17 32h14M17 20h6" />
      </>
    ),
  },
  {
    id: "s04",
    number: "04",
    heading: "04. AUTOMATION & RPA",
    sideIndexTitle: "Automation & RPA",
    title: "Automate processes. Reduce manual work.",
    description:
      "We combine RPA, rule-based logic and AI to automate the repetitive processes slowing your teams down — from data entry to full end-to-end workflows.",
    capsLabel: "Capabilities",
    chips: [
      "RPA",
      "Workflow automation",
      "Business process automation",
      "API automation",
      "AI-powered automation",
      "End-to-end automation",
    ],
    image: "/services/service_04.png",
    imageFit: "contain",
    bgColor: "#F4F9F6",
    bgGradient: "from-[#F4F9F6] via-[#F1F7F4] to-[#F5F7FA]",
    frameType: "workflow",
    badgeText: "RPA Automation Pipeline",
    svg: (
      <>
        <circle cx="24" cy="24" r="8" />
        <path d="M24 4v6M24 38v6M44 24h-6M10 24H4M37.5 10.5l-4.2 4.2M14.7 33.3l-4.2 4.2M37.5 37.5l-4.2-4.2M14.7 14.7l-4.2-4.2" />
      </>
    ),
  },
  {
    id: "s05",
    number: "05",
    heading: "05. WEB DEVELOPMENT",
    sideIndexTitle: "Web Development",
    title: "Enterprise web applications built for scale",
    description:
      "We build enterprise-grade web applications — ERP, CRM, logistics and finance systems — on modern, maintainable stacks that scale with your business.",
    capsLabel: "Technologies",
    chips: [
      "React",
      ".NET",
      "Python / Django",
      "Microservices",
      "REST APIs",
      "TypeScript",
    ],
    image: "/services/service_05.png",
    imageFit: "contain",
    bgColor: "#F5F7FA",
    bgGradient: "from-[#F5F7FA] via-[#F2F5F8] to-[#FAF5F5]",
    frameType: "browser",
    badgeText: "Enterprise Web Console",
    svg: (
      <>
        <rect x="6" y="10" width="36" height="26" rx="2" />
        <path d="M6 16h36" />
        <path d="M18 26l-4 4 4 4M26 26l4 4-4 4" />
      </>
    ),
  },
  {
    id: "s06",
    number: "06",
    heading: "06. MOBILE DEVELOPMENT",
    sideIndexTitle: "Mobile Development",
    title: "Technology beyond the desktop",
    description:
      "We build native and cross-platform mobile applications that extend your business processes into the field, online or off.",
    capsLabel: "Capabilities",
    chips: [
      "iOS",
      "Android",
      "Cross-platform apps",
      "Offline workflows",
      "Push notifications",
      "Mobile APIs",
    ],
    image: "/services/service_06.png",
    imageFit: "cover",
    bgColor: "#FAF5F5",
    bgGradient: "from-[#FAF5F5] via-[#F8F2F2] to-[#FAF7F2]",
    frameType: "smartphone",
    badgeText: "Mobile Ecosystem",
    svg: (
      <>
        <rect x="14" y="4" width="20" height="40" rx="4" />
        <path d="M14 34h20" />
        <circle cx="24" cy="39" r="1.4" fill="currentColor" />
      </>
    ),
  },
  {
    id: "s07",
    number: "07",
    heading: "07. API & INTEGRATION",
    sideIndexTitle: "API & Integration",
    title: "Connect systems. Connect data. Connect processes.",
    description:
      "We integrate the systems your business already runs on — ERPs, CRMs, payment gateways and cloud platforms — so data moves without manual handoffs.",
    capsLabel: "Capabilities",
    chips: [
      "REST API integration",
      "ERP integration",
      "CRM integration",
      "Cloud integration",
      "Data synchronization",
      "API gateways",
    ],
    image: "/services/service_07.png",
    imageFit: "cover",
    bgColor: "#FAF7F2",
    bgGradient: "from-[#FAF7F2] via-[#F8F4ED] to-[#F3F7FA]",
    frameType: "network",
    badgeText: "Unified API Mesh",
    svg: (
      <>
        <circle cx="12" cy="24" r="6" />
        <circle cx="36" cy="24" r="6" />
        <path d="M18 24h12" />
      </>
    ),
  },
  {
    id: "s08",
    number: "08",
    heading: "08. CLOUD & DEVOPS",
    sideIndexTitle: "Cloud & DevOps",
    title: "Deploy. Scale. Monitor. Improve.",
    description:
      "We deploy and manage cloud infrastructure on Azure and AWS, with CI/CD pipelines and monitoring that keep applications reliable at scale.",
    capsLabel: "Capabilities",
    chips: [
      "Microsoft Azure",
      "AWS",
      "Docker",
      "CI/CD",
      "Infrastructure automation",
      "Secure hosting",
    ],
    image: "/services/service_08.png",
    imageFit: "contain",
    bgColor: "#F3F7FA",
    bgGradient: "from-[#F3F7FA] via-[#EFF4F8] to-[#FFFFFF]",
    frameType: "infinity",
    badgeText: "Cloud & DevOps Architecture",
    svg: (
      <>
        <path d="M14 32a8 8 0 0 1-1-16 10 10 0 0 1 19-3 7 7 0 0 1 2 13.8" />
        <path d="M14 32h20" />
      </>
    ),
  },
];
