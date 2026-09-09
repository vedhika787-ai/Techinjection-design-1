export interface NavItem {
  label: string;
  href: string;
}

export interface TrustStat {
  icon: string;
  label: string;
}

export interface CapabilityCard {
  number: string;
  title: string;
  description: string;
  icon: string;
  isWide?: boolean;
}

export interface FlowStepItem {
  id: number;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#capabilities" },
  { label: "AI & R&D", href: "#use-case" },
  { label: "Technologies", href: "#technologies" },
  { label: "Integrations", href: "#integrations" },
  { label: "Work", href: "#work" },
  { label: "Contact Us", href: "#contact" },
];

export const HERO_CONTENT = {
  eyebrow: "Engineering · AI · R&D",
  headline: "Engineering Intelligence. Building What's Next.",
  subheadline:
    "Techinjections combines deep software engineering, artificial intelligence, automation and research-driven innovation to build intelligent digital solutions for modern businesses.",
  primaryCta: "Explore Our Services",
  secondaryCta: "Talk to Our Experts",
  trustStats: [
    { icon: "Clock", label: "8+ yrs" },
    { icon: "Users", label: "10+ engineers" },
    { icon: "Brain", label: "AI-first" },
  ],
};

export const COMPANY_INTRO = {
  eyebrow: "Who we are",
  subheading: "Technology built around engineering",
  body: "Techinjections is an engineering-led technology company — not a generic IT vendor. We build AI systems, automation platforms, and enterprise software for teams that need real technical depth, not just delivery.",
  stats: [
    { value: "8+", unit: "years", label: "of engineering excellence" },
    { value: "10+", unit: "engineers", label: "specialists & researchers" },
  ],
};

export const CORE_CAPABILITIES: CapabilityCard[] = [
  {
    number: "01",
    title: "Artificial Intelligence",
    description: "AI systems, intelligent assistants, generative AI, AI agents and business process intelligence.",
    icon: "Bot",
    isWide: true,
  },
  {
    number: "02",
    title: "Machine Learning",
    description: "Predictive models, classification, recommendation systems, forecasting and intelligent decision systems.",
    icon: "LineChart",
    isWide: false,
  },
  {
    number: "03",
    title: "Intelligent Automation",
    description: "RPA, workflow automation, document processing and automated business operations.",
    icon: "Cpu",
    isWide: false,
  },
  {
    number: "04",
    title: "Software Engineering",
    description: "Enterprise web applications, business platforms, APIs, microservices and custom software development.",
    icon: "Layers",
    isWide: true,
  },
  {
    number: "05",
    title: "Document Intelligence",
    description: "OCR, document extraction, classification, data validation and intelligent document workflows.",
    icon: "FileSearch",
    isWide: true,
  },
  {
    number: "06",
    title: "R&D Innovation",
    description: "Research-driven experimentation, prototypes, AI models and emerging technology solutions.",
    icon: "Sparkles",
    isWide: false,
  },
];

export const FEATURED_USE_CASE = {
  eyebrow: "AI use case",
  headline: "From Email to Quotation — Automatically",
  problemTag: "Manual quotation from emails",
  flowSteps: [
    { id: 1, label: "Email in", icon: "Mail" },
    { id: 2, label: "AI reads & extracts", icon: "FileSearch" },
    { id: 3, label: "Validates data", icon: "CheckSquare" },
    { id: 4, label: "Applies rate rules", icon: "Sliders" },
    { id: 5, label: "Builds quote", icon: "FileText" },
    { id: 6, label: "Sends reply", icon: "Send" },
  ],
  techTags: [
    "NLP",
    "LLM",
    "OCR",
    "Entity extraction",
    "Workflow automation",
  ],
  resultLine:
    "A process that used to depend on manual email reading now runs automatically, end to end.",
  ctaText: "Explore this use case →",
};

export const FOOTER_DATA = {
  companyDescription:
    "Engineering intelligence through artificial intelligence, enterprise software, and research-led automation.",
  services: [
    "01 – AI & Generative AI",
    "02 – ML & DL",
    "03 – Document Intelligence",
    "04 – Intelligent Automation & RPA",
    "05 – Web Application Development",
    "06 – Mobile Application Development",
    "07 – API & System Integration",
    "08 – Cloud & DevOps",
  ],
  technologies: [
    "Integrations",
    "Enterprise APIs",
    "Cloud Infrastructure",
    "Vector Databases",
    "Autonomous Agents",
  ],
  work: [
    "Case Studies",
    "AI Quotation Automation",
    "Document Extraction Platform",
    "Enterprise Microservices",
  ],
  contact: {
    email: "contact@techinjections.com",
    phone: "+1 (555) 382-9400",
    address: "Global Tech Hub · Silicon Valley · Bengaluru",
  },
};
